// pages/api/admin/licenses.js
// GET   /api/admin/licenses?app_id=xxx        -> daftar lisensi
// POST  /api/admin/licenses                   -> buat lisensi manual (backup jika webhook gagal)
// PATCH /api/admin/licenses                   -> ubah status (mis. revoke) { id, status }
// Header wajib: Authorization: Bearer <ADMIN_PASSWORD>

import { supabase } from '../../../lib/supabase';
import { checkAdminAuth } from '../../../lib/adminAuth';
import { generateLicenseKey, sendWhatsApp, sendEmail, buildLicenseMessage } from '../../../lib/notify';

const APP_NAMES = { certgenpro: 'CertGen Pro' };
const APP_PREFIXES = { certgenpro: 'CGP' };
const PACKAGE_DAYS = { daily: 1, monthly: 30, yearly: 365 };

export default async function handler(req, res) {
    if (!checkAdminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
        const { app_id, status } = req.query;
        let query = supabase.from('licenses').select('*').order('created_at', { ascending: false }).limit(200);
        if (app_id) query = query.eq('app_id', app_id);
        if (status) query = query.eq('status', status);
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ licenses: data });
    }

    if (req.method === 'POST') {
        // Buat lisensi manual (backup webhook gagal)
        const { app_id, email, whatsapp, type } = req.body;
        if (!app_id || !email || !type) {
            return res.status(400).json({ error: 'app_id, email, type wajib diisi' });
        }

        const prefix = APP_PREFIXES[app_id] || 'LIC';
        const licenseKey = generateLicenseKey(prefix);
        const days = PACKAGE_DAYS[type];
        const expiresAt = days ? new Date(Date.now() + days * 86400000).toISOString() : null;

        const { data, error } = await supabase
            .from('licenses')
            .insert({
                app_id,
                license_key: licenseKey,
                email,
                whatsapp,
                type,
                status: 'pending',
                expires_at: expiresAt,
            })
            .select()
            .single();
        if (error) return res.status(500).json({ error: error.message });

        const appName = APP_NAMES[app_id] || app_id;
        const msg = buildLicenseMessage({ appName, licenseKey, type, expiresAt });
        if (whatsapp) await sendWhatsApp(whatsapp, msg.text);
        await sendEmail({ to: email, subject: `Lisensi ${appName} Anda (Manual)`, htmlContent: msg.html });

        return res.status(200).json({ license: data });
    }

    if (req.method === 'PATCH') {
        // Ubah status, misal untuk revoke: { id, status: 'revoked' }
        const { id, status } = req.body;
        if (!id || !status) return res.status(400).json({ error: 'id dan status wajib diisi' });
        const { data, error } = await supabase
            .from('licenses')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ license: data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
