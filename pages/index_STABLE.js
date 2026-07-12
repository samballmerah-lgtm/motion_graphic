// pages/index.js

import { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const APP_ID = 'certgenpro'; 

export default function Home() {
    const [form, setForm] = useState({ email: '', whatsapp: '', package_type: 'yearly', coupon_code: '' });
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

            if (window.snap) {
                window.snap.pay(data.snap_token, {
                    onSuccess: () => {
                        window.location.href = `/thankyou?license_key=${data.license_key}`;
                    },
                    onPending: () => {
                        setMessage('Pembayaran tertunda. Selesaikan pembayaran untuk menerima lisensi.');
                    },
                    onError: () => {
                        window.location.href = '/failed';
                    },
                    onClose: () => {
                        setMessage('Popup pembayaran ditutup.');
                    },
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
                <title>Beli Lisensi - SVG Motion Studio</title>
            </Head>
            <Script
                src={
                    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
                        ? 'https://app.midtrans.com/snap/snap.js'
                        : 'https://app.sandbox.midtrans.com/snap/snap.js'
                }
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            />
            <div style={containerStyle}>
                <main style={cardStyle}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <span style={badgeStyle}>RILIS TERBARU v2.5.7</span>
                        <h1 style={titleStyle}>Ⓜ️ SVG Motion Studio v2</h1>
                        <p style={subtitleStyle}>Produksi video animasi dari aset vektor secara massal dalam hitungan menit.</p>
                    </div>

                    {/* Banner Paket Utama */}
                    <div style={pricingCardStyle}>
                        <h3 style={{ margin: 0, color: '#10b981', fontSize: 14, letterSpacing: '0.05em' }}>REKOMENDASI TERBAIK</h3>
                        <h2 style={{ margin: '8px 0', fontSize: 24, fontWeight: 'bold' }}>Paket Lisensi Tahunan</h2>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '12px 0' }}>
                            <span style={{ fontSize: 32, fontWeight: 'bold', color: '#fff' }}>Rp 149.000</span>
                            <span style={{ color: '#94a3b8', fontSize: 14 }}>/ tahun</span>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, lineHeight: '1.4' }}>
                            Akses penuh ke semua fitur premium, akselerasi GPU (NVENC/VTB), optimasi memori, serta ekspor CSV Adobe Stock & Shutterstock tanpa batas.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Alamat Email</label>
                            <input
                                type="email"
                                required
                                placeholder="nama@email.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Nomor WhatsApp (format: 62xxxxxxxxx)</label>
                            <input
                                type="text"
                                placeholder="628123456789"
                                value={form.whatsapp}
                                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Kode Kupon (Opsional)</label>
                            <input
                                type="text"
                                placeholder="MASUKKAN_KODE_DISINI"
                                value={form.coupon_code}
                                onChange={(e) => setForm({ ...form, coupon_code: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        <button type="submit" disabled={loading} style={buttonStyle}>
                            {loading ? 'Memproses Sesi...' : 'Miliki Lisensi Sekarang ⚡'}
                        </button>
                    </form>

                    {message && <p style={messageStyle}>{message}</p>}
                </main>
            </div>
        </>
    );
}

const containerStyle = { background: '#0e1013', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' };
const cardStyle = { background: '#16191f', border: '1px solid #1f2937', padding: '32px 24px', borderRadius: 16, width: '100%', maxWidth: 460, boxSizing: 'border-box' };
const badgeStyle = { background: '#1e293b', color: '#3b82f6', fontSize: 11, fontWeight: 'bold', padding: '4px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 12 };
const titleStyle = { margin: 0, fontSize: 24, fontWeight: 'bold', color: '#fff' };
const subtitleStyle = { margin: '8px 0 0 0', color: '#94a3b8', fontSize: 13, lineHeight: '1.4' };
const pricingCardStyle = { background: '#111317', border: '1px solid #10b981', borderRadius: 12, padding: 16, marginBottom: 24, marginTop: 12 };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 6 };
const inputStyle = { display: 'block', width: '100%', padding: 10, background: '#111317', border: '1px solid #1f2937', borderRadius: 8, color: '#fff', fontSize: 13, boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: 12, background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 14, transition: '0.2s' };
const messageStyle = { marginTop: 16, padding: 10, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12, color: '#cbd5e1', textAlign: 'center', lineHeight: '1.4' };