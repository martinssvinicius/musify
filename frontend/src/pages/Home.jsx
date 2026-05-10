import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../lib/axios'
import Player from '../components/Player'

export default function Home() {
    const { user, logout } = useAuth()
    const [songs, setSongs]           = useState([])
    const [loading, setLoading]       = useState(true)
    const [error, setError]           = useState(null)
    const [currentSong, setCurrentSong] = useState(null)  // <- novo

    useEffect(() => {
        api.get('/songs')
            .then(res => setSongs(res.data.data))
            .catch(() => setError('Erro ao carregar músicas.'))
            .finally(() => setLoading(false))
    }, [])

    const formatDuration = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.logo}>Musify</h1>
                <div style={styles.headerRight}>
                    <span style={styles.username}>Olá, {user?.name}</span>
                    <button style={styles.logoutBtn} onClick={logout}>Sair</button>
                </div>
            </div>

            {/* Conteúdo */}
            <div style={styles.content}>
                <h2 style={styles.sectionTitle}>Músicas</h2>

                {loading && <p style={styles.message}>Carregando...</p>}
                {error   && <p style={styles.error}>{error}</p>}

                {!loading && !error && (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>#</th>
                                <th style={styles.th}>Título</th>
                                <th style={styles.th}>Artista</th>
                                <th style={styles.th}>Álbum</th>
                                <th style={styles.th}>Duração</th>
                            </tr>
                        </thead>
                        <tbody>
                            {songs.map((song, index) => (
                                <tr
                                    key={song.id}
                                    style={{
                                        ...styles.row,
                                        backgroundColor: currentSong?.id === song.id ? '#1a3a1a' : 'transparent'
                                    }}
                                    onClick={() => setCurrentSong(song)}
                                >
                                    <td style={styles.td}>
                                        {currentSong?.id === song.id ? '▶' : index + 1}
                                    </td>
                                    <td style={{...styles.td, color: currentSong?.id === song.id ? '#1db954' : '#ccc'}}>
                                        {song.title}
                                    </td>
                                    <td style={styles.td}>{song.artist?.name}</td>
                                    <td style={styles.td}>{song.album?.title ?? '—'}</td>
                                    <td style={styles.td}>{formatDuration(song.duration)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Player fixo no rodapé */}
            <Player song={currentSong} />
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        color: '#fff',
        paddingBottom: '80px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 32px',
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #333',
    },
    logo: {
        color: '#1db954',
        fontSize: '24px',
        margin: 0,
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    username: {
        color: '#aaa',
        fontSize: '14px',
    },
    logoutBtn: {
        padding: '8px 16px',
        borderRadius: '8px',
        border: '1px solid #333',
        backgroundColor: 'transparent',
        color: '#aaa',
        cursor: 'pointer',
        fontSize: '14px',
    },
    content: {
        padding: '32px',
    },
    sectionTitle: {
        fontSize: '24px',
        marginBottom: '24px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        borderBottom: '1px solid #333',
    },
    th: {
        textAlign: 'left',
        padding: '8px 16px',
        color: '#aaa',
        fontSize: '13px',
        fontWeight: 'normal',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    row: {
        borderBottom: '1px solid #1a1a1a',
        cursor: 'pointer',
    },
    td: {
        padding: '12px 16px',
        fontSize: '15px',
        color: '#ccc',
    },
    message: {
        color: '#aaa',
    },
    error: {
        color: '#ff4444',
    },
}