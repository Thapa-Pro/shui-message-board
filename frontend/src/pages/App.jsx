import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { isLoggedIn, getUsername, clearAuth } from "../auth.js";

export default function App() {
  const nav = useNavigate();
  const logged = isLoggedIn();
  const name = getUsername();

  function logout() {
    clearAuth();
    nav(0); // refresh page
  }

  return (
    <div className="container">
      <header className="topbar">
        <h1>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            Shui – Message Board
          </Link>
        </h1>
        <div style={{ float: "right", marginTop: 4 }}>
          {logged ? (
            <>
              <Link to={`/user/${encodeURIComponent(name)}`} className="user">
                @{name}
              </Link>{" "}
              <button onClick={logout} style={{ marginLeft: 8 }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link> |{" "}
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
