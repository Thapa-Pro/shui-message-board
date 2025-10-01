import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { isLoggedIn, getUsername, clearAuth } from "../auth.js";

export default function App() {
  const nav = useNavigate();
  const logged = isLoggedIn();
  const name = getUsername();

  function logout() {
    clearAuth();
    nav(0);
  }

  return (
    <div className="container">
      <header className="topbar">
        <h1 className="appTitle">
          <Link to="/" className="titleLink">
            Shui – Message Board
          </Link>
        </h1>
        <div className="authbar">
          {logged ? (
            <>
              <Link to={`/user/${encodeURIComponent(name)}`} className="user">
                @{name}
              </Link>
              <button className="btn btn-danger sm" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <span> | </span>
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
