import React, { useEffect, useState } from "react";

function App() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://podcast-api.netlify.app")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.title.localeCompare(b.title));
        setShows(sorted);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to fetch shows:", err));
  }, []);

  if (loading) return <h2>Loading shows...</h2>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Podcast Shows</h1>
      <ul>
        {shows.map((show) => (
          <li key={show.id}>
            <strong>{show.title}</strong> ({show.seasons} seasons)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
