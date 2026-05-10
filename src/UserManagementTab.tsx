import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

type UserProfile = {
  id: string
  email: string
  full_name: string
  role: 'founder' | 'admin' | 'manager' | 'client'
  client_id: string | null
  client_name?: string
  created_at: string
}

const ROLES = ['founder', 'admin', 'manager', 'client'] as const
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  founder: { bg: '#FEF3C7', text: '#92400E' },
  admin:   { bg: '#EDE9FE', text: '#6D28D9' },
  manager: { bg: '#DBEAFE', text: '#1D4ED8' },
  client:  { bg: '#F0FDF4', text: '#15803D' },
}

export default function UserManagementTab() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState<UserProfile | null>(null)
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'client' as UserProfile['role'], client_id: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*, dim_clients(name)')
      .order('created_at', { ascending: false })
    if (!error && profiles) {
      setUsers(profiles.map((p: any) => ({
        ...p,
        client_name: p.dim_clients?.name || '—',
      })))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
    supabase.from('dim_clients').select('id, name').then(({ data }) => {
      if (data) setClients(data)
    })
  }, [])

  const openAdd = () => {
    setEditUser(null)
    setForm({ full_name: '', email: '', password: '', role: 'client', client_id: '' })
    setError('')
    setShowForm(true)
  }

  const openEdit = (u: UserProfile) => {
    setEditUser(u)
    setForm({ full_name: u.full_name, email: u.email, password: '', role: u.role, client_id: u.client_id || '' })
    setError('')
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.full_name.trim() || !form.email.trim()) {
      setError('Nama dan email wajib diisi.')
      return
    }
    if (!editUser && !form.password.trim()) {
      setError('Password wajib diisi untuk user baru.')
      return
    }
    setSaving(true)
    setError('')

    if (editUser) {
      // Update profile only (password change requires admin SDK)
      const { error: err } = await supabase
        .from('profiles')
        .update({ full_name: form.full_name, role: form.role, client_id: form.client_id || null })
        .eq('id', editUser.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      // Invite / create user — via Supabase auth signUp (adjust to admin.createUser if you have service key)
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.full_name } }
      })
      if (authErr || !authData.user) {
        setError(authErr?.message || 'Gagal membuat user.')
        setSaving(false)
        return
      }
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: form.email,
        full_name: form.full_name,
        role: form.role,
        client_id: form.client_id || null,
      })
    }

    setSaving(false)
    setShowForm(false)
    fetchUsers()
  }

  const handleDelete = async (id: string) => {
    // Soft approach: update role to 'client' or delete profile
    await supabase.from('profiles').delete().eq('id', id)
    setDeleteId(null)
    fetchUsers()
  }

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const S = styles

  return (
    <div style={S.wrap}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h2 style={S.title}>User Management</h2>
          <p style={S.subtitle}>{users.length} user terdaftar</p>
        </div>
        <button onClick={openAdd} style={S.addBtn}>+ Tambah User</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Cari nama atau email..."
          style={S.searchInput}
        />
      </div>

      {/* Table */}
      <div style={S.card}>
        {loading ? (
          <div style={S.emptyState}>Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div style={S.emptyState}>Tidak ada user ditemukan.</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                {['User', 'Email', 'Role', 'Client / Brand', 'Dibuat', 'Aksi'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const rc = ROLE_COLORS[u.role] || ROLE_COLORS.client
                return (
                  <tr key={u.id} style={{ background: i % 2 ? '#FAFAFA' : '#fff' }}>
                    <td style={S.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: rc.bg, color: rc.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                          {(u.full_name || u.email || '?')[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{u.full_name || '—'}</span>
                      </div>
                    </td>
                    <td style={{ ...S.td, color: '#6B7280', fontSize: 13 }}>{u.email}</td>
                    <td style={S.td}>
                      <span style={{ ...S.roleBadge, background: rc.bg, color: rc.text }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ ...S.td, fontSize: 13, color: '#374151' }}>{u.client_name}</td>
                    <td style={{ ...S.td, fontSize: 12, color: '#9CA3AF' }}>
                      {new Date(u.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(u)} style={S.editBtn}>Edit</button>
                        <button onClick={() => setDeleteId(u.id)} style={S.delBtn}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div style={S.overlay} onClick={() => setShowForm(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                {editUser ? '✏️ Edit User' : '➕ Tambah User Baru'}
              </h3>
              <button onClick={() => setShowForm(false)} style={S.closeBtn}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={S.label}>Nama Lengkap *</label>
                <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} style={S.input} placeholder="e.g. Budi Santoso" />
              </div>
              <div>
                <label style={S.label}>Email *</label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ ...S.input, background: editUser ? '#F9FAFB' : '#fff' }} placeholder="budi@maharani.id" disabled={!!editUser} />
              </div>
              {!editUser && (
                <div>
                  <label style={S.label}>Password *</label>
                  <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={S.input} placeholder="Min. 8 karakter" />
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={S.label}>Role *</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as any }))} style={S.select}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Client / Brand</label>
                  <select value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))} style={S.select}>
                    <option value="">— Semua —</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {error && <div style={S.errorBox}>{error}</div>}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => setShowForm(false)} style={S.cancelBtn}>Batal</button>
                <button onClick={handleSave} disabled={saving} style={{ ...S.saveBtn, opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Menyimpan...' : editUser ? 'Simpan Perubahan' : 'Buat User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={S.overlay} onClick={() => setDeleteId(null)}>
          <div style={{ ...S.modal, maxWidth: 360, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800 }}>Hapus User?</h3>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#6B7280' }}>
              Tindakan ini tidak dapat dibatalkan. Data profil user akan dihapus dari sistem.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} style={S.cancelBtn}>Batal</button>
              <button onClick={() => handleDelete(deleteId)} style={{ ...S.saveBtn, background: '#EF4444' }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 1000 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 },
  title: { margin: 0, fontSize: 18, fontWeight: 800, color: '#111' },
  subtitle: { margin: '4px 0 0', fontSize: 13, color: '#9CA3AF' },
  addBtn: { padding: '10px 20px', borderRadius: 8, border: 'none', background: '#7C3AED', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' },
  searchInput: { width: '100%', maxWidth: 360, padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  card: { background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B7280', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', whiteSpace: 'nowrap' },
  td: { padding: '12px 16px', borderBottom: '1px solid #F3F4F6', verticalAlign: 'middle' },
  roleBadge: { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'capitalize' },
  editBtn: { padding: '5px 12px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 12 },
  delBtn: { padding: '5px 12px', borderRadius: 6, border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', fontSize: 12 },
  emptyState: { padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,.2)', maxHeight: '90vh', overflowY: 'auto' },
  closeBtn: { border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#6B7280' },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 13, outline: 'none' },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 13, background: '#fff', outline: 'none' },
  errorBox: { background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#B91C1C' },
  cancelBtn: { flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13 },
  saveBtn: { flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#7C3AED', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 },
}
