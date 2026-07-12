// pages/renew.js

import { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const APP_ID = 'certgenpro';

export default function Renew() {
    const [licenseKey, setLicenseKey] = useState('');
    const [status, setStatus] = useState(null);
    const [packageType, setPackageType] = useState('monthly');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const priceList = {
        daily: { label: 'Harian (1 Hari)', price: 'Rp 9.900' },
        monthly: { label: 'Bulanan (30 Hari)', price: 'Rp 29.000' },
        yearly: { label: 'Tahunan (365 Hari)', price: 'Rp 149.000' },
        lifetime: { label: 'Lifetime (Selamanya)', price: 'Rp 399.000' }
    };

    async function checkStatus() {
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch(`/api/renew?app_id=${APP_ID}&license_key=${encodeURIComponent(licenseKey)}`);
            const data = await res.json();
            if (!res.ok) {
                setMessage(`Gagal: ${data.error}`);
                setStatus(null);
                return;
            }
            setStatus(data);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleRenew() {
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/renew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ app_id: APP_ID, license_key: licenseKey, package_type: packageType }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(`Gagal: ${data.error}`);
                return;
            }
            if (window.snap) {
                window.snap.pay(data.snap_token, {
                    onSuccess: () => {
                        window.location.href = `/thankyou?license_key=${licenseKey}&type=renew`;
                    },
                    onPending: () => setMessage('Pembayaran tertunda.'),
                    onError: () => setMessage('Terjadi kesalahan saat pembayaran.'),
                    onClose: () => setMessage('Popup ditutup.'),
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
                <title>Perpanjang Lisensi - SVG Motion Studio</title>
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
                    <h1 style={titleStyle}>🔑 Perpanjang Lisensi</h1>
                    <p style={subtitleStyle}>Masukkan kode lisensi aktif atau kedaluwarsa Anda untuk diperpanjang.</p>

                    <div style={{ marginTop: 20 }}>
                        <label style={labelStyle}>Kode Lisensi Anda</label>
                        <input
                            type="text"
                            placeholder="SVG-XXXX-XXXX-XXXX"
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                            style={inputStyle}
                        />
                    </div>

                    <button onClick={checkStatus} disabled={loading || !licenseKey} style={buttonSecondaryStyle}>
                        {loading ? 'Memeriksa...' : 'Cek Status & Lanjutkan'}
                    </button>

                    {status && (
                        <div style={statusContainerStyle}>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#fff' }}>📋 Status Lisensi Saat Ini</h3>
                            <p style={infoTextStyle}>Status: <strong style={{ color: status.is_active ? '#10b981' : '#ef4444' }}>{status.is_active ? 'Aktif' : 'Tidak Aktif / Kedaluwarsa'}</strong></p>
                            <p style={infoTextStyle}>Tipe Lisensi: <span style={{ textTransform: 'capitalize' }}>{status.current_type}</span></p>
                            <p style={infoTextStyle}>Berlaku Hingga: {status.expires_at ? new Date(status.expires_at).toLocaleDateString('id-ID') : '-'}</p>

                            <label style={{ ...labelStyle, marginTop: 16 }}>Pilih Paket Perpanjangan Baru</label>
                            <select value={packageType} onChange={(e) => setPackageType(e.target.value)} style={selectStyle}>
                                {Object.entries(priceList).map(([key, item]) => (
                                    <option key={key} value={key}>{item.label} - {item.price}</option>
                                ))}
                            </select>

                            <button onClick={handleRenew} disabled={loading} style={buttonPrimaryStyle}>
                                {loading ? 'Memproses Sesi...' : 'Perpanjang Sekarang 💳'}
                            </button>
                        </div>
                    )}

                    {message && <p style={messageStyle}>{message}</p>}

                    <div style={{ marginTop: 24, textAlign: 'center', borderTop: '1px solid #1f2937', paddingTop: 16 }}>
                        <a href="/" style={linkStyle}>&larr; Kembali ke Pembelian Baru</a>
                    </div>
                </main>
            </div>
        </>
    );
}

// CSS Inline
const containerStyle = { background: '#0e1013', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' };
const cardStyle = { background: '#16191f', border: '1px solid #1f2937', padding: '32px 24px', borderRadius: 16, width: '100%', maxWidth: 460, boxSizing: 'border-box' };
const titleStyle = { margin: 0, fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center' };
const subtitleStyle = { margin: '8px 0 0 0', color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: '1.4' };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 6 };
const inputStyle = { display: 'block', width: '100%', padding: 10, background: '#111317', border: '1px solid #1f2937', borderRadius: 8, color: '#fff', fontSize: 13, boxSizing: 'border-box', fontFamily: 'monospace' };
const buttonSecondaryStyle = { width: '100%', padding: 10, background: '#1e293b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 13, marginTop: 12, transition: '0.2s' };
const buttonPrimaryStyle = { width: '100%', padding: 12, background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 13, marginTop: 16, transition: '0.2s' };
const statusContainerStyle = { marginTop: 20, padding: 16, background: '#111317', border: '1px solid #1f2937', borderRadius: 10 };
const infoTextStyle = { margin: '6px 0', fontSize: 13, color: '#94a3b8' };
const selectStyle = { display: 'block', width: '100%', padding: 10, background: '#16191f', border: '1px solid #1f2937', borderRadius: 8, color: '#fff', fontSize: 13, boxSizing: 'border-box' };
const linkStyle = { color: '#3b82f6', textDecoration: 'none', fontSize: 12, fontWeight: '500' };
const messageStyle = { marginTop: 16, padding: 10, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12, color: '#cbd5e1', textAlign: 'center' };