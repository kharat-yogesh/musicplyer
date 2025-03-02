// Develop by Harshvardhan Chaudhari Teem A11 
//  Develop by Yogesh Kharat Teem A11 
const audio = new Audio();
const playlist = [];
let currentSongIndex = 0;
let isShuffle = false;
let isLoop = false;

// Default playlist with 10 sample songs
const defaultPlaylist = [
    { name: "Song 1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { name: "Song 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { name: "Song 3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { name: "Song 4", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { name: "Song 5", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { name: "Song 6", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { name: "Song 7", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { name: "Song 8", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { name: "Song 9", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
    { name: "Song 10", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" }
];

// Load default playlist on page load
window.addEventListener('load', () => {
    playlist.push(...defaultPlaylist);
    renderPlaylist();
    if (playlist.length > 0) loadSong(currentSongIndex);
});

const fileInput = document.getElementById('file-input');
const playlistElement = document.getElementById('playlist');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeDownBtn = document.getElementById('volume-down-btn');
const volumeUpBtn = document.getElementById('volume-up-btn');
const albumArt = document.getElementById('album-art');
const currentSongArt = document.getElementById('current-song-art');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const likeBtn = document.getElementById('like-btn');
const deleteBtn = document.getElementById('delete-btn');
const shareBtn = document.getElementById('share-btn');
const moreBtn = document.getElementById('more-btn');
const searchInput = document.getElementById('search-input');
const shareOptions = document.getElementById('share-options');
const shuffleBtn = document.getElementById('shuffle-btn');
const loopBtn = document.getElementById('loop-btn');

// Function to check if a song with the same name already exists
function isSongNameDuplicate(name) {
    return playlist.some(song => song.name.toLowerCase() === name.toLowerCase());
}

// Load songs from file input
fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('audio/')) {
            const songName = files[i].name;
            if (isSongNameDuplicate(songName)) {
                alert(`A song with the name "${songName}" already exists in the playlist.`);
                continue; // Skip adding this song
            }
            playlist.push({
                name: songName,
                url: URL.createObjectURL(files[i])
            });
        }
    }
    renderPlaylist();
    if (playlist.length > 0) loadSong(currentSongIndex);
});

// Render playlisy
function renderPlaylist() {
    playlistElement.innerHTML = '';
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.name;
        li.addEventListener('click', () => loadSong(index));
        playlistElement.appendChild(li);
    });
}

// Load a songs
function loadSong(index) {
    if (index < 0 || index >= playlist.length) return;
    currentSongIndex = index;
    audio.src = playlist[index].url;
    audio.play();
    playPauseBtn.innerHTML = '<i style="font-size: 26px;" class="fa fa-pause-circle"></i>';
    updateAlbumArt();
    updateDuration();
}

// Update album art (placeholder)
function updateAlbumArt() {
    albumArt.src = 'https://t3.ftcdn.net/jpg/06/05/37/40/240_F_605374009_hEUHatmKPzuHTIacg7rLneAgnLHUgegM.jpg';
    currentSongArt.src = 'https://t3.ftcdn.net/jpg/06/05/37/40/240_F_605374009_hEUHatmKPzuHTIacg7rLneAgnLHUgegM.jpg';
}

// Update song duration
function updateDuration() {
    audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        durationDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    });
}

// Update progress bar
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    const currentMinutes = Math.floor(audio.currentTime / 60);
    const currentSeconds = Math.floor(audio.currentTime % 60);
    currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
});

// Seek functionality
const progressContainer = document.querySelector('.progress-container');
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

// Play/Pause functionality
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '<i style="font-size: 26px;" class="fa fa-pause-circle"></i>';
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '<i style="font-size: 26px;" class="fa fa-play-circle"></i>';
    }
});

// Previous song
prevBtn.addEventListener('click', () => {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    }
    loadSong(currentSongIndex);
});

// Next song
nextBtn.addEventListener('click', () => {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
    }
    loadSong(currentSongIndex);
});

// Volume control
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

// Volume down button
volumeDownBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
        audio.volume = Math.max(0, audio.volume - 0.1);
        volumeSlider.value = audio.volume;
    }
});

// Volume up button
volumeUpBtn.addEventListener('click', () => {
    if (audio.volume < 1) {
        audio.volume = Math.min(1, audio.volume + 0.1);
        volumeSlider.value = audio.volume;
    }
});

// Automatically play next song
audio.addEventListener('ended', () => {
    if (isLoop) {
        loadSong(currentSongIndex);
    } else {
        if (isShuffle) {
            currentSongIndex = Math.floor(Math.random() * playlist.length);
        } else {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
        }
        loadSong(currentSongIndex);
    }
});

// Like button functionality
likeBtn.addEventListener('click', () => {
    alert('Liked the song!');
});

// Delete button functionality
deleteBtn.addEventListener('click', () => {
    if (playlist.length > 0) {
        playlist.splice(currentSongIndex, 1);
        renderPlaylist();
        if (playlist.length > 0) {
            currentSongIndex = currentSongIndex % playlist.length;
            loadSong(currentSongIndex);
        } else {
            audio.src = '';
            albumArt.src = 'https://t3.ftcdn.net/jpg/06/05/37/40/240_F_605374009_hEUHatmKPzuHTIacg7rLneAgnLHUgegM.jpg';
            currentSongArt.src = 'https://t3.ftcdn.net/jpg/06/05/37/40/240_F_605374009_hEUHatmKPzuHTIacg7rLneAgnLHUgegM.jpg';
            playPauseBtn.innerHTML = '<i style="font-size: 26px;" class="fa fa-play-circle"></i>';
        }
    }
});

// Share button functionality
shareBtn.addEventListener('click', () => {
    shareOptions.style.display = shareOptions.style.display === 'block' ? 'none' : 'block';
});

// Share options functionality
document.getElementById('facebook-share').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Share on Facebook');
});

document.getElementById('instagram-share').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Share on Instagram');
});

document.getElementById('whatsapp-share').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Share on WhatsApp');
});

// Search functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const playlistItems = playlistElement.getElementsByTagName('li');
    Array.from(playlistItems).forEach((item) => {
        if (item.textContent.toLowerCase().includes(searchTerm)) {
            item.style.display = 'block'; // Show matching items
        } else {
            item.style.display = 'none'; // Hide non-matching items
        }
    });
});

// Shuffle functionality
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

// Loop functionality
loopBtn.addEventListener('click', () => {
    isLoop = !isLoop;
    loopBtn.classList.toggle('active', isLoop);
});
