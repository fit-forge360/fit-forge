"""
main.py — FastAPI entry point for the FitForge AI Agent microservice.

Endpoints:
  GET  /health  — Kubernetes/Docker liveness probe
  POST /chat    — Authenticated chatbot endpoint

Auth flow:
  1. Client sends  Authorization: Bearer <jwt>
  2. get_current_user() calls auth-service /auth/verify
  3. On success, userId is used to fetch the user's data from other services
  4. LangChain agent answers the question grounded on that data
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from auth import get_current_user
from data_fetcher import fetch_user_context
from agent import chat_with_agent


# ── Request / Response schemas ────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    user_id: str


# ── App setup ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle hooks (nothing heavy needed here)."""
    print("[ai-agent-service] Starting up…")
    yield
    print("[ai-agent-service] Shutting down…")


app = FastAPI(
    title="FitForge AI Agent",
    description="LangChain-powered fitness chatbot. Answers queries using the user's real data.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "OK", "service": "ai-agent-service"}


@app.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    authorization: str = Header(...),
    current_user: dict = Depends(get_current_user),
):
    """
    Main chat endpoint.

    - Validates JWT via auth-service (get_current_user dependency)
    - Fetches the user's workouts / nutrition / progress from internal services
    - Runs LangChain agent with the fetched context
    - Returns the LLM's answer
    """
    user_id = current_user.get("userId") or current_user.get("_id", "")

    # Extract the raw token to forward to data_fetcher
    raw_token = authorization.split(" ", 1)[1] if " " in authorization else authorization

    # Step 1: fetch only this user's data (not the whole DB)
    user_context = await fetch_user_context(user_id, raw_token)

    # Step 2: ask the LangChain agent
    reply = await chat_with_agent(body.message, user_context)

    return ChatResponse(reply=reply, user_id=user_id)
