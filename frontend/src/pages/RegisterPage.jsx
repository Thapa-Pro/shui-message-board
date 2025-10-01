import React, { useState } from "react";
import { api } from "../simpleApi.js";
import { setAuth } from "../auth.js";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const res = await api.register({ username, password });
    if (!res.ok) return alert(res.error || "register failed");
    setAuth(res.data.token, res.data.username);
    nav("/");
  }

  return (
    <form className="box" onSubmit={submit}>
      <h2>Register</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Create account</button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
