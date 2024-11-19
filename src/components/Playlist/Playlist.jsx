import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = 'YOUR_SPOTIFY_ACCESS_TOKEN'; // 토큰을 얻는 방법은 OAuth를 통해 구현해야 합니다.
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlaylists(response.data.items);
      } catch (error) {
        console.error('Error fetching playlists', error);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div>
      <h2>My Playlists</h2>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>{playlist.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist; 