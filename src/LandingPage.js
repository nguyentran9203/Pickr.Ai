import React, { useState } from 'react';
import './App.css';
import teicaLogo from './logo.svg';


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
  const [cameraImportance, setCameraImportance] = useState(5);
const [batteryImportance, setBatteryImportance] = useState(5);
const [performanceImportance, setPerformanceImportance] = useState(5);


  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, minPrice, maxPrice, category, cameraImportance, batteryImportance, performanceImportance  });
  };



  return (
    <div className="landing">
      <img src={teicaLogo} alt="TEICA.AI Logo" className="logo" />
      <h1>What are you looking for?</h1>

 
   <form onSubmit={handleSubmit} className="preferences-form">
     <input
    type="text"
    placeholder="e.g. phone with good camera"
    className="search-bar"
    value={query}
    onChange={e => setQuery(e.target.value)}
  />
  <div className="slider-group">
    <label>
      Camera Quality: {cameraImportance}
      <input
        type="range"
        min="1"
        max="10"
        value={cameraImportance}
        onChange={(e) => setCameraImportance(e.target.value)}
      />
    </label>

    <label>
      Battery Life: {batteryImportance}
      <input
        type="range"
        min="1"
        max="10"
        value={batteryImportance}
        onChange={(e) => setBatteryImportance(e.target.value)}
      />
    </label>

    <label>
      Performance: {performanceImportance}
      <input
        type="range"
        min="1"
        max="10"
        value={performanceImportance}
        onChange={(e) => setPerformanceImportance(e.target.value)}
      />
    </label>

   
  </div>
<div className="price-input-pair">
  <input
    type="number"
    placeholder="Min Price"
    value={minPrice}
    onChange={e => setMinPrice(e.target.value)}
  />
  <input
    type="number"
    placeholder="Max Price"
    value={maxPrice}
    onChange={e => setMaxPrice(e.target.value)}
  />
</div>


  <select
    value={category}
    onChange={e => setCategory(e.target.value)}
  >
    {categories.map((cat, idx) => (
      <option key={idx} value={cat}>{cat}</option>
    ))}
  </select>

  <button type="submit" class = "search-button">Search</button>
</form>


      <div className="description">
        Just type what you’re after, and our smart tech does the rest, digging up the perfect matches for you in no time. It’s like having a personal shopper in your pocket, always ready to help you find the latest, the greatest, or just the right thing, tailored just for you.
      </div>
    </div>
  );
}
