// src/LandingPage.js
import React from 'react';
import './App.css'; // we'll put styles here
import teicaLogo from './logo.svg'; // replace with actual logo path if needed

const suggestions = [
  "Phone with good camera",
  "Drill to screw a couple of screws",
  "Gift for my girlfriend",
  "Food for my grumpy cat",
  "Gaming chair"
];

export default function LandingPage() {
  return (
    <div className="landing">
      <img src={teicaLogo} alt="TEICA.AI Logo" />
      <h1>What are you looking for?</h1>

      <div className="search-container">
        <form id="searchForm" action="/results" method="get">
          <input
            type="text"
            id="searchInput"
            name="q"
            placeholder="What are you looking for?"
            className="search-bar"
          />
          <div className="price-inputs">
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="Min Price"
              step="0.01"
            />
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="Max Price"
              step="0.01"
            />
          </div>
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      <div className="suggestions">
        {suggestions.map((text, idx) => (
          <div key={idx} className="suggestion">{text}</div>
        ))}
      </div>

      <div className="description">
        Just type what you’re after, and our smart tech does the rest, digging up the perfect matches for you in no time. It’s like having a personal shopper in your pocket, always ready to help you find the latest, the greatest, or just the right thing, tailored just for you.
      </div>
    </div>
  );
}
