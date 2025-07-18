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
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const [view, setView] = useState("previews"); 

  // Favourites state from localStorage
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem('favourites');
    return saved ? JSON.parse(saved) : [];
  });

  // Add episode to favourites
  function addToFavourites(episode, showTitle, seasonTitle) {
    const newFav = {
      id: episode.id,
      title: episode.title,
      file: episode.file,
      showTitle,
      seasonTitle,
      addedAt: new Date().toISOString(),
    };
    const updated = [...favourites, newFav];
    setFavourites(updated);
    localStorage.setItem('favourites', JSON.stringify(updated));
  }

  // Remove episode from favourites
  function removeFromFavourites(id) {
    const updated = favourites.filter(fav => fav.id !== id);
    setFavourites(updated);
    localStorage.setItem('favourites', JSON.stringify(updated));
  }

  // Check if episode is favourite
  function isFavourite(id) {
    return favourites.some(fav => fav.id === id);
  }

  // Fetch previews on mount
  useEffect(() => {
    async function fetchPreviews() {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        const data = await response.json();
        data.sort((a, b) => a.title.localeCompare(b.title));
        setPreviews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPreviews();
  }, []);

  // Fetch full show details
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

  function playEpisode(episode) {
    setPlayingEpisode(episode);
  }

  // Loading state
  if (loading) return <div>Loading shows...</div>;

  // Show season view
  if (selectedSeason) {
    return (
      <div style={{ padding: '1rem' }}>
        <button onClick={() => setSelectedSeason(null)}>← Back to Seasons</button>
        <h2>{selectedSeason.title}</h2>
        <img
          src={selectedSeason.image}
          alt={`Season ${selectedSeason.title} cover`}
          style={{ maxWidth: '300px' }}
        />
        <h3>Episodes:</h3>
        <ul>
          {selectedSeason.episodes && selectedSeason.episodes.length > 0 ? (
            selectedSeason.episodes.map(ep => (
              <li
                key={ep.id}
                onClick={() => playEpisode(ep)}
                style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
              >
                {ep.title}{" "}
                {isFavourite(ep.id) ? (
                  <button onClick={() => removeFromFavourites(ep.id)}>Remove Favourite</button>
                ) : (
                  <button onClick={() => addToFavourites(ep, selectedShow.title, selectedSeason.title)}>Add Favourite</button>
                )}
              </li>
            ))
          ) : (
            <p>No episodes found</p>
          )}
        </ul>

        {playingEpisode && (
          <div
            style={{
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
            }}
          >
            <audio src={playingEpisode.file} controls autoPlay style={{ flexGrow: 1 }} />
            <div>{playingEpisode.title}</div>
          </div>
        )}
      </div>
    );
  }

  // Show full show view
  if (selectedShow) {
    return (
      <div style={{ padding: '1rem' }}>
        <button onClick={() => setSelectedShow(null)}>← Back to Shows</button>
        <h1>{selectedShow.title}</h1>
        <p>{selectedShow.description}</p>
        <h2>Seasons</h2>
        {showLoading ? (
          <p>Loading show details...</p>
        ) : selectedShow.seasons && selectedShow.seasons.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {selectedShow.seasons.map(season => (
              <div
                key={season.id}
                onClick={() => setSelectedSeason(season)}
                style={{ border: '1px solid #ccc', padding: '1rem', width: '250px', cursor: 'pointer' }}
              >
                <img src={season.image} alt={season.title} style={{ width: '100%', height: 'auto' }} />
                <h3>{season.title}</h3>
                <p>Episodes: {season.episodes ? season.episodes.length : 0}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No seasons found</p>
        )}
      </div>
    );
  }

  // Default: show all previews
return (
  <div style={{ padding: '1rem' }}>
    {view === "favourites" ? (
      <div>
        <h1>Favourites</h1>
        <button onClick={() => setView("previews")}>← Back to Shows</button>
        {favourites.length === 0 ? (
          <p>No favourites yet.</p>
        ) : (
          favourites.map((fav) => (
            <div key={fav.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
              <h3>{fav.title}</h3>
              <p><strong>Show:</strong> {fav.showTitle}</p>
              <p><strong>Season:</strong> {fav.seasonTitle}</p>
              <p><strong>Added:</strong> {new Date(fav.addedAt).toLocaleString()}</p>
              <button onClick={() => setPlayingEpisode(fav)}>Play</button>
              <button onClick={() => removeFromFavourites(fav.id)}>Remove</button>
            </div>
          ))
        )}
      </div>
    ) : (
      <div>
        <h1>Podcast Shows</h1>
        <button onClick={() => setView("favourites")}>View Favourites</button>
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
             <p><strong>Genres:</strong> {(show.genreIds && show.genreIds.map(id => genreMap[id]).join(', ')) || 'No genres'}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 🎵 Audio Player (always visible) */}
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
)
}

export default App;