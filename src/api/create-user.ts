import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password, full_name, role, client_id } = req.body

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, dan role wajib diisi' })
  }

  try {
    // Create user di Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    })

    if (authError || !authData.user) {
      return res.status(400).json({ error: authError?.message || 'Gagal membuat user' })
    }

    // Insert ke profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        role,
        client_id: client_id || null,
      })

    if (profileError) {
      // Rollback — hapus user yang baru dibuat
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return res.status(400).json({ error: profileError.message })
    }

    return res.status(200).json({ success: true, user_id: authData.user.id })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
