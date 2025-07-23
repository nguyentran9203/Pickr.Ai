// src/App.js
import React, { useState } from 'react';
import LandingPage from './LandingPage';
import ResultsPage from './ResultsPage';

export default function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async ({ query, minPrice, maxPrice, category }) => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, minPrice, maxPrice, category })
      });

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return results.length > 0 || loading || error ? (
    <ResultsPage
      results={results}
      loading={loading}
      error={error}
      onBack={() => setResults([])}
    />
  ) : (
    <LandingPage onSearch={handleSearch} />
  );
}
