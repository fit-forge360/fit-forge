"""
data_fetcher.py — Fetch only the user's own data from internal services.

The user's JWT is forwarded as-is so each service validates it independently.
We only request user-specific data (keyed by userId) to keep the LLM context
small and avoid leaking other users' data.
"""

import asyncio
import httpx
from typing import Any

WORKOUT_URL   = "http://workout-service:5003"
NUTRITION_URL = "http://nutrition-service:5004"
PROGRESS_URL  = "http://progress-service:5005"


async def _safe_get(client: httpx.AsyncClient, url: str, token: str) -> Any:
    """GET a URL with the user's JWT; return parsed JSON or empty list on error."""
    try:
        resp = await client.get(
            url,
            headers={"Authorization": f"Bearer {token}"},
            timeout=5.0,
        )
        resp.raise_for_status()
        return resp.json()
    except Exception:
        return []


async def fetch_user_context(user_id: str, raw_token: str) -> dict:
    """
    Fetch workouts, nutrition logs, and progress entries for the given user.

    Returns a compact dict that will be stringified and injected into the
    LangChain system prompt. Keep this small — LLMs charge per token.
    """
    async with httpx.AsyncClient() as client:
        workouts, nutrition, progress = await asyncio.gather(
            _safe_get(client, f"{WORKOUT_URL}/workout/plans/{user_id}", raw_token),
            _safe_get(client, f"{NUTRITION_URL}/nutrition/logs/{user_id}", raw_token),
            _safe_get(client, f"{PROGRESS_URL}/progress/{user_id}", raw_token),
        )

    # ── Summarise to reduce token usage ───────────────────────────────────────

    workout_summary = [
        {
            "title": w.get("title"),
            "daysPerWeek": w.get("daysPerWeek"),
            "exercises": [
                f"{e.get('name')} ({e.get('sets')}x{e.get('reps')} reps)"
                for e in w.get("exercises", [])
            ],
        }
        for w in (workouts if isinstance(workouts, list) else [])
    ]

    nutrition_summary = [
        {
            "date": n.get("date"),
            "calories": n.get("totalCalories"),
            "protein": n.get("totalProtein"),
        }
        for n in (nutrition if isinstance(nutrition, list) else [])
    ][:7]  # last 7 entries max

    progress_summary = [
        {
            "date": p.get("date"),
            "weight": p.get("weight"),
            "note": p.get("note"),
        }
        for p in (progress if isinstance(progress, list) else [])
    ][:7]

    return {
        "workout_plans": workout_summary,
        "recent_nutrition": nutrition_summary,
        "recent_progress": progress_summary,
    }
