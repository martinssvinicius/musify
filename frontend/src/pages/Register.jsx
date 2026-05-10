import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
    const { register } = useAuth()
    const navigate     = useNavigate()

    const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '' })
    const [error, setError]     = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await register(form.name, form.email, form.password, form.password_confirmation)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao cadastrar.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Musify</h1>
                <p style={styles.subtitle}>Crie sua conta</p>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        style={styles.input}
                        type="text"
                        name="name"
                        placeholder="Nome"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        name="password"
                        placeholder="Senha"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        name="password_confirmation"
                        placeholder="Confirmar senha"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        required
                    />
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <p style={styles.link}>
                    Já tem conta? <Link to="/login">Entrar</Link>
                </p>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0f0f0f',
    },
    card: {
        backgroundColor: '#1a1a1a',
        padding: '40px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        color: '#1db954',
        fontSize: '32px',
        textAlign: 'center',
        marginBottom: '8px',
    },
    subtitle: {
        color: '#aaa',
        textAlign: 'center',
        marginBottom: '24px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    input: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #333',
        backgroundColor: '#2a2a2a',
        color: '#fff',
        fontSize: '16px',
    },
    button: {
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#1db954',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '8px',
    },
    error: {
        color: '#ff4444',
        textAlign: 'center',
        marginBottom: '12px',
    },
    link: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: '16px',
    },
}