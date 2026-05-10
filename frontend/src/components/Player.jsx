import { useState, useEffect, useRef } from 'react'

export default function Player({ song }) {
    const audioRef             = useRef(null)
    const [playing, setPlaying]   = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume]     = useState(1)

    useEffect(() => {
        if (!song) return
        audioRef.current.src = `http://localhost:8000/api/stream/${song.id}`
        audioRef.current.load()
        audioRef.current.play()
        setPlaying(true)
    }, [song])

    const togglePlay = () => {
        if (playing) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setPlaying(!playing)
    }

    const handleTimeUpdate = () => {
        const current  = audioRef.current.currentTime
        const duration = audioRef.current.duration
        setProgress((current / duration) * 100 || 0)
        setDuration(duration)
    }

    const handleSeek = (e) => {
        const value = e.target.value
        audioRef.current.currentTime = (value / 100) * duration
        setProgress(value)
    }

    const handleVolume = (e) => {
        const value = e.target.value
        audioRef.current.volume = value
        setVolume(value)
    }

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00'
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    if (!song) return null

    return (
        <div style={styles.player}>
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setPlaying(false)}
            />

            {/* Info da música */}
            <div style={styles.songInfo}>
                <span style={styles.songTitle}>{song.title}</span>
                <span style={styles.songArtist}>{song.artist?.name}</span>
            </div>

            {/* Controles */}
            <div style={styles.controls}>
                <button style={styles.playBtn} onClick={togglePlay}>
                    {playing ? '⏸' : '▶'}
                </button>
                <span style={styles.time}>{formatTime(audioRef.current?.currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    style={styles.progressBar}
                />
                <span style={styles.time}>{formatTime(duration)}</span>
            </div>

            {/* Volume */}
            <div style={styles.volumeControl}>
                <span style={styles.volumeIcon}>🔊</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolume}
                    style={styles.volumeBar}
                />
            </div>
        </div>
    )
}

const styles = {
    player: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        backgroundColor: '#1a1a1a',
        borderTop: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: '24px',
        zIndex: 100,
    },
    songInfo: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '200px',
    },
    songTitle: {
        color: '#fff',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    songArtist: {
        color: '#aaa',
        fontSize: '12px',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: 1,
    },
    playBtn: {
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '0 8px',
    },
    progressBar: {
        flex: 1,
        accentColor: '#1db954',
        cursor: 'pointer',
    },
    time: {
        color: '#aaa',
        fontSize: '12px',
        minWidth: '36px',
    },
    volumeControl: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: '140px',
    },
    volumeIcon: {
        fontSize: '16px',
    },
    volumeBar: {
        width: '100px',
        accentColor: '#1db954',
        cursor: 'pointer',
    },
}