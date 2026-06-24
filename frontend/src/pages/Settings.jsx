import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import Layout from '../components/Layout'

export default function Settings() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (!error) setProfile(data)
  }

  return (
    <Layout>
      <h1>Settings</h1>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', marginTop: '20px', maxWidth: '420px' }}>
        <h3>User Details</h3>
        <p><strong>Name:</strong> {profile?.name || '-'}</p>
        <p><strong>Email:</strong> {profile?.email || user?.email}</p>
        <p><strong>Role:</strong> {profile?.role || 'user'}</p>
        <p><strong>Joined:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}</p>
      </div>
    </Layout>
  )
}
