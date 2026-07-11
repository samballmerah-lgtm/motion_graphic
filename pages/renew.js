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
                    onSuccess: () => setMessage('Perpanjangan berhasil! Cek email/WhatsApp Anda.'),
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
                <title>Perpanjang Lisensi</title>
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
                <h1>Perpanjang Lisensi</h1>
                <label>
                    Kode Lisensi
                    <input
                        type="text"
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value)}
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4, marginBottom: 12, boxSizing: 'border-box' }}
                    />
                </label>
                <button onClick={checkStatus} disabled={loading || !licenseKey}>
                    Cek Status
                </button>

                {status && (
                    <div style={{ marginTop: 16, padding: 12, border: '1px solid #ddd', borderRadius: 4 }}>
                        <p>Status: <strong>{status.is_active ? 'Aktif' : 'Tidak Aktif / Kedaluwarsa'}</strong></p>
                        <p>Tipe saat ini: {status.current_type}</p>
                        <p>Berlaku hingga: {status.expires_at ? new Date(status.expires_at).toLocaleString('id-ID') : '-'}</p>

                        <label style={{ display: 'block', marginTop: 12 }}>
                            Pilih Paket Perpanjangan
                            <select value={packageType} onChange={(e) => setPackageType(e.target.value)} style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}>
                                <option value="daily">Harian</option>
                                <option value="monthly">Bulanan</option>
                                <option value="yearly">Tahunan</option>
                            </select>
                        </label>
                        <button onClick={handleRenew} disabled={loading} style={{ marginTop: 12, padding: 12, background: '#111', color: '#fff', border: 'none', borderRadius: 4 }}>
                            {loading ? 'Memproses...' : 'Perpanjang Sekarang'}
                        </button>
                    </div>
                )}

                {message && <p style={{ marginTop: 16 }}>{message}</p>}
            </main>
        </>
    );
}
