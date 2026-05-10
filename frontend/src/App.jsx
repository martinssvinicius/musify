import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

function PrivateRoute({ children }) {
    const { user, loading } = useAuth()
    if (loading) return <p style={{ color: '#fff', textAlign: 'center' }}>Carregando...</p>
    return user ? children : <Navigate to="/login" />
}

export default function App() {
    return (
        <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
                <PrivateRoute>
                    <Home />  
                </PrivateRoute>
            } />
        </Routes>
    )
}