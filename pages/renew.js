// pages/renew.js

import { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const APP_ID = 'certgenpro';

export default function Renew() {
    const [form, setForm] = useState({ email: '', whatsapp: '', package_type: 'yearly', coupon_code: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const packages = [
        { id: 'daily', label: 'Harian', duration: '1 Hari', price: 'Rp 9.900', desc: 'Cocok untuk uji coba cepat fitur ekspor.' },
        { id: 'monthly', label: 'Bulanan', duration: '30 Hari', price: 'Rp 29.000', desc: 'Pilihan fleksibel bagi kreator musiman.' },
        { id: 'yearly', label: 'Tahunan', duration: '365 Hari', price: 'Rp 149.000', desc: 'Rekomendasi terbaik bagi profesional.', popular: true },
        { id: 'lifetime', label: 'Lifetime', duration: 'Selamanya', price: 'Rp 399.000', desc: 'Sekali bayar untuk akses selamanya tanpa batas.' }
    ];

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
                <title>Pembelian Lisensi SVG Motion</title>
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
                    <div style={{ textAlign: 'center', marginBottom: 28 }}>
                        <span style={badgeStyle}>PAKET AKTIVASI PREMIUM</span>
                        <h1 style={titleStyle}>Pembelian Lisensi SVG Motion</h1>
                        <p style={subtitleStyle}>Pilih durasi paket lisensi yang sesuai dengan kebutuhan produksi video Anda.</p>
                    </div>

                    {/* Grid Pilihan Paket */}
                    <div style={gridStyle}>
                        {packages.map((pkg) => {
                            const isSelected = form.package_type === pkg.id;
                            return (
                                <div 
                                    key={pkg.id} 
                                    onClick={() => setForm({ ...form, package_type: pkg.id })}
                                    style={{
                                        ...pkgCardStyle,
                                        borderColor: isSelected ? '#10b981' : '#1f2937',
                                        background: isSelected ? '#111827' : '#111317'
                                    }}
                                >
                                    {pkg.popular && <span style={popularBadgeStyle}>TERPOPULER</span>}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <h3 style={{ margin: 0, color: '#fff', fontSize: 15 }}>{pkg.label}</h3>
                                        <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 'bold' }}>{pkg.duration}</span>
                                    </div>
                                    <h4 style={{ margin: '6px 0', fontSize: 18, fontWeight: 'bold', color: isSelected ? '#10b981' : '#fff' }}>
                                        {pkg.price}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: '1.3' }}>{pkg.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                                placeholder="KUPON_DISKON"
                                value={form.coupon_code}
                                onChange={(e) => setForm({ ...form, coupon_code: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        <button type="submit" disabled={loading} style={buttonStyle}>
                            {loading ? 'Memproses Sesi...' : 'Selesaikan Pembayaran & Aktivasi 💳'}
                        </button>
                    </form>

                    {message && <p style={messageStyle}>{message}</p>}
                </main>
            </div>
        </>
    );
}

const containerStyle = { background: '#0e1013', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' };
const cardStyle = { background: '#16191f', border: '1px solid #1f2937', padding: '32px 24px', borderRadius: 16, width: '100%', maxWidth: 540, boxSizing: 'border-box' };
const badgeStyle = { background: '#1e293b', color: '#10b981', fontSize: 11, fontWeight: 'bold', padding: '4px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 12 };
const titleStyle = { margin: 0, fontSize: 24, fontWeight: 'bold', color: '#fff' };
const subtitleStyle = { margin: '8px 0 0 0', color: '#94a3b8', fontSize: 13, lineHeight: '1.4' };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 6 };
const inputStyle = { display: 'block', width: '100%', padding: 10, background: '#111317', border: '1px solid #1f2937', borderRadius: 8, color: '#fff', fontSize: 13, boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: 12, background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 14, transition: '0.2s', marginTop: 10 };
const messageStyle = { marginTop: 16, padding: 10, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12, color: '#cbd5e1', textAlign: 'center', lineHeight: '1.4' };

const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 };
const pkgCardStyle = { border: '1px solid #1f2937', borderRadius: 10, padding: 14, cursor: 'pointer', transition: '0.2s', position: 'relative' };
const popularBadgeStyle = { position: 'absolute', top: -8, right: 10, background: '#3b82f6', color: '#fff', fontSize: 9, fontWeight: 'bold', padding: '2px 6px', borderRadius: 4 };