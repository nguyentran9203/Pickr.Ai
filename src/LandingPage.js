import React, { useState } from 'react';
import './App.css';
import teicaLogo from './logo.svg';

const suggestions = [
  "Phone with good camera",
  "Drill to screw a couple of screws",
  "Gift for my girlfriend",
  "Food for my grumpy cat",
  "Gaming chair"
];

const categories = [
  "All",
  "Phone",
  "Headphones",
  "Laptop",
  "Tablet",
  "Accessory"
];

export default function LandingPage({ onSearch }) {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, minPrice, maxPrice, category });
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
  };

  return (
    <div className="landing">
      <img src={teicaLogo} alt="TEICA.AI Logo" className="logo" />
      <h1>What are you looking for?</h1>

      <form id="searchForm" onSubmit={handleSubmit} className="search-container">
        <input
          type="text"
          id="searchInput"
          name="q"
          placeholder="e.g. phone with good camera"
          className="search-bar"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <div className="price-inputs">
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Min Price"
            step="0.01"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="Max Price"
            step="0.01"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
          <select
            id="category"
            name="category"
            className="category-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="search-button">Search</button>
      </form>

      <div className="suggestions">
        {suggestions.map((text, idx) => (
          <div
            key={idx}
            className="suggestion"
            onClick={() => handleSuggestionClick(text)}
          >
            {text}
          </div>
        ))}
      </div>

      <div className="description">
        Just type what you’re after, and our smart tech does the rest, digging up the perfect matches for you in no time. It’s like having a personal shopper in your pocket, always ready to help you find the latest, the greatest, or just the right thing, tailored just for you.
      </div>
    </div>
  );
}
