import React, { useState, useEffect } from 'react';

const genreMap = {
  1: "Personal Growth",
  2: "Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family"
};

function App() {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null); // full show object
  const [selectedSeason, setSelectedSeason] = useState(null); // season object
  const [showLoading, setShowLoading] = useState(false);

  // Fetch previews
  useEffect(() => {
    async function fetchPreviews() {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        const data = await response.json();
        data.sort((a, b) => a.title.localeCompare(b.title));
        setPreviews(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchPreviews();
  }, []);

  // Fetch full show data by id
  async function fetchShow(id) {
    setShowLoading(true);
    try {
      const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
      const data = await response.json();
      setSelectedShow(data);
      setSelectedSeason(null);
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoading(false);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  if (loading) return <div>Loading shows...</div>;

  // Show episodes for a selected season
  if (selectedSeason) {
    return (
      <div style={{ padding: '1rem' }}>
        <button onClick={() => setSelectedSeason(null)}>← Back to Seasons</button>
        <h2>{selectedSeason.title}</h2>
        <img src={selectedSeason.image} alt={`Season ${selectedSeason.title} cover`} style={{ maxWidth: '300px' }} />
        <h3>Episodes:</h3>
        <ul>
          {selectedSeason.episodes.map(ep => (
            <li key={ep.id}>{ep.title}</li>
          ))}
        </ul>
      </div>
    );
  }

  // Show seasons for selected show
  if (selectedShow) {
    return (
      <div style={{ padding: '1rem' }}>
        <button onClick={() => setSelectedShow(null)}>← Back to Shows</button>
        <h1>{selectedShow.title}</h1>
        <p>{selectedShow.description}</p>
        <h2>Seasons</h2>
        {showLoading ? (
          <p>Loading show details...</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {selectedShow.seasons.map(season => (
              <div
                key={season.id}
                onClick={() => setSelectedSeason(season)}
                style={{ border: '1px solid #ccc', padding: '1rem', width: '250px', cursor: 'pointer' }}
              >
                <img src={season.image} alt={season.title} style={{ width: '100%', height: 'auto' }} />
                <h3>{season.title}</h3>
                <p>Episodes: {season.episodes.length}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default: show previews
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Podcast Shows</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {previews.map(show => (
          <div
            key={show.id}
            onClick={() => fetchShow(show.id)}
            style={{ border: '1px solid #ccc', padding: '1rem', width: '300px', cursor: 'pointer' }}
          >
            <img src={show.image} alt={`Cover for ${show.title}`} style={{ width: '100%', height: 'auto' }} />
            <h2>{show.title}</h2>
            <p><strong>Seasons:</strong> {show.seasons}</p>
            <p><strong>Last updated:</strong> {formatDate(show.updated)}</p>
            <p><strong>Genres:</strong> {show.genreIds.map(id => genreMap[id]).join(', ')}</p>
            // Add this state along with others
const [playingEpisode, setPlayingEpisode] = useState(null);

// Handle episode click
function playEpisode(episode) {
  setPlayingEpisode(episode);
}

// Render the episode list with click handler:
{selectedSeason && (
  <ul>
    {selectedSeason.episodes.map(ep => (
      <li key={ep.id} onClick={() => playEpisode(ep)} style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
        {ep.title}
      </li>
    ))}
  </ul>
)}

// At the bottom of your component's return, add the audio player UI:

{playingEpisode && (
  <div style={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#222',
    color: '#fff',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  }}>
    <audio
      src={playingEpisode.file}
      controls
      autoPlay
      style={{ flexGrow: 1 }}
    />
    <div>{playingEpisode.title}</div>
  </div>
)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

