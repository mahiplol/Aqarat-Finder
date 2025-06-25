import React from 'react';
import NavBar from './components/NavBar';
import SearchBox from './components/SearchBox';

export default function Home() {
  const handleSearch = q => {
    console.log('Search for:', q);
    // later: hook into Fanar + your backend here
  };

  return (
    <div>
      <NavBar />
      <SearchBox onSearch={handleSearch} />

      {/* ── Below the search box ── */}
      <section className="section">
        {/* 1) Quick Filter Chips */}
        <div className="filter-chips">
          {['West Bay', 'The Pearl', 'Lusail', 'Al Sadd'].map(area => (
            <button key={area} onClick={() => handleSearch(area)}>
              {area}
            </button>
          ))}
        </div>

        {/* 2) Featured Listings Preview */}
        <div>
          <h2>Featured Listings</h2>
          <div className="featured-grid">
            {[1,2,3,4].map(i => (
              <div key={i} className="featured-card">
                <div className="image-placeholder" />
                <h3>Sample Title</h3>
                <p>QAR 4,500 · 2 bed · 100 sqm</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3) Mini Map Preview */}
        <div className="map-preview">[ Map Preview Here ]</div>
      </section>
    </div>
  );
}
