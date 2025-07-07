import React, { useState } from "react";
import axios from "axios";
import './App.css';

const GENRES = [
  "Fantasy",
  "Sci-Fi",
  "Mystery",
  "Romance",
  "Adventure",
  "Horror",
  "Comedy"
];

function App() {
  // State for form fields
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [length, setLength] = useState(300); // default word count
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Toggle genre selection
  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  // Build the base prompt
  const buildPrompt = (userPrompt, wordCount, genres) => {
    const genreStr = genres.length > 0 ? genres.join(", ") : "";
    return `Write a${genreStr ? " " + genreStr : ""} story: ${userPrompt}. Make it around ${wordCount} words long.`;
  };

  // Handle story generation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStory("");
    const fullPrompt = buildPrompt(prompt, length, selectedGenres);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-story",
        { prompt: fullPrompt }
      );
      const generated = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      setStory(generated || "No story generated.");
    } catch (err) {
      setError(
        err.response?.data?.error?.message || err.response?.data?.error || err.message || "Unknown error"
      );
    }
    setLoading(false);
  };

  return (
    <div className="main-layout">
      {/* Left: Genre Tab */}
      <div className="side-tab left-tab">
        <h2>Genres</h2>
        <div className="genre-list">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              className={`genre-btn${selectedGenres.includes(genre) ? ' selected' : ''}`}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
      {/* Center: Prompt and Story */}
      <div className="center-panel">
        <h1 className="title">Story Generator</h1>
        <form onSubmit={handleSubmit} className="story-form center-form" style={{ marginBottom: '1.5rem' }}>
          <input
            className="prompt-bar"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Enter your story idea or prompt..."
            required
            disabled={loading}
          />
          <button type="submit" className="generate-btn" disabled={loading}>Generate Story</button>
        </form>
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}
        {story && (
          <div className="story-output">
            <h2>Your Story:</h2>
            <p>{story}</p>
          </div>
        )}
      </div>
      {/* Right: Length Tab */}
      <div className="side-tab right-tab">
        <h2>Length</h2>
        <div className="length-control">
          <label htmlFor="length-range">Words: {length}</label>
          <input
            id="length-range"
            type="range"
            min={100}
            max={2000}
            step={50}
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
