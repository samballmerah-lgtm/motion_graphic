// pages/api/renew.js
// Endpoint: POST /api/renew
// Body: { app_id, license_key, package_type }
//
// Alur:
// 1. Cari lisensi, tampilkan status saat ini (dipanggil dulu via GET untuk cek status
//    -- lihat handler GET di bawah).
// 2. Buat transaksi Midtrans Snap untuk paket perpanjangan.
// 3. Setelah dibayar (via webhook terpisah /api/renew/webhook, lihat catatan di bawah),
//    durasi baru DIAKUMULASI jika lisensi masih aktif, atau dihitung dari hari ini
//    jika sudah kedaluwarsa. license_key dan hwid TIDAK berubah.

import { supabase } from '../../lib/supabase';

const PACKAGE_DAYS = { daily: 1, monthly: 30, yearly: 365 };
const PACKAGE_PRICE = {
    // sesuaikan dengan PRICE_TABLE di payment/create.js per app_id jika berbeda
    certgenpro: { daily: 15000, monthly: 99000, yearly: 799000 },
};

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // ---- Cek status lisensi sebelum perpanjangan ----
        const { app_id, license_key } = req.query;
        if (!app_id || !license_key) {
            return res.status(400).json({ error: 'app_id dan license_key wajib diisi' });
        }
        const { data: license, error } = await supabase
            .from('licenses')
            .select('license_key, type, status, expires_at')
            .eq('app_id', app_id)
            .eq('license_key', license_key)
            .single();

        if (error || !license) return res.status(404).json({ error: 'Lisensi tidak ditemukan' });

        const isActive = license.status === 'active' && new Date(license.expires_at) > new Date();
        return res.status(200).json({
            license_key: license.license_key,
            current_type: license.type,
            is_active: isActive,
            expires_at: license.expires_at,
        });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { app_id, license_key, package_type } = req.body;
        if (!app_id || !license_key || !package_type) {
            return res.status(400).json({ error: 'app_id, license_key, package_type wajib diisi' });
        }

        const priceTable = PACKAGE_PRICE[app_id];
        const days = PACKAGE_DAYS[package_type];
        if (!priceTable || !days) return res.status(400).json({ error: 'app_id/package_type tidak valid' });

        const { data: license, error } = await supabase
            .from('licenses')
            .select('*')
            .eq('app_id', app_id)
            .eq('license_key', license_key)
            .single();
        if (error || !license) return res.status(404).json({ error: 'Lisensi tidak ditemukan' });

        const orderId = `renew-${app_id}-${package_type}-${Date.now()}`;
        const price = priceTable[package_type];

        const midtransRes = await fetch(
            `${process.env.MIDTRANS_IS_PRODUCTION === 'true'
                ? 'https://app.midtrans.com'
                : 'https://app.sandbox.midtrans.com'}/snap/v1/transactions`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64'),
                },
                body: JSON.stringify({
                    transaction_details: { order_id: orderId, gross_amount: price },
                    customer_details: { email: license.email, phone: license.whatsapp },
                    custom_field1: app_id,
                    custom_field2: `renew_${package_type}`,
                    custom_field3: license_key, // dipakai webhook untuk tahu lisensi mana yang diperpanjang
                }),
            }
        );
        const midtransData = await midtransRes.json();
        if (!midtransRes.ok) {
            return res.status(502).json({ error: 'Gagal membuat transaksi Midtrans', detail: midtransData });
        }

        // Simpan order_id sementara di kolom order_id (dipakai webhook renew)
        await supabase.from('licenses').update({ order_id: orderId }).eq('id', license.id);

        return res.status(200).json({
            order_id: orderId,
            snap_token: midtransData.token,
            redirect_url: midtransData.redirect_url,
            renewal_days: days,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error', detail: err.message });
    }
}
