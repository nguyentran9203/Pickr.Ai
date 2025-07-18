// src/ResultsPage.js
import React from 'react';

// Example mock data (replace with actual API data later)


export default function ResultsPage({ results, loading, error, onBack }) {
  return (
    <div className="results-page" style={{ padding: '2rem', background: '#fafbfc', minHeight: '100vh' }}>
      <button onClick={onBack} /* styling here */>⬅ Back</button>

      {loading && (
        <div className="text-center text-gray-500 my-12 text-lg">Loading...</div>
      )}

      {error && (
        <div className="text-center text-red-500 my-12 text-lg">{error}</div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="text-center text-gray-400 py-20">No results found.</div>
      )}

      <div className="product-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
        gap: '2rem',
      }}>
        {!loading && !error && results.map((item, idx) => (
          <div className="product-card" key={idx} style={{
            background: 'white',
            borderRadius: '1.25rem',
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'box-shadow .2s',
          }}>
            <img src={item.image} alt={item.model} style={{
              width: '120px',
              height: '120px',
              objectFit: 'cover',
              borderRadius: '0.75rem',
              marginBottom: '1rem'
            }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '.4rem' }}>
              {item.brand} {item.model}
            </h2>
            {item.category && <span style={{ fontSize: '.9rem', color: '#999', marginBottom: '0.5rem' }}>{item.category}</span>}
            <p style={{ color: '#555', fontSize: '.93rem', marginBottom: '.7rem', textAlign: 'center' }}>
              {item.description}
            </p>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#0ea5e9' }}>${item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

