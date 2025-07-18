import React, { useState } from 'react';
import LandingPage from './LandingPage';
import ResultsPage from './ResultsPage';

export default function App() {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(query, minPrice, maxPrice, category) {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, minPrice, maxPrice, category })
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setShowResults(false);
  }

  return (
    showResults
      ? <ResultsPage results={results} loading={loading} error={error} onBack={handleBack} />
      : <LandingPage onSearch={handleSearch} />
  );
}
