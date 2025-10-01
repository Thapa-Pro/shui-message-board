import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../simpleApi.js";
import MessageCard from "../ui/MessageCard.jsx";

export default function UserPage() {
  const { username } = useParams();
  const [messages, setMessages] = useState([]);
  const [order, setOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    const res = await api.getMessagesByUser(username, order);
    if (!res.ok) setError(res.error || "failed to load");
    else setMessages(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [username, order]);

  return (
    <div className="feed">
      <div className="feedHeader">
        <h2>
          Messages by <span className="user">@{username}</span>
        </h2>
        <div className="row">
          <label>Sort:</label>
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !messages.length && <p>No messages from this user yet.</p>}

      <div className="list">
        {messages.map((m) => (
          <MessageCard key={m.id} msg={m} />
        ))}
      </div>

      <p>
        <Link to="/">← Back to all messages</Link>
      </p>
    </div>
  );
}
