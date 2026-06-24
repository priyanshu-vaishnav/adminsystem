import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { error } = await signIn(email, password)
    if (error) setError(error.message)
    else navigate('/dashboard')
  }

  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e1b2e'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff', padding: '40px', borderRadius: '12px', width: '340px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Login</h2>
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{
          width: '100%', padding: '10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer'
        }}>
          Login
        </button>
        <p style={{ marginTop: '14px', fontSize: '14px' }}>
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  )
}
