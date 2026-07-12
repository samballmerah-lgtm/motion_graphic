// pages/index.js
// Landing page pembelian lisensi. Sederhana, tanpa framework CSS eksternal
// supaya mudah dipahami pemula. Silakan percantik sesuai selera.

import { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const APP_ID = 'certgenpro'; // ganti sesuai app yang dijual di deployment ini

export default function Home() {
    const [form, setForm] = useState({ email: '', whatsapp: '', package_type: 'monthly', coupon_code: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ app_id: APP_ID, ...form }),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage(`Gagal: ${data.error}`);
                return;
            }

            if (data.free_trial) {
                setMessage(`Trial berhasil! Kode lisensi Anda: ${data.license_key} (sudah dikirim ke email/WA)`);
                return;
            }

            // Buka popup pembayaran Midtrans Snap
            if (window.snap) {
                window.snap.pay(data.snap_token, {
                    onSuccess: () => setMessage('Pembayaran berhasil! Cek email/WhatsApp Anda untuk kode lisensi.'),
                    onPending: () => setMessage('Pembayaran tertunda. Selesaikan pembayaran untuk menerima lisensi.'),
                    onError: () => setMessage('Terjadi kesalahan saat pembayaran.'),
                    onClose: () => setMessage('Popup pembayaran ditutup.'),
                });
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>Beli Lisensi</title>
            </Head>
            <Script
                src={
                    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
                        ? 'https://app.midtrans.com/snap/snap.js'
                        : 'https://app.sandbox.midtrans.com/snap/snap.js'
                }
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            />
            <main style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif', padding: 16 }}>
                <h1>Beli Lisensi</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label>
                        Email
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        WhatsApp (format 62xxxxxxxxxx)
                        <input
                            type="text"
                            value={form.whatsapp}
                            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        Paket
                        <select
                            value={form.package_type}
                            onChange={(e) => setForm({ ...form, package_type: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="daily">Harian</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </label>
                    <label>
                        Kode Kupon (opsional)
                        <input
                            type="text"
                            value={form.coupon_code}
                            onChange={(e) => setForm({ ...form, coupon_code: e.target.value })}
                            style={inputStyle}
                        />
                    </label>
                    <button type="submit" disabled={loading} style={buttonStyle}>
                        {loading ? 'Memproses...' : 'Beli Sekarang'}
                    </button>
                </form>
                {message && <p style={{ marginTop: 16 }}>{message}</p>}
                <p style={{ marginTop: 24 }}>
                    <a href="/renew">Perpanjang lisensi yang sudah ada &rarr;</a>
                </p>
            </main>
        </>
    );
}

const inputStyle = { display: 'block', width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' };
const buttonStyle = { padding: 12, background: '#111', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' };
