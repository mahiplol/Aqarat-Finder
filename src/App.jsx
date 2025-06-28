import React from 'react';
import NavBar from './components/NavBar'; // Import your modern NavBar
import Home from './Home';
import './App.css';

export default function App() {
  return (
    <div className="app-root">
      <NavBar /> {/* Only one NavBar here */}
      <main className="app-main">
        <Home />
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} AQARATFINDER. All rights reserved.</p>
      </footer>
    </div>
  );
}
