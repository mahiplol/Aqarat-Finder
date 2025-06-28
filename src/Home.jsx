import React, { useState } from 'react';
import SearchBox from './components/SearchBox';
import './Home.css';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
console.log('MAP KEY:', GOOGLE_MAPS_API_KEY);

export default function Home() {
  const [answer, setAnswer] = useState('');
  const [listings, setListings] = useState([]);
  const [modalListing, setModalListing] = useState(null);

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
    <div className="aq-container">
      <SearchBox onSearch={handleSearch} />

      {/* AI Response */}
      {answer && (
        <div className="aq-response">
          <div className="aq-ai-icon">AQ</div>
          <div className="aq-message">{answer}</div>
        </div>
      )}

      {/* Property Listings */}
      {listings.length > 0 && (
        <div className="aq-grid">
          {listings.map(l => (
            <div key={l.id} className="aq-card" onClick={() => setModalListing(l)}>
              <div className="aq-card-media">
                <img src={l.image || 'https://via.placeholder.com/300'} alt={l.title} />
              </div>
              <div className="aq-card-content">
                <h3 className="aq-card-title">{l.title}</h3>
                <p className="aq-card-details">
                  QAR {l.price.toLocaleString()} · {l.bedrooms} bed · {l.size || 100} {l.size_unit || 'sqm'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Property Modal */}
      {modalListing && (
        <div className="aq-modal" onClick={() => setModalListing(null)}>
          <div className="aq-modal-content" onClick={e => e.stopPropagation()}>
            <button className="aq-close-btn" onClick={() => setModalListing(null)}>×</button>
            
            <div className="aq-modal-media">
              <img src={modalListing.image || 'https://via.placeholder.com/500'} alt={modalListing.title} />
            </div>
            
            <div className="aq-modal-body">
              <h2>{modalListing.title}</h2>
              <p className="aq-modal-description">{modalListing.description}</p>
              
              <div className="aq-detail-grid">
                <div className="aq-detail">
                  <span className="aq-detail-label">Price</span>
                  <span className="aq-detail-value">QAR {modalListing.price.toLocaleString()}</span>
                </div>
                <div className="aq-detail">
                  <span className="aq-detail-label">Type</span>
                  <span className="aq-detail-value">{modalListing.type}</span>
                </div>
                <div className="aq-detail">
                  <span className="aq-detail-label">Bed/Bath</span>
                  <span className="aq-detail-value">{modalListing.bedrooms} / {modalListing.bathrooms}</span>
                </div>
                <div className="aq-detail">
                  <span className="aq-detail-label">Agency</span>
                  <span className="aq-detail-value">{modalListing.Agency}</span>
                </div>
                <div className="aq-detail">
                  <span className="aq-detail-label">Contact</span>
                  <span className="aq-detail-value">{modalListing.Contact}</span>
                </div>
              </div>

              <div className="aq-amenities">
                <span className="aq-amenities-label">Amenities:</span>
                <div className="aq-tags">
                  {(modalListing.amenities || []).map((amenity, i) => (
                    <span key={i} className="aq-tag">{amenity}</span>
                  ))}
                </div>
              </div>

              {/* 🗺️ Embedded Google Map */}
              {modalListing.coordinates && (
                <div className="map-container">
                  <h5>Location Map</h5>
                  <iframe
                    title="Google Map"
                    width="100%"
                    height="350"
                    frameBorder="0"
                    style={{ border: 0, borderRadius: '12px' }}
                    src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${modalListing.coordinates.lat},${modalListing.coordinates.lng}&zoom=15`}
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Filters */}
      <div className="aq-filters">
        {['West Bay', 'The Pearl', 'Lusail', 'Al Khor', 'Al Waab'].map(area => (
          <button 
            key={area} 
            className="aq-filter-btn"
            onClick={() => handleSearch(area)}
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  );
}
