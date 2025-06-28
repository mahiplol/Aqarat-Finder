import React, { useState, useRef } from "react";
import "./SearchBox.css";

export default function SearchBox({ onSearch }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [image, setImage] = useState(null);
  const inputRef = useRef(null);

  // ChatGPT-style animated dots
  const Dots = () => (
    <span className="dots-anim">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </span>
  );

  // Voice input handler
  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      setQuery(event.results[0][0].transcript);
      inputRef.current.focus();
    };
    recognition.start();
  };

  // Image upload
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    await onSearch(query);
    setIsSearching(false);
  };

  return (
    <form
      className={`ios26-chat-bar${isSearching ? " searching" : ""}`}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <input
        ref={inputRef}
        className="ios26-input"
        type="text"
        placeholder="Type your query here…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isSearching}
        style={{ fontWeight: 500 }}
      />
      <button type="submit" className="ios26-btn search" disabled={isSearching} aria-label="Search">
        <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      <label className="ios26-btn" title="Upload image">
        <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
        <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M16.5 12.5L13 16l-2-2.5-5 6h16l-4.5-7z"/><circle cx="6.5" cy="10.5" r="1.5"/>
        </svg>
      </label>
      <button type="button" className="ios26-btn" title="Speak" onClick={handleVoice}>
        <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/>
          <line x1="12" y1="20" x2="12" y2="22"/>
          <line x1="8" y1="22" x2="16" y2="22"/>
        </svg>
      </button>
      <button type="button" className="ios26-btn interactive" title="Interactive" onClick={() => alert("Interactive button clicked!")}>
        Interactive
      </button>
      {isSearching && <Dots />}
      {image && (
        <div className="img-preview">
          <img src={image} alt="Preview" />
        </div>
      )}
    </form>
  );
}
