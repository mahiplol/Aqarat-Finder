import React, { useState } from 'react';
import NavBar from './components/NavBar';
import SearchBox from './components/SearchBox';
import './Home.css';

export default function Home() {
  // 🔄 Connection-related state
  const [answer, setAnswer] = useState('');
  const [listings, setListings] = useState([]);
  const [modalListing, setModalListing] = useState(null);

  // 🔄 Send query to backend
  const handleSearch = async (query) => {
    if (!query.trim()) return;
    try {
      const res = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, lang: 'en' })
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      setAnswer(data.answer);
      setListings(data.matches);
    } catch (err) {
      setAnswer('Something went wrong.');
      setListings([]);
      console.error('Search error:', err);
    }
  };

  return (
    <div>
      <SearchBox onSearch={handleSearch} />

      {/* 🧠 Fanar summary output */}
      {answer && <div className="fanar-response">{answer}</div>}

      {/* 📦 Listing cards */}
      {listings.length > 0 && (
        <div className="listing-grid">
          {listings.map(l => (
            <div key={l.id} className="listing-card" onClick={() => setModalListing(l)}>
              <img src={l.image || 'https://via.placeholder.com/250'} className="card-img" />
              <h3>{l.title}</h3>
              <p>QAR {l.price.toLocaleString()} · {l.bedrooms} bed · {l.size || 100} {l.size_unit || 'sqm'}</p>
            </div>
          ))}
        </div>
      )}

      {/* 🔍 Modal view for selected listing */}
      {modalListing && (
        <div className="modal" onClick={() => setModalListing(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setModalListing(null)}>×</button>
            <img src={modalListing.image || 'https://via.placeholder.com/400'} className="modal-img" />
            <h2>{modalListing.title}</h2>
            <p>{modalListing.description}</p>
            <p><strong>QAR:</strong> {modalListing.price.toLocaleString()}</p>
            <p><strong>Type:</strong> {modalListing.type}</p>
            <p><strong>Bedrooms:</strong> {modalListing.bedrooms}, <strong>Bathrooms:</strong> {modalListing.bathrooms}</p>
            <p><strong>Agency:</strong> {modalListing.Agency}</p>
            <p><strong>Contact:</strong> {modalListing.Contact}</p>
            <p><strong>Amenities:</strong> {(modalListing.amenities || []).join(', ')}</p>
          </div>
        </div>
      )}

      {/* 🎯 Optional: Quick chips */}
      <section className="section">
        <div className="filter-chips">
          {['West Bay', 'The Pearl', 'Lusail', 'Al Sadd', 'Al Khor', 'Al Waab'].map(area => (
            <button key={area} onClick={() => handleSearch(area)}>
              {area}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}