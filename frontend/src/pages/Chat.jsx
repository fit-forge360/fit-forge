import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

/* ── Individual message bubble ─────────────────────────────────────────── */
function Message({ role, text }) {
  const isBot = role === 'bot';
  return (
    <div className={`chat-message ${isBot ? 'chat-message-bot' : 'chat-message-user'}`}>
      {isBot && <div className="chat-avatar">🤖</div>}
      <div className="chat-bubble">{text}</div>
      {!isBot && <div className="chat-avatar">👤</div>}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey! I'm FitBot 🏋️ — your AI fitness coach. Ask me anything about your workouts, nutrition, or progress!" },
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const { data } = await api.post('/api/ai/chat', { message: text });
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Something went wrong. Please try again.';
      setMessages((prev) => [...prev, { role: 'bot', text: `⚠️ ${errMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', padding: '24px 24px 0' }}>
        <h1 className="page-title">🤖 FitBot</h1>
        <p className="page-subtitle">Your AI fitness coach — powered by Gemini.</p>

        {/* ── Message feed ── */}
        <div className="chat-feed">
          {messages.map((m, i) => (
            <Message key={i} role={m.role} text={m.text} />
          ))}

          {loading && (
            <div className="chat-message chat-message-bot">
              <div className="chat-avatar">🤖</div>
              <div className="chat-bubble chat-typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input bar ── */}
        <form className="chat-input-bar" onSubmit={send}>
          <input
            className="input"
            placeholder="Ask FitBot anything… e.g. 'What workouts do I have this week?'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button className="btn btn-primary" type="submit" disabled={loading || !input.trim()}>
            {loading ? '…' : 'Send ➤'}
          </button>
        </form>
      </div>
    </>
  );
}
