import React from 'react';
import './NavBar.css';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src="/aq-logo.png" alt="Logo" className="nav-logo" />
      </div>

      <div className="nav-title">AQARAT FINDER</div>

      <div className="nav-right">
        <button>Tutorial</button>
        <button>About</button>
      </div>
    </nav>
  );
}
