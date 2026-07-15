// pages/terms.js

import Head from 'next/head';

const WHATSAPP_NUMBER = '6289627312600';
const WHATSAPP_DISPLAY = '0896-2731-2600';
const WHATSAPP_LINK = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const COLOR = {
    bg: '#0e1013',
    bgCard: '#16191f',
    border: '#1f2937',
    accent: '#10b981',
    primary: '#3b82f6',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textFaint: '#64748b',
};
const FONT_HEAD = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";

const SECTIONS = [
    {
        title: '1. Cara Menggunakan Aplikasi',
        body: [
            'Ekstrak (extract) file ZIP yang telah Anda download, buka folder hasil ekstrak, lalu jalankan file SVG Motion.exe.',
            'Jika belum memiliki lisensi, lakukan pembelian melalui link yang muncul pada popup aktivasi di dalam aplikasi.',
            'Setelah lisensi aktif, aplikasi siap digunakan.',
        ],
    },
    {
        title: '2. Peringatan Windows SmartScreen',
        body: [
            'Saat pertama kali menjalankan aplikasi, Windows SmartScreen mungkin menampilkan peringatan bahwa aplikasi tidak dikenali. Hal ini dapat terjadi karena aplikasi belum menggunakan sertifikat digital (Code Signing Certificate).',
            'Apabila muncul peringatan tersebut: klik "More info", lalu klik "Run anyway". Aplikasi akan berjalan seperti biasa. Langkah ini hanya perlu dilakukan satu kali pada setiap perangkat.',
        ],
    },
    {
        title: '3. Persyaratan Sistem',
        body: [
            'SVG Motion telah diuji dan berjalan dengan baik pada Windows 10 (64-bit) dan Windows 11 (64-bit).',
            'Disarankan RAM 12 GB ke atas (minimal 8 GB) dengan ruang penyimpanan kosong minimal 5 GB.',
            'Tidak wajib menggunakan GPU / kartu grafis khusus — aplikasi tetap dapat berjalan tanpa GPU tambahan.',
            'Saat ini aplikasi hanya mendukung sistem operasi Windows 10 dan Windows 11. Penggunaan pada sistem operasi lain belum didukung dan belum diuji.',
        ],
    },
    {
        title: '4. Lisensi',
        body: [
            'Setiap lisensi hanya berlaku untuk 1 (satu) perangkat.',
            'Lisensi bersifat Personal Use dan tidak dapat dipindahkan, dibagikan, atau digunakan pada lebih dari satu perangkat tanpa izin dari Imagine Studio.',
        ],
    },
    {
        title: '5. Jaminan Uang Kembali (Money Back Guarantee)',
        body: [
            'Imagine Studio memberikan jaminan uang kembali selama 3 (tiga) hari kalender sejak tanggal pembelian.',
            'Pengembalian dana hanya berlaku apabila aplikasi benar-benar tidak dapat dijalankan atau digunakan pada perangkat pengguna, setelah pengguna mengikuti petunjuk instalasi dan memberikan kesempatan kepada tim Imagine Studio untuk melakukan pemeriksaan atau membantu proses penyelesaian masalah.',
        ],
    },
    {
        title: '6. Jaminan Uang Kembali Tidak Berlaku Apabila',
        list: [
            'Masa pengajuan telah melebihi 3 (tiga) hari sejak tanggal pembelian.',
            'Pengguna berubah pikiran setelah melakukan pembelian.',
            'Pengguna tidak menyukai fitur, tampilan, atau cara kerja aplikasi.',
            'Kendala disebabkan oleh perubahan, pembatasan, atau penghentian layanan AI pihak ketiga (misalnya Google AI Studio).',
            'Kendala berasal dari konfigurasi perangkat, antivirus, modifikasi sistem operasi, atau software pihak ketiga yang berada di luar kendali Imagine Studio.',
        ],
        note: 'Keputusan mengenai kelayakan pengembalian dana merupakan hak Imagine Studio berdasarkan hasil pemeriksaan terhadap kendala yang dilaporkan.',
    },
    {
        title: '7. Copyright & Ketentuan Penggunaan',
        body: [
            '© Imagine Studio. All Rights Reserved. Aplikasi SVG Motion dilindungi oleh hak cipta.',
            'Dengan membeli lisensi, Anda hanya memperoleh hak penggunaan secara pribadi (Personal Use License).',
        ],
        list: [
            'Dilarang menyebarluaskan, membagikan, atau mengunggah ulang aplikasi kepada pihak lain.',
            'Dilarang menjual kembali aplikasi dalam bentuk apa pun.',
            'Dilarang memodifikasi, mendistribusikan, atau mengklaim aplikasi sebagai milik sendiri tanpa izin tertulis dari Imagine Studio.',
        ],
        note: 'Pelanggaran terhadap ketentuan di atas dapat mengakibatkan pencabutan lisensi serta tindakan sesuai ketentuan hukum yang berlaku.',
    },
    {
        title: '8. Disclaimer',
        body: [
            'SVG Motion merupakan aplikasi yang berfungsi untuk mengubah script animasi menjadi video. Aplikasi ini memerlukan script hasil generate AI agar dapat digunakan.',
            'Pengguna bebas menggunakan layanan AI yang mampu menghasilkan script dengan format yang kompatibel. Google AI Studio hanyalah salah satu layanan yang direkomendasikan.',
            'Jika layanan Google AI Studio Free Tier diubah, dibatasi, atau dihentikan, pengguna dapat beralih ke layanan berbayar atau menggunakan layanan AI lain yang kompatibel.',
            'Imagine Studio hanya mengembangkan aplikasi SVG Motion dan tidak memiliki hubungan maupun afiliasi dengan Google atau penyedia layanan AI lainnya.',
            'Imagine Studio tidak bertanggung jawab atas perubahan kebijakan, biaya, pembatasan, maupun penghentian layanan AI pihak ketiga.',
            'Seluruh video yang dihasilkan menggunakan aplikasi ini sepenuhnya menjadi tanggung jawab pengguna. Pengguna wajib memastikan bahwa hasil penggunaan aplikasi tidak melanggar hak cipta, merek dagang, ketentuan platform tujuan, maupun peraturan perundang-undangan yang berlaku.',
        ],
    },
];

export default function Terms() {
    return (
        <>
            <Head>
                <title>Syarat &amp; Ketentuan — SVG Motion Studio</title>
                <meta name="description" content="Syarat & ketentuan penggunaan, lisensi, garansi uang kembali, dan disclaimer aplikasi SVG Motion Studio dari Imagine Studio." />
            </Head>
            <div style={{ background: COLOR.bg, color: COLOR.text, fontFamily: FONT_BODY, minHeight: '100vh' }}>
                <header style={{ borderBottom: `1px solid ${COLOR.border}`, padding: '20px' }}>
                    <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>Ⓜ️</span> SVG Motion Studio
                        </div>
                        <a href="/" style={{ color: COLOR.textMuted, fontSize: 13, textDecoration: 'none' }}>
                            ← Kembali ke Beranda
                        </a>
                    </div>
                </header>

                <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 20px 80px' }}>
                    <h1 style={{ fontFamily: FONT_HEAD, fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, marginBottom: 8 }}>
                        Syarat &amp; Ketentuan
                    </h1>
                    <p style={{ color: COLOR.textFaint, fontSize: 13, marginBottom: 40 }}>
                        Berlaku untuk seluruh pengguna aplikasi SVG Motion Studio dari Imagine Studio.
                    </p>

                    {SECTIONS.map((s) => (
                        <section key={s.title} style={{ marginBottom: 32 }}>
                            <h2 style={{ fontFamily: FONT_HEAD, fontSize: 17, fontWeight: 700, marginBottom: 12, color: COLOR.accent }}>
                                {s.title}
                            </h2>
                            {s.body && s.body.map((p, i) => (
                                <p key={i} style={{ color: COLOR.textMuted, fontSize: 14, lineHeight: 1.8, marginBottom: 10 }}>
                                    {p}
                                </p>
                            ))}
                            {s.list && (
                                <ul style={{ margin: '10px 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {s.list.map((item, i) => (
                                        <li key={i} style={{ color: COLOR.textMuted, fontSize: 14, lineHeight: 1.7 }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {s.note && (
                                <p style={{ color: COLOR.textFaint, fontSize: 12.5, lineHeight: 1.7, marginTop: 10, fontStyle: 'italic' }}>
                                    {s.note}
                                </p>
                            )}
                        </section>
                    ))}

                    <section style={{ background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 14, padding: 24, marginTop: 40 }}>
                        <h2 style={{ fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Bantuan</h2>
                        <p style={{ color: COLOR.textMuted, fontSize: 13.5, lineHeight: 1.8, marginBottom: 14 }}>
                            Apabila mengalami kendala saat proses pembelian, aktivasi lisensi, atau penggunaan aplikasi, silakan
                            hubungi Admin melalui WhatsApp.
                        </p>
                        <a
                            href={WHATSAPP_LINK('Halo Admin, saya ingin bertanya tentang Syarat & Ketentuan SVG Motion Studio.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8, background: COLOR.accent, color: '#fff',
                                padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none',
                            }}
                        >
                            💬 Chat Admin ({WHATSAPP_DISPLAY})
                        </a>
                    </section>
                </main>
            </div>
        </>
    );
}
