// pages/thankyou.js

import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ThankYou() {
    const router = useRouter();
    const { license_key, type } = router.query;

    return (
        <>
            <Head>
                <title>Terima Kasih Atas Pembelian Anda</title>
            </Head>
            <div style={containerStyle}>
                <main style={cardStyle}>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <div style={successIconStyle}>✓</div>
                        <h1 style={titleStyle}>
                            {type === 'renew' ? 'Perpanjangan Berhasil!' : 'Terima Kasih!'}
                        </h1>
                        <p style={subtitleStyle}>
                            Transaksi Anda telah selesai diproses dengan sukses.
                        </p>
                    </div>

                    <div style={boxStyle}>
                        <p style={labelStyle}>KODE LISENSI ANDA:</p>
                        <div style={keyContainerStyle}>
                            {license_key || "Memeriksa..."}
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 8, margin: 0 }}>
                            *Salin kode di atas. Kode lisensi ini juga sudah dikirim ke WhatsApp dan Email Anda.
                        </p>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: 14, color: '#fff' }}>Panduan Langkah Selanjutnya:</h3>
                        <ol style={listStyle}>
                            <li>Unduh berkas instalasi aplikasi utama Anda melalui tautan di bawah ini.</li>
                            <li>Buka aplikasi **SVG Motion Studio v2**.</li>
                            <li>Masukkan kode lisensi di atas pada dialog aktivasi yang muncul.</li>
                            <li>Selesai! Aplikasi Anda siap digunakan secara penuh.</li>
                        </ol>
                    </div>

                    {/* Tautan unduhan produk */}
                    <a href="https://motion-graphic-sigma.vercel.app/download" target="_blank" rel="noreferrer" style={downloadButtonStyle}>
                        Unduh SVG Motion Studio v2 📥
                    </a>

                    <div style={{ marginTop: 24, textAlign: 'center', borderTop: '1px solid #1f2937', paddingTop: 16 }}>
                        <a href="/" style={linkStyle}>Kembali ke Beranda</a>
                    </div>
                </main>
            </div>
        </>
    );
}

// CSS Inline
const containerStyle = { background: '#0e1013', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' };
const cardStyle = { background: '#16191f', border: '1px solid #1f2937', padding: '32px 24px', borderRadius: 16, width: '100%', maxWidth: 480, boxSizing: 'border-box' };
const successIconStyle = { width: 50, height: 50, background: '#10b981', color: '#fff', borderRadius: '50%', fontSize: 24, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' };
const titleStyle = { margin: 0, fontSize: 22, fontWeight: 'bold', color: '#fff' };
const subtitleStyle = { margin: '8px 0 0 0', color: '#10b981', fontSize: 13, fontWeight: '600' };
const boxStyle = { background: '#111317', border: '1px solid #1f2937', borderRadius: 12, padding: 16, textAlign: 'center', marginTop: 20 };
const labelStyle = { margin: '0 0 8px 0', fontSize: 11, fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.05em' };
const keyContainerStyle = { background: '#1e293b', border: '1px dashed #3b82f6', color: '#3b82f6', padding: '10px', borderRadius: 6, fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' };
const listStyle = { color: '#cbd5e1', fontSize: 13, paddingLeft: 20, margin: 0, lineHeight: '1.6' };
const downloadButtonStyle = { display: 'block', width: '100%', padding: 12, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 13, textAlign: 'center', textDecoration: 'none', marginTop: 20, boxSizing: 'border-box' };
const linkStyle = { color: '#94a3b8', textDecoration: 'none', fontSize: 12 };