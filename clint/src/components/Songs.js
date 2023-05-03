
 // export default Songs;

import { useState, useEffect } from 'react';

const Songs = ({ state }) => {
  const [songs, setSongs] = useState([]);
  const { contract } = state;
   

  useEffect(() => {
    const fetchMemos = async () => {
      if (!contract) return;
      const memos = await contract.get();
      setSongs(memos);
    };
    fetchMemos();
  }, [contract,]);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [deletedSong, setDeletedSong] = useState(null);
  const [views, setViews] = useState({});

  // const handlePlayClick = (song) => {
  //   if (currentSong && currentSong.murl === song.murl) {
  //     currentSong.audio.pause();
  //     setCurrentSong(null);
  //     setIsPlaying(false);
  //   } else {
  //     if (currentSong) currentSong.audio.pause();
  //     const audio = new Audio(song.murl);
  //     audio.play();
  //     setCurrentSong({ ...song, audio });
  //     setIsPlaying(true);
  //     setDuration(audio.duration);
  //     audio.addEventListener('timeupdate', handleTimeUpdate);
  //   }
  // };
  const handlePlayClick = (song) => {
    if (currentSong && currentSong.murl === song.murl) {
      currentSong.audio.pause();
      setCurrentSong(null);
      setIsPlaying(false);
    } else {
      if (currentSong) currentSong.audio.pause();
      const audio = new Audio(song.murl);
      audio.play();
      setCurrentSong({ ...song, audio });
      setIsPlaying(true);
      setDuration(audio.duration);
      audio.addEventListener('timeupdate', handleTimeUpdate);
  
      // Increment the views count for the current song
      setViews(prevViews => ({
        ...prevViews,
        [song.songname]: (prevViews[song.songname] || 0) + 1
      }));
    }
  };

  const handlePauseClick = () => {
    if (currentSong) {
      currentSong.audio.pause();
      setIsPlaying(false);
    }
  };

  const handleStopClick = () => {
    if (currentSong) {
      currentSong.audio.pause();
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleSeek = (e) => {
    if (currentSong) {
      const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * currentSong.audio.duration;
      currentSong.audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  const [songName, setSongName] = useState('');
  
  const handleDeleteSong = async (songName) => {
    try {
      const tx = await contract.deletesong(songName);
      await tx.wait();
      console.log('Song deleted successfully');
      setDeletedSong(songName);
      window.location.reload(); // reload the page
    } catch (error) {
      console.log(error+" khjh ");
    }
    const updatedSongs = songs.filter(song => song.songname !== songName);
    setSongs(updatedSongs);
  };

  return (
    <div className="spotify-container">
      <div className="song-list">
        {songs.slice().reverse().filter((song, index, self) => {
          return (
            song.songname !== '' &&
            index === self.findIndex((s) => s.songname === song.songname)
          );
        }).map((song) => (
          <div key={song.songname} className="song-card">
          <img className="song-image" src={song.image} alt={song.songname} />
          <div className="song-details">
            <h3 className="song-title">{song.songname}</h3>
            <p className="song-artist">{song.singer}</p>
            <p className="song-views">{views[song.songname] || 0} views</p>
            <div className="controls">
              <button className="play-button" onClick={() => handlePlayClick(song)}>
                {currentSong && currentSong.murl === song.murl && isPlaying ? 'Pause' : 'Play'}
              </button>
              <button className="stop-button" onClick={handleStopClick}>
                Stop
              </button>
              <button className="delete-button" onClick={() => handleDeleteSong(song.songname)}>
              Delete
              </button>
               {currentSong && currentSong.murl === song.murl && (
      
              <div className="music-player">
  {currentSong && (
    <>
      <div className="progress-bar-container">
        <div className="progress-bar" onClick={handleSeek}>
          <div className="progress" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
        </div>
      </div>
     
    </>
  )}
</div>
    )}
            </div>
          </div>
        </div>
        ))}
      </div>
      <div className="music-player">
        {currentSong && (
          <>
            <div className="progress-bar" onClick={handleSeek}>
              <div className="progress" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
            </div>
             
         
          </>
        )}
      </div>
      <style jsx>{`
                   .spotify-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.song-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.song-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  background-color: transparent;
  border-radius: 10px;
  borger-color: white;

  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.song-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
}

.song-card h3 {
  margin: 10px 0;
  font-size: 1.2rem;
}

.song-card p {
  margin: 10;
  font-size: 1rem;
}

.song-card .artist {
  margin-top: 10px;
  font-size: 0.9rem;
  color: gray;
}

.song-card button {
  margin-top: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #1db954;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.song-card .play-button {
  background-color: black;
  color: white;
}
.song-card .delete-button {
  background-color: red;
  color: white;
  margin-left: 10px;
}

.song-card .stop-button {
  background-color: black;
  color: white;
}

.song-card button:hover {
  background-color: gray;
}

.song-card button.play-button {
  margin-left: 30px;
}

.song-card button.stop-button {
  margin-left: 10px;
}


.music-player {
  width: 100%;
  margin-top: 20px;
}

.progress-bar {
  height: 5px;
  background-color: grey;
  width: 100%;
  cursor: pointer;
}

.progress {
  height: 100%;
  background-color: black;
  width: 0%;
}

.progress-bar-container {
  width: 100%;
  height: 5px;
  background-color: grey;
}

}
          `}</style>
           {/* <input type="text" value={songName} onChange={(e) => setSongName(e.target.value)} /> */}
      {/* <button onClick={handleDeleteSong}>Delete Song</button> */}
          </div>
          );
          };
          
          export default Songs;
          const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            };

  