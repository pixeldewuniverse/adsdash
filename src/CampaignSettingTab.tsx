import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Campaign {
  id: string
  campaign_name: string
  client_id: string
  platform_name: string
  objective: string
  budget: number | null
  start_date: string | null
  end_date: string | null
  status: 'active' | 'paused' | 'ended'
  created_at: string
}

interface Client { id: string; name: string }

const PLATFORMS = ['Meta', 'Google', 'TikTok', 'YouTube', 'X (Twitter)', 'LinkedIn']
const OBJECTIVES = ['Awareness', 'Reach', 'Traffic', 'Engagement', 'Msg/WA/DM', 'Lead Gen', 'Conversions', 'Get Direction', 'Sales']
const STATUSES = ['active', 'paused', 'ended'] as const

const STATUS_COLOR = { active: '#16A34A', paused: '#D97706', ended: '#9CA3AF' }
const STATUS_BG = { active: '#F0FDF4', paused: '#FFFBEB', ended: '#F3F4F6' }
const PLATFORM_EMOJI: Record<string, string> = {
  Meta: '📘', Google: '🔴', TikTok: '🎵', YouTube: '▶️', 'X (Twitter)': '🐦', LinkedIn: '💼',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB',
  borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#fff',
}

const fmtRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`
const fmt = (s: string | null) => s ? new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function CampaignSettingTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Campaign | null>(null)
  const [search, setSearch] = useState('')
  const [filterClient, setFilterClient] = useState('All')
  const [filterPlatform, setFilterPlatform] = useState('All')
  const [filterStatus, setFilterStatus] = useState<string>('All')

  const fetch = async () => {
    setLoading(true)
    const [{ data: cams }, { data: cls }] = await Promise.all([
      supabase.from('dim_campaigns').select('*').order('created_at', { ascending: false }),
      supabase.from('clients').select('id, name').order('name'),
    ])
    if (cams) setCampaigns(cams)
    if (cls) setClients(cls)
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const filtered = campaigns.filter(c =>
    (filterClient === 'All' || c.client_id === filterClient) &&
    (filterPlatform === 'All' || c.platform_name === filterPlatform) &&
    (filterStatus === 'All' || c.status === filterStatus) &&
    c.campaign_name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus campaign ini?')) return
    const { error } = await supabase.from('dim_campaigns').delete().eq('id', id)
    if (!error) setCampaigns(cs => cs.filter(c => c.id !== id))
    else alert('Gagal hapus: ' + error.message)
  }

  const handleStatusChange = async (id: string, status: Campaign['status']) => {
    const { error } = await supabase.from('dim_campaigns').update({ status }).eq('id', id)
    if (!error) setCampaigns(cs => cs.map(c => c.id === id ? { ...c, status } : c))
    else alert('Gagal update: ' + error.message)
  }

  const clientName = (id: string) => clients.find(c => c.id === id)?.name || id

  return (
    <div style={{ maxWidth: 1060, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#111' }}>📣 Campaign Settings</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9CA3AF' }}>Kelola daftar campaign per client dan platform</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true) }} style={{
          padding: '10px 20px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
          color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
        }}>
          + Tambah Campaign
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { l: 'Total', v: campaigns.length, color: '#7C3AED' },
          { l: 'Aktif', v: campaigns.filter(c => c.status === 'active').length, color: '#16A34A' },
          { l: 'Paused', v: campaigns.filter(c => c.status === 'paused').length, color: '#D97706' },
          { l: 'Selesai', v: campaigns.filter(c => c.status === 'ended').length, color: '#9CA3AF' },
        ].map(s => (
          <div key={s.l} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{s.l}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Cari campaign..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, width: 220 }} />
        {[
          { label: 'Client', val: filterClient, set: setFilterClient, opts: ['All', ...clients.map(c => c.id)] },
          { label: 'Platform', val: filterPlatform, set: setFilterPlatform, opts: ['All', ...PLATFORMS] },
          { label: 'Status', val: filterStatus, set: setFilterStatus, opts: ['All', ...STATUSES] },
        ].map(f => (
          <select key={f.label} value={f.val} onChange={e => f.set(e.target.value)}
            style={{ ...inputStyle, width: 'auto' }}>
            {f.opts.map(o => (
              <option key={o} value={o}>
                {f.label === 'Client' && o !== 'All' ? clientName(o) : o}
              </option>
            ))}
          </select>
        ))}
        <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 'auto' }}>{filtered.length} campaign</span>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>Memuat...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.08)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #F3F4F6' }}>
                  {['Campaign', 'Client', 'Platform', 'Objective', 'Budget', 'Periode', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', color: '#374151', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>Tidak ada campaign</td></tr>
                )}
                {filtered.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #F9FAFB', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.campaign_name}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#7C3AED', fontWeight: 500 }}>{clientName(c.client_id)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span>{PLATFORM_EMOJI[c.platform_name] || '📱'}</span> {c.platform_name}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#6B7280', fontSize: 12 }}>{c.objective}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 500 }}>{c.budget ? fmtRp(c.budget) : '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#6B7280', whiteSpace: 'nowrap' }}>
                      {fmt(c.start_date)} – {fmt(c.end_date)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <select
                        value={c.status}
                        onChange={e => handleStatusChange(c.id, e.target.value as Campaign['status'])}
                        style={{
                          padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12,
                          background: STATUS_BG[c.status], color: STATUS_COLOR[c.status], outline: 'none',
                        }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { setEditItem(c); setShowModal(true) }}
                          style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 12 }}>
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(c.id)}
                          style={{ padding: '5px 10px', borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: '#FCA5A5' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#FCA5A5')}>
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <CampaignModal
          campaign={editItem}
          clients={clients}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetch() }}
        />
      )}
    </div>
  )
}

// ─── MODAL ─────────────────────────────────────────────────────────────────
function CampaignModal({
  campaign, clients, onClose, onSaved,
}: { campaign: Campaign | null; clients: Client[]; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!campaign
  const [form, setForm] = useState({
    campaign_name: campaign?.campaign_name || '',
    client_id: campaign?.client_id || '',
    platform_name: campaign?.platform_name || 'Meta',
    objective: campaign?.objective || 'Awareness',
    budget: campaign?.budget ? String(campaign.budget) : '',
    start_date: campaign?.start_date || '',
    end_date: campaign?.end_date || '',
    status: campaign?.status || 'active',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const f = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.campaign_name.trim() || !form.client_id) {
      setError('Nama campaign dan client wajib diisi.'); return
    }
    setLoading(true)
    setError('')
    const payload = {
      campaign_name: form.campaign_name,
      client_id: form.client_id,
      platform_name: form.platform_name,
      objective: form.objective,
      budget: form.budget ? Number(form.budget) : null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: form.status,
    }

    const { error: err } = isEdit
      ? await supabase.from('dim_campaigns').update(payload).eq('id', campaign!.id)
      : await supabase.from('dim_campaigns').insert(payload)

    if (err) { setError(err.message); setLoading(false); return }
    onSaved()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{isEdit ? '✏️ Edit Campaign' : '📣 Tambah Campaign Baru'}</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#9CA3AF' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Nama Campaign *</label>
            <input value={form.campaign_name} onChange={e => f('campaign_name')(e.target.value)}
              placeholder="Campaign Ramadhan 2026" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Client *</label>
              <select value={form.client_id} onChange={e => f('client_id')(e.target.value)} style={inputStyle}>
                <option value="">— Pilih Client —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Platform *</label>
              <select value={form.platform_name} onChange={e => f('platform_name')(e.target.value)} style={inputStyle}>
                {PLATFORMS.map(p => <option key={p} value={p}>{PLATFORM_EMOJI[p]} {p}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Objective</label>
              <select value={form.objective} onChange={e => f('objective')(e.target.value)} style={inputStyle}>
                {OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Budget (Rp)</label>
              <input type="number" value={form.budget} onChange={e => f('budget')(e.target.value)}
                placeholder="5000000" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Tanggal Mulai</label>
              <input type="date" value={form.start_date} onChange={e => f('start_date')(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Tanggal Selesai</label>
              <input type="date" value={form.end_date} onChange={e => f('end_date')(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Status</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => f('status')(s)} style={{
                  padding: '7px 16px', borderRadius: 20, border: `2px solid ${form.status === s ? STATUS_COLOR[s] : '#E5E7EB'}`,
                  background: form.status === s ? STATUS_BG[s] : '#fff',
                  color: form.status === s ? STATUS_COLOR[s] : '#9CA3AF',
                  fontWeight: 700, fontSize: 12, cursor: 'pointer',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#DC2626' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', background: '#fff', cursor: 'pointer', fontSize: 13 }}>Batal</button>
            <button onClick={handleSave} disabled={loading} style={{
              flex: 1, padding: 10, borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
              color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: loading ? .7 : 1,
            }}>
              {loading ? 'Menyimpan...' : isEdit ? '💾 Simpan' : '+ Tambah Campaign'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
