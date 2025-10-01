import React, { useEffect, useState } from "react";
import { api } from "../simpleApi.js";
import { isLoggedIn, getUsername } from "../auth.js";
import MessageCard from "../ui/MessageCard.jsx";

export default function FeedPage() {
  const logged = isLoggedIn();
  const myName = getUsername();

  // view: 'newest' | 'oldest' | 'mine'
  const [view, setView] = useState("newest");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state
  const [username, setUsername] = useState(logged ? myName : "");
  const [text, setText] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    if (view === "mine") {
      if (!logged) {
        alert("Please login to see only your messages.");
        setView("newest");
        setLoading(false);
        return;
      }
      const res = await api.getMessagesByUser(myName, "newest");
      if (!res.ok) setError(res.error || "failed to load");
      else setMessages(res.data);
      setLoading(false);
      return;
    }
    const res = await api.getMessages(view);
    if (!res.ok) setError(res.error || "failed to load");
    else setMessages(res.data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, [view, logged, myName]);

  async function handleSubmit(e) {
    e.preventDefault();
    const name = logged ? myName : username;
    if (!name.trim() || !text.trim())
      return alert("username and text are required");
    const res = await api.createMessage({ username: name, text });
    if (!res.ok) return alert(res.error || "failed to post");
    setText("");
    if (!logged) setUsername("");
    load();
  }

  async function handleEdit(msg) {
    const newText = window.prompt("Edit message text:", msg.text);
    if (newText == null) return;
    if (!newText.trim()) return alert("text is required");
    const res = await api.updateMessage(msg.id, { text: newText });
    if (!res.ok) return alert(res.error || "failed to update");
    load();
  }

  async function handleDelete(msg) {
    const yes = window.confirm("Delete this message?");
    if (!yes) return;
    const res = await api.deleteMessage(msg.id);
    if (!res.ok) return alert(res.error || "failed to delete");
    load();
  }

  const heading = view === "mine" ? "My Messages" : "All Messages";

  return (
    <div className="feed">
      <div className="feedHeader">
        <h2 className="feedTitle">{heading}</h2>
        <div className="sortGroup">
          <label htmlFor="sortSel">Sort:</label>
          <select
            id="sortSel"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            {logged && <option value="mine">My messages</option>}
          </select>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !messages.length && <p>No messages yet.</p>}

      <div className="list">
        {messages.map((m) => {
          const isMine = logged && m.username === myName;
          return (
            <MessageCard
              key={m.id}
              msg={m}
              onEdit={isMine ? handleEdit : undefined}
              onDelete={isMine ? handleDelete : undefined}
            />
          );
        })}
      </div>

      <form className="box" onSubmit={handleSubmit}>
        <h3>Write a message</h3>
        <input
          placeholder="Username"
          value={logged ? myName : username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={logged}
        />
        <textarea
          placeholder="Your message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
        />
        <button type="submit" className="btn btn-success full">
          Publish
        </button>
      </form>
    </div>
  );
}
