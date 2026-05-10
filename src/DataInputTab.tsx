import { useState, useRef } from 'react'
import { supabase } from './lib/supabase'

// Expected CSV columns (case-insensitive matching)
const COLUMN_MAP: Record<string, string> = {
  date: 'report_date',
  report_date: 'report_date',
  spend: 'spend',
  impressions: 'impressions',
  clicks: 'clicks',
  conversions: 'conversions_7d_click',
  conversions_7d_click: 'conversions_7d_click',
  conversion_value: 'conversion_value',
  platform: 'platform_name', // resolved to dim_platforms FK later
  brand: 'client_id',        // resolved to client FK later
  client_id: 'client_id',
}

type CSVRow = Record<string, string>
type ParsedRow = {
  report_date: string
  spend: number
  impressions: number
  clicks: number
  conversions_7d_click: number
  conversion_value: number
  platform_name: string
  client_label: string
  _raw: CSVRow
}

function parseCSV(text: string): { headers: string[]; rows: CSVRow[] } {
  const lines = text.trim().split(/\r?\n/)
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const rows = lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const obj: CSVRow = {}
    headers.forEach((h, i) => { obj[h] = vals[i] ?? '' })
    return obj
  })
  return { headers, rows }
}

function toNum(v: string | undefined): number {
  if (!v) return 0
  return parseFloat(v.replace(/[^0-9.-]/g, '')) || 0
}

export default function DataInputTab() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<'idle' | 'preview' | 'uploading' | 'done' | 'error'>('idle')
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [fileName, setFileName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successCount, setSuccessCount] = useState(0)
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [platforms, setPlatforms] = useState<{ id: string; platform_name: string }[]>([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedPlatformId, setSelectedPlatformId] = useState('')
  const [dragOver, setDragOver] = useState(false)

  // Load clients & platforms on mount
  useState(() => {
    supabase.from('dim_clients').select('id, name').then(({ data }) => {
      if (data) setClients(data)
    })
    supabase.from('dim_platforms').select('id, platform_name').then(({ data }) => {
      if (data) setPlatforms(data)
    })
  })

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setErrorMsg('Hanya file .csv yang didukung.')
      setStep('error')
      return
    }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const { headers, rows } = parseCSV(e.target?.result as string)
        setCsvHeaders(headers)
        const parsed: ParsedRow[] = rows.filter(r => Object.values(r).some(v => v)).map(r => ({
          report_date: r['date'] || r['report_date'] || '',
          spend: toNum(r['spend']),
          impressions: toNum(r['impressions']),
          clicks: toNum(r['clicks']),
          conversions_7d_click: toNum(r['conversions'] || r['conversions_7d_click']),
          conversion_value: toNum(r['conversion_value']),
          platform_name: r['platform'] || r['platform_name'] || '',
          client_label: r['brand'] || r['client'] || r['client_id'] || '',
          _raw: r,
        }))
        setParsedRows(parsed)
        setStep('preview')
      } catch {
        setErrorMsg('Gagal membaca file CSV. Periksa format kolom.')
        setStep('error')
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleConfirm = async () => {
    if (!selectedClientId || !selectedPlatformId) {
      setErrorMsg('Pilih Client dan Platform terlebih dahulu.')
      return
    }
    setStep('uploading')
    setErrorMsg('')

    const records = parsedRows.map(r => ({
      report_date: r.report_date,
      spend: r.spend,
      impressions: r.impressions,
      clicks: r.clicks,
      conversions_7d_click: r.conversions_7d_click,
      conversion_value: r.conversion_value,
      client_id: selectedClientId,
      platform_id: selectedPlatformId,
    }))

    const CHUNK = 500
    let inserted = 0
    for (let i = 0; i < records.length; i += CHUNK) {
      const chunk = records.slice(i, i + CHUNK)
      const { error } = await supabase.from('fact_daily_performance').insert(chunk)
      if (error) {
        setErrorMsg(`Error saat insert: ${error.message}`)
        setStep('error')
        return
      }
      inserted += chunk.length
    }
    setSuccessCount(inserted)
    setStep('done')
  }

  const reset = () => {
    setStep('idle')
    setCsvHeaders([])
    setParsedRows([])
    setFileName('')
    setErrorMsg('')
    setSelectedClientId('')
    setSelectedPlatformId('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const S = styles

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div>
          <h2 style={S.title}>Input Data CSV</h2>
          <p style={S.subtitle}>Upload file laporan iklan, preview, lalu konfirmasi untuk menyimpan ke database</p>
        </div>
        {step !== 'idle' && (
          <button onClick={reset} style={S.resetBtn}>↩ Mulai Ulang</button>
        )}
      </div>

      {/* STEP: IDLE — Upload Zone */}
      {step === 'idle' && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            ...S.dropzone,
            borderColor: dragOver ? '#7C3AED' : '#D1D5DB',
            background: dragOver ? '#EDE9FE' : '#FAFAFA',
          }}
        >
          <input
            ref={fileRef} type="file" accept=".csv"
            style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
          />
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#111', marginBottom: 6 }}>
            Drag & drop file CSV di sini
          </div>
          <div style={{ fontSize: 13, color: '#9CA3AF' }}>atau klik untuk browse</div>
          <div style={S.formatHint}>
            Kolom yang didukung: <code>date, spend, impressions, clicks, conversions, conversion_value</code>
          </div>
        </div>
      )}

      {/* STEP: PREVIEW */}
      {step === 'preview' && (
        <div>
          {/* File info + selectors */}
          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 28 }}>📄</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{fileName}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>{parsedRows.length} baris ditemukan · {csvHeaders.length} kolom</div>
              </div>
              <span style={S.badge}>{parsedRows.length} rows</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={S.label}>Client / Brand *</label>
                <select
                  value={selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                  style={S.select}
                >
                  <option value="">-- Pilih Client --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={S.label}>Platform *</label>
                <select
                  value={selectedPlatformId}
                  onChange={e => setSelectedPlatformId(e.target.value)}
                  style={S.select}
                >
                  <option value="">-- Pilih Platform --</option>
                  {platforms.map(p => (
                    <option key={p.id} value={p.id}>{p.platform_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {errorMsg && <div style={S.errorBox}>{errorMsg}</div>}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={reset} style={S.cancelBtn}>Batal</button>
              <button
                onClick={handleConfirm}
                disabled={!selectedClientId || !selectedPlatformId}
                style={{
                  ...S.confirmBtn,
                  opacity: (!selectedClientId || !selectedPlatformId) ? 0.5 : 1,
                  cursor: (!selectedClientId || !selectedPlatformId) ? 'not-allowed' : 'pointer',
                }}
              >
                ✅ Konfirmasi & Simpan {parsedRows.length} Baris
              </button>
            </div>
          </div>

          {/* Preview table */}
          <div style={S.card}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>
              Preview Data (10 baris pertama)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {['Tanggal', 'Spend', 'Impressions', 'Clicks', 'Conversions', 'Conv. Value'].map(h => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 10).map((r, i) => (
                    <tr key={i} style={{ background: i % 2 ? '#FAFAFA' : '#fff' }}>
                      <td style={S.td}>{r.report_date}</td>
                      <td style={S.tdNum}>Rp {r.spend.toLocaleString('id-ID')}</td>
                      <td style={S.tdNum}>{r.impressions.toLocaleString('id-ID')}</td>
                      <td style={S.tdNum}>{r.clicks.toLocaleString('id-ID')}</td>
                      <td style={S.tdNum}>{r.conversions_7d_click.toLocaleString('id-ID')}</td>
                      <td style={S.tdNum}>Rp {r.conversion_value.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedRows.length > 10 && (
                <div style={{ padding: '10px 16px', fontSize: 12, color: '#9CA3AF' }}>
                  + {parsedRows.length - 10} baris lainnya tidak ditampilkan
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP: UPLOADING */}
      {step === 'uploading' && (
        <div style={S.centerBox}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Menyimpan data...</div>
          <div style={{ fontSize: 13, color: '#6B7280' }}>Mohon tunggu, jangan tutup halaman ini</div>
        </div>
      )}

      {/* STEP: DONE */}
      {step === 'done' && (
        <div style={S.centerBox}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 6, color: '#059669' }}>
            Berhasil Disimpan!
          </div>
          <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
            {successCount} baris berhasil dimasukkan ke database.
          </div>
          <button onClick={reset} style={S.confirmBtn}>Upload File Berikutnya</button>
        </div>
      )}

      {/* STEP: ERROR */}
      {step === 'error' && (
        <div style={S.centerBox}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>❌</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: '#EF4444' }}>Terjadi Kesalahan</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 20, maxWidth: 400, textAlign: 'center' }}>{errorMsg}</div>
          <button onClick={reset} style={S.confirmBtn}>Coba Lagi</button>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 900 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 },
  title: { margin: 0, fontSize: 18, fontWeight: 800, color: '#111' },
  subtitle: { margin: '4px 0 0', fontSize: 13, color: '#9CA3AF' },
  resetBtn: { padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' },
  dropzone: {
    border: '2px dashed', borderRadius: 16, padding: '60px 32px',
    textAlign: 'center', cursor: 'pointer', transition: 'all .2s',
  },
  formatHint: { marginTop: 20, fontSize: 12, color: '#9CA3AF', background: '#F3F4F6', borderRadius: 8, padding: '10px 16px', display: 'inline-block' },
  card: { background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 16 },
  badge: { marginLeft: 'auto', background: '#EDE9FE', color: '#7C3AED', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 13, background: '#fff', outline: 'none' },
  errorBox: { background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#B91C1C', marginBottom: 16 },
  cancelBtn: { padding: '10px 20px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13 },
  confirmBtn: { padding: '10px 24px', borderRadius: 8, border: 'none', background: '#7C3AED', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 },
  centerBox: { background: '#fff', borderRadius: 16, padding: '60px 32px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.08)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B7280', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' },
  td: { padding: '10px 14px', color: '#374151', borderBottom: '1px solid #F3F4F6' },
  tdNum: { padding: '10px 14px', color: '#111', fontWeight: 500, borderBottom: '1px solid #F3F4F6', textAlign: 'right' },
}
