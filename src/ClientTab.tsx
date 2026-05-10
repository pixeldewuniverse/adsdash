import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Client {
  id: string
  name: string
  sbu?: string
  industry?: string
  pic_name?: string
  pic_email?: string
  active: boolean
  created_at: string
}

const INDUSTRIES = [
  'F&B', 'Retail', 'Fashion', 'Travel', 'Properti',
  'Kesehatan', 'Pendidikan', 'Teknologi', 'Lainnya',
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
  background: '#fff',
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function ClientTab() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [search, setSearch] = useState('')

  const fetchClients = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setClients(data)
    setLoading(false)
  }

  useEffect(() => { fetchClients() }, [])

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.sbu?.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleActive = async (c: Client) => {
    const { error } = await supabase.from('clients').update({ active: !c.active }).eq('id', c.id)
    if (!error) setClients(cs => cs.map(x => x.id === c.id ? { ...x, active: !c.active } : x))
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus client ini? Data ads yang terhubung tetap ada.')) return
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (!error) setClients(cs => cs.filter(c => c.id !== id))
    else alert('Gagal hapus: ' + error.message)
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#111' }}>🏢 Client / SBU</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9CA3AF' }}>Kelola brand dan strategic business unit</p>
        </div>
        <button onClick={() => { setEditClient(null); setShowModal(true) }} style={{
          padding: '10px 20px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
          color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
        }}>
          + Tambah Client
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { l: 'Total Client', v: clients.length, color: '#7C3AED' },
          { l: 'Aktif', v: clients.filter(c => c.active).length, color: '#16A34A' },
          { l: 'Non-aktif', v: clients.filter(c => !c.active).length, color: '#9CA3AF' },
        ].map(s => (
          <div key={s.l} style={{ background: '#fff', borderRadius: 12, padding: '14px 20px', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{s.l}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        placeholder="Cari nama client, SBU, atau industri..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, marginBottom: 16, fontSize: 14, padding: '10px 14px' }}
      />

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>Memuat...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF', background: '#fff', borderRadius: 12 }}>
              Tidak ada client ditemukan
            </div>
          )}
          {filtered.map(c => (
            <div key={c.id} style={{
              background: '#fff', borderRadius: 12, padding: '16px 20px',
              boxShadow: '0 1px 4px rgba(0,0,0,.08)',
              display: 'flex', alignItems: 'center', gap: 16,
              opacity: c.active ? 1 : .6,
              borderLeft: `4px solid ${c.active ? '#7C3AED' : '#D1D5DB'}`,
            }}>
              {/* Color dot */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: c.active ? 'linear-gradient(135deg,#7C3AED,#06B6D4)' : '#F3F4F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                🏢
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{c.name}</span>
                  {c.sbu && (
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#EDE9FE', color: '#7C3AED', fontWeight: 600 }}>
                      {c.sbu}
                    </span>
                  )}
                  {c.industry && (
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#F3F4F6', color: '#6B7280', fontWeight: 500 }}>
                      {c.industry}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                  ID: <strong>{c.id}</strong>
                  {c.pic_name && <> · PIC: {c.pic_name}</>}
                  {c.pic_email && <> · {c.pic_email}</>}
                </div>
              </div>

              {/* Active toggle */}
              <button onClick={() => handleToggleActive(c)} style={{
                padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: c.active ? '#F0FDF4' : '#F3F4F6',
                color: c.active ? '#16A34A' : '#9CA3AF',
                fontWeight: 700, fontSize: 12,
              }}>
                {c.active ? '● Aktif' : '○ Non-aktif'}
              </button>

              {/* Edit */}
              <button onClick={() => { setEditClient(c); setShowModal(true) }} style={{
                padding: '7px 14px', borderRadius: 8, border: '1px solid #E5E7EB',
                background: '#fff', cursor: 'pointer', fontSize: 12, color: '#374151',
              }}>
                ✏️ Edit
              </button>

              {/* Delete */}
              <button onClick={() => handleDelete(c.id)} style={{
                padding: '7px 10px', borderRadius: 8, border: 'none',
                background: 'none', cursor: 'pointer', fontSize: 16, color: '#FCA5A5',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                onMouseLeave={e => (e.currentTarget.style.color = '#FCA5A5')}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ClientModal
          client={editClient}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchClients() }}
        />
      )}
    </div>
  )
}

// ─── MODAL ─────────────────────────────────────────────────────────────────
function ClientModal({
  client, onClose, onSaved,
}: { client: Client | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!client
  const [form, setForm] = useState({
    id: client?.id || '',
    name: client?.name || '',
    sbu: client?.sbu || '',
    industry: client?.industry || '',
    pic_name: client?.pic_name || '',
    pic_email: client?.pic_email || '',
    active: client?.active ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const f = (k: string) => (v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.id.trim() || !form.name.trim()) { setError('ID dan Nama client wajib diisi.'); return }
    setLoading(true)
    setError('')

    if (isEdit) {
      const { error: err } = await supabase.from('clients').update({
        name: form.name, sbu: form.sbu, industry: form.industry,
        pic_name: form.pic_name, pic_email: form.pic_email, active: form.active,
      }).eq('id', form.id)
      if (err) { setError(err.message); setLoading(false); return }
    } else {
      const { error: err } = await supabase.from('clients').insert({
        id: form.id, name: form.name, sbu: form.sbu, industry: form.industry,
        pic_name: form.pic_name, pic_email: form.pic_email, active: form.active,
      })
      if (err) { setError(err.message); setLoading(false); return }
    }
    onSaved()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 520, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{isEdit ? '✏️ Edit Client' : '🏢 Tambah Client Baru'}</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#9CA3AF' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                Client ID <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input value={form.id} onChange={e => f('id')(e.target.value)} disabled={isEdit}
                placeholder="kado-bajo"
                style={{ ...inputStyle, background: isEdit ? '#F9FAFB' : '#fff', color: isEdit ? '#9CA3AF' : '#111' }} />
              {!isEdit && <p style={{ fontSize: 11, color: '#9CA3AF', margin: '3px 0 0' }}>huruf kecil, tanpa spasi, gunakan strip</p>}
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                Nama Brand <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input value={form.name} onChange={e => f('name')(e.target.value)} placeholder="Kado Bajo" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>SBU (optional)</label>
              <input value={form.sbu} onChange={e => f('sbu')(e.target.value)} placeholder="Maharani Group · F&B" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Industri</label>
              <select value={form.industry} onChange={e => f('industry')(e.target.value)}
                style={{ ...inputStyle }}>
                <option value="">— Pilih industri —</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Nama PIC</label>
              <input value={form.pic_name} onChange={e => f('pic_name')(e.target.value)} placeholder="Ika Putri" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Email PIC</label>
              <input type="email" value={form.pic_email} onChange={e => f('pic_email')(e.target.value)} placeholder="ika@maharani.id" style={inputStyle} />
            </div>
          </div>

          {/* Active toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => f('active')(!form.active)} style={{
              width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: form.active ? '#7C3AED' : '#D1D5DB', position: 'relative', transition: 'background .2s',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3, left: form.active ? 23 : 3, transition: 'left .2s',
              }} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
              {form.active ? 'Client Aktif' : 'Client Non-aktif'}
            </span>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#DC2626' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: 10, borderRadius: 8, border: '1px solid #D1D5DB',
              background: '#fff', cursor: 'pointer', fontSize: 13,
            }}>Batal</button>
            <button onClick={handleSave} disabled={loading} style={{
              flex: 1, padding: 10, borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
              color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              opacity: loading ? .7 : 1,
            }}>
              {loading ? 'Menyimpan...' : isEdit ? '💾 Simpan Perubahan' : '+ Tambah Client'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
