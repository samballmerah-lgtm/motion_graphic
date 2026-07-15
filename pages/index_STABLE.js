// pages/index.js

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const APP_ID = 'certgenpro';

/* =========================================================================
   DESIGN TOKENS — tema sama dengan file referensi (dark, accent hijau)
   ========================================================================= */
const COLOR = {
    bg: '#0e1013',
    bgCard: '#16191f',
    bgElevated: '#111317',
    border: '#1f2937',
    borderAccent: '#10b981',
    accent: '#10b981',
    accentDark: '#0ea975',
    primary: '#3b82f6',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textFaint: '#64748b',
    warn: '#f59e0b',
    danger: '#ef4444',
};
const FONT_HEAD = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";
const MAXW = 1180;

/* =========================================================================
   DATA — mudah diganti nanti
   ========================================================================= */

const FEATURES = [
    {
        icon: '🎬',
        title: 'Auto-Generate Script SVG dari Video Referensi',
        desc: 'Tinggal masukkan video referensi, aplikasi otomatis membuatkan script SVG-nya — sehingga kamu tidak perlu bisa After Effects atau ilmu animasi sama sekali.',
    },
    {
        icon: '⚡',
        title: 'Generate Batch 50++ dalam ±2 Jam',
        desc: 'Render banyak motion graphic sekaligus dalam satu proses batch, sehingga produksi harian kamu jauh lebih cepat (tergantung spek laptop/PC).',
    },
    {
        icon: '🎲',
        title: '5 Variasi Animasi Otomatis per Referensi',
        desc: 'Dari satu video referensi, dapat 5 variasi animasi berbeda — sehingga portofolio microstock kamu lebih variatif tanpa kerja ulang dari nol.',
    },
    {
        icon: '📤',
        title: 'Output 4K / 2K / HD, MOV & MP4',
        desc: 'Pilih resolusi dan format sesuai kebutuhan platform, sehingga hasil render langsung siap diunggah ke Adobe Stock maupun Shutterstock.',
    },
    {
        icon: '🟩',
        title: 'Transparan, Solid, atau No Background',
        desc: 'Dukung alpha channel, warna solid ala greenscreen, atau mengikuti desain SVG asli — sehingga fleksibel untuk berbagai kebutuhan compositing.',
    },
    {
        icon: '🏷️',
        title: 'Auto Metadata CSV: Title & ATM Tag',
        desc: 'Masukkan keyword hasil riset, sistem otomatis menyusun title dan tag sesuai kaidah metadata microstock — sehingga tinggal upload, tanpa isi manual satu-satu.',
    },
];

const GOOD_FOR = [
    'Animasi 2D sederhana & clean',
    'Background color gradient / solid',
    'Motion graphic looping untuk B-roll',
    'Produksi cepat dalam jumlah besar',
];
const NOT_FOR = [
    'Animasi yang sangat rumit / kompleks',
    'Objek atau environment 3D',
    'Gaya realistis / photoreal',
];

const BONUSES = [
    { icon: '📊', title: 'Spreadsheet Keyword Motion Graphic', desc: 'Kumpulan keyword minim pesaing yang siap dipakai langsung untuk riset judul & tag.' },
    { icon: '🔍', title: 'Panduan Riset Keyword Adobe Stock', desc: 'Cara step-by-step mencari celah keyword yang masih jarang pesaingnya.' },
    { icon: '🔄', title: 'Free Update Aplikasi', desc: 'Semua pembaruan fitur & perbaikan aplikasi ke depannya, tanpa biaya tambahan.' },
    { icon: '💬', title: 'Forum WhatsApp Member', desc: 'Ruang diskusi khusus member untuk tanya-jawab, tips, dan update terbaru.' },
];

const SCREENSHOTS = [
    { label: 'Dashboard Generate Batch', caption: 'Atur banyak project sekaligus dan pantau progres render secara real-time.' },
    { label: 'Auto Script SVG dari Video', caption: 'Upload video referensi, sistem otomatis membuatkan script SVG-nya.' },
    { label: 'Pilihan Output & Background', caption: '4K/2K/HD, MOV/MP4, alpha channel, solid color, atau no background.' },
    { label: 'Metadata Title & ATM Tag', caption: 'Masukkan keyword riset, title dan tag tersusun otomatis siap upload.' },
];

const TESTIMONIALS = [
    { name: 'Dimas Prasetyo', city: 'Yogyakarta', initials: 'DP', quote: 'Dulu upload motion graphic paling banter 5-10 per minggu karena harus buka After Effects. Sekarang bisa generate puluhan dalam semalam.' },
    { name: 'Rina Wulandari', city: 'Bandung', initials: 'RW', quote: 'Yang paling kepake buat saya itu auto metadata-nya. Nggak perlu mikirin title satu-satu lagi, langsung upload ke Adobe Stock.' },
    { name: 'Fajar Nugroho', city: 'Surabaya', initials: 'FN', quote: 'Saya bukan orang yang jago desain atau animasi, tapi tetap bisa produksi motion graphic yang rapi buat portofolio microstock.' },
    { name: 'Sari Indah Lestari', city: 'Medan', initials: 'SI', quote: 'Fitur batch generate-nya beneran hemat waktu. Sambil ditinggal kerja lain, render jalan sendiri di background.' },
];

const FAQS = [
    { q: 'Apakah saya perlu bisa After Effects atau animasi untuk pakai aplikasi ini?', a: 'Tidak perlu. Kamu cukup menyiapkan video referensi, lalu aplikasi akan otomatis membuat script SVG dan variasi animasinya untukmu.' },
    { q: 'Jenis animasi seperti apa yang cocok dibuat dengan aplikasi ini?', a: 'Paling cocok untuk animasi 2D sederhana dengan background color gradient atau solid. Aplikasi ini tidak dirancang untuk animasi yang sangat rumit, objek 3D, atau gaya realistis.' },
    { q: 'Format dan resolusi apa saja yang didukung?', a: 'Kamu bisa memilih output 4K, 2K, atau HD dalam format MOV maupun MP4, dengan pilihan background transparan (alpha channel), solid color, atau mengikuti desain SVG aslinya.' },
    { q: 'Berapa lama waktu untuk generate banyak motion graphic?', a: 'Dengan fitur Generate Batch, kamu bisa memproses 50 lebih motion graphic dalam waktu sekitar 2 jam, tergantung spesifikasi laptop atau PC yang digunakan.' },
    { q: 'Apakah lisensi ini termasuk update aplikasi ke depannya?', a: 'Ya, member mendapat free update aplikasi tanpa biaya tambahan selama masa lisensi aktif.' },
    { q: 'Kalau saya butuh bantuan, ke mana harus bertanya?', a: 'Setiap member mendapat akses ke Forum WhatsApp khusus untuk diskusi, tanya-jawab seputar aplikasi, dan berbagi tips sesama microstocker.' },
];

/* =========================================================================
   HOOKS
   ========================================================================= */

function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);
    return [ref, visible];
}

function useNavScroll() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);
    return scrolled;
}

// Social proof: mencoba ambil data pembelian terbaru dari API sendiri.
// Ganti SOCIAL_PROOF_ENDPOINT sesuai endpoint yang sudah kamu buat.
// Kalau fetch gagal (endpoint belum siap), fallback ke data dummy di bawah.
const SOCIAL_PROOF_ENDPOINT = '/api/social-proof/recent';
const SOCIAL_PROOF_FALLBACK = [
    { name: 'Agus', city: 'Semarang', status: 'Pembayaran Terkonfirmasi' },
    { name: 'Wulan', city: 'Jakarta', status: 'Pembayaran Terkonfirmasi' },
    { name: 'Yoga', city: 'Malang', status: 'Pembayaran Terkonfirmasi' },
    { name: 'Citra', city: 'Denpasar', status: 'Pembayaran Terkonfirmasi' },
];

function useSocialProof() {
    const [items, setItems] = useState(SOCIAL_PROOF_FALLBACK);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        let cancelled = false;
        fetch(SOCIAL_PROOF_ENDPOINT)
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => {
                if (!cancelled && Array.isArray(data) && data.length > 0) {
                    setItems(data);
                }
            })
            .catch(() => {
                // Endpoint belum tersedia / gagal — tetap pakai fallback dummy.
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % items.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [items.length]);

    return items[index];
}

/* =========================================================================
   MAIN PAGE
   ========================================================================= */

export default function Home() {
    const [form, setForm] = useState({ email: '', whatsapp: '', package_type: 'yearly', coupon_code: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [openFaq, setOpenFaq] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navScrolled = useNavScroll();

    // ================= LOGIC PEMBELIAN — TIDAK DIUBAH =================
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
    // ================= END LOGIC PEMBELIAN =================

    const scrollTo = useCallback((id) => {
        setMobileOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    return (
        <>
            <Head>
                <title>SVG Motion Studio v2 — Motion Graphic Microstock Tanpa After Effects</title>
                <meta
                    name="description"
                    content="Generate motion graphic microstock otomatis dari video referensi, 5 variasi animasi, batch 50++, lengkap dengan metadata CSV siap upload. Tanpa skill After Effects."
                />
                <meta name="keywords" content="motion graphic microstock, svg animation generator, adobe stock motion graphic, aplikasi motion graphic, batch render animasi, metadata csv microstock" />
                <meta property="og:title" content="SVG Motion Studio v2 — Motion Graphic Microstock Tanpa After Effects" />
                <meta property="og:description" content="Generate motion graphic microstock otomatis dari video referensi, lengkap dengan metadata CSV siap upload." />
                <meta property="og:type" content="website" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'SoftwareApplication',
                            name: 'SVG Motion Studio v2',
                            description:
                                'Aplikasi desktop untuk membuat motion graphic microstock otomatis dari video referensi, lengkap dengan metadata CSV.',
                            applicationCategory: 'MultimediaApplication',
                            offers: { '@type': 'Offer', price: '149000', priceCurrency: 'IDR' },
                        }),
                    }}
                />
            </Head>
            <Script
                src={
                    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
                        ? 'https://app.midtrans.com/snap/snap.js'
                        : 'https://app.sandbox.midtrans.com/snap/snap.js'
                }
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            />

            <div style={{ background: COLOR.bg, color: COLOR.text, fontFamily: FONT_BODY, minHeight: '100vh' }}>
                <Navbar scrolled={navScrolled} scrollTo={scrollTo} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
                <main>
                    <HeroSection scrollTo={scrollTo} />
                    <SocialProofBar />
                    <ProblemSolutionSection />
                    <FeaturesSection />
                    <GoodForSection />
                    <DemoSection />
                    <TestimonialsSection />
                    <BonusSection />
                    <PurchaseSection
                        form={form}
                        setForm={setForm}
                        loading={loading}
                        message={message}
                        handleSubmit={handleSubmit}
                    />
                    <FAQSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
                    <FinalCTASection scrollTo={scrollTo} />
                </main>
                <Footer />
            </div>
        </>
    );
}

/* =========================================================================
   NAVBAR
   ========================================================================= */

function Navbar({ scrolled, scrollTo, mobileOpen, setMobileOpen }) {
    const navItems = [
        { id: 'fitur', label: 'Fitur' },
        { id: 'demo', label: 'Demo' },
        { id: 'testimoni', label: 'Testimoni' },
        { id: 'beli', label: 'Harga' },
        { id: 'faq', label: 'FAQ' },
    ];
    return (
        <header
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                background: scrolled ? 'rgba(14,16,19,0.9)' : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                borderBottom: scrolled ? `1px solid ${COLOR.border}` : '1px solid transparent',
                transition: 'all 0.3s ease',
            }}
        >
            <div style={{ maxWidth: MAXW, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Ⓜ️</span> SVG Motion Studio
                </div>
                <nav style={{ display: 'none', gap: 28, alignItems: 'center' }} className="desktop-nav">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            onClick={() => scrollTo(item.id)}
                            style={{ color: COLOR.textMuted, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
                <button
                    onClick={() => scrollTo('beli')}
                    style={{
                        background: COLOR.accent, color: '#fff', border: 'none', padding: '9px 18px',
                        borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: FONT_BODY,
                    }}
                >
                    Miliki Lisensi
                </button>
            </div>
            <style jsx>{`
                @media (min-width: 860px) {
                    .desktop-nav { display: flex !important; }
                }
            `}</style>
        </header>
    );
}

/* =========================================================================
   HERO
   ========================================================================= */

function HeroSection({ scrollTo }) {
    return (
        <section style={{ padding: '140px 20px 80px', background: `radial-gradient(ellipse at top, rgba(16,185,129,0.08), transparent 60%)` }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto', textAlign: 'center' }}>
                <span
                    style={{
                        background: '#1e293b', color: COLOR.primary, fontSize: 11, fontWeight: 700,
                        padding: '5px 12px', borderRadius: 20, letterSpacing: '0.05em', display: 'inline-block', marginBottom: 20,
                    }}
                >
                    RILIS TERBARU v2.5.7
                </span>
                <h1 style={{ fontFamily: FONT_HEAD, fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.15, margin: '0 auto 20px', maxWidth: 820 }}>
                    Bikin Motion Graphic Microstock <span style={{ color: COLOR.accent }}>Tanpa Skill After Effects</span>
                </h1>
                <p style={{ color: COLOR.textMuted, fontSize: 16, lineHeight: 1.7, maxWidth: 620, margin: '0 auto 32px' }}>
                    Cukup masukkan video referensi, SVG Motion Studio otomatis membuatkan script SVG, 5 variasi animasi,
                    dan metadata CSV — langsung siap diunggah ke Adobe Stock & Shutterstock.
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => scrollTo('beli')}
                        style={{
                            background: COLOR.accent, color: '#fff', border: 'none', padding: '15px 30px',
                            borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: FONT_BODY,
                            boxShadow: '0 8px 25px rgba(16,185,129,0.3)',
                        }}
                    >
                        Miliki Lisensi Sekarang ⚡
                    </button>
                    <a onClick={() => scrollTo('demo')} style={{ color: COLOR.accent, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                        Lihat demo →
                    </a>
                </div>
                <p style={{ marginTop: 18, fontSize: 13, color: COLOR.textFaint }}>
                    ✓ Generate 50++ motion graphic dalam ±2 jam &nbsp;·&nbsp; ✓ Effort less &nbsp;·&nbsp; ✓ Free update aplikasi
                </p>
            </div>
        </section>
    );
}

/* =========================================================================
   SOCIAL PROOF BAR
   ========================================================================= */

function SocialProofBar() {
    const latest = useSocialProof();
    return (
        <div style={{ borderTop: `1px solid ${COLOR.border}`, borderBottom: `1px solid ${COLOR.border}`, background: COLOR.bgElevated }}>
            <div
                style={{
                    maxWidth: MAXW, margin: '0 auto', padding: '14px 20px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 13, color: COLOR.textMuted, flexWrap: 'wrap', textAlign: 'center',
                }}
            >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLOR.accent, display: 'inline-block' }} />
                <span>
                    <strong style={{ color: COLOR.text }}>{latest.name}, {latest.city}</strong> baru saja membeli SVG Motion Studio — {latest.status}
                </span>
            </div>
        </div>
    );
}

/* =========================================================================
   PROBLEM -> SOLUTION
   ========================================================================= */

function ProblemSolutionSection() {
    const [ref, visible] = useReveal();
    return (
        <section ref={ref} style={fadeStyle(visible, { padding: '80px 20px' })}>
            <div style={{ maxWidth: MAXW, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: 40 }} className="two-col">
                <div>
                    <h2 style={h2Style}>Microstocker butuh produksi cepat, tapi jalannya lambat</h2>
                    <p style={{ color: COLOR.textMuted, lineHeight: 1.8, marginBottom: 16 }}>
                        Untuk konsisten upload ke Adobe Stock atau Shutterstock, kamu butuh motion graphic dalam jumlah
                        banyak setiap minggu. Masalahnya, bikin animasi lewat After Effects makan waktu, butuh skill
                        khusus, dan menyusun metadata CSV satu-satu itu melelahkan.
                    </p>
                    <p style={{ color: COLOR.text, lineHeight: 1.8, fontWeight: 600 }}>
                        SVG Motion Studio v2 mengotomatiskan seluruh proses itu — dari video referensi jadi motion
                        graphic siap upload, lengkap dengan title dan tag, tanpa perlu buka After Effects sama sekali.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <MiniStat value="5x" label="Variasi animasi otomatis" />
                    <MiniStat value="50++" label="Motion graphic per ±2 jam" />
                    <MiniStat value="4K" label="Resolusi output tertinggi" />
                    <MiniStat value="0" label="Skill After Effects dibutuhkan" />
                </div>
            </div>
            <style jsx>{`
                @media (min-width: 860px) {
                    .two-col { grid-template-columns: 1.1fr 0.9fr !important; align-items: center; }
                }
            `}</style>
        </section>
    );
}

function MiniStat({ value, label }) {
    return (
        <div style={{ background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 26, fontWeight: 800, color: COLOR.accent }}>{value}</div>
            <div style={{ fontSize: 12, color: COLOR.textMuted, marginTop: 4 }}>{label}</div>
        </div>
    );
}

/* =========================================================================
   FEATURES
   ========================================================================= */

function FeaturesSection() {
    const [ref, visible] = useReveal();
    return (
        <section id="fitur" ref={ref} style={fadeStyle(visible, { padding: '80px 20px', background: COLOR.bgElevated })}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <h2 style={h2Style}>Semua yang kamu butuhkan untuk produksi microstock</h2>
                    <p style={{ color: COLOR.textMuted, maxWidth: 560, margin: '0 auto' }}>
                        Dirancang khusus untuk microstocker yang ingin produksi cepat tanpa kerumitan software animasi.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                    {FEATURES.map((f) => (
                        <FeatureCard key={f.title} {...f} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon, title, desc }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: COLOR.bgCard, border: `1px solid ${hovered ? COLOR.accent : COLOR.border}`,
                borderRadius: 14, padding: 26, transition: 'all 0.25s ease',
                transform: hovered ? 'translateY(-4px)' : 'none',
            }}
        >
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>
                {icon}
            </div>
            <h3 style={{ fontFamily: FONT_HEAD, fontSize: 15.5, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
            <p style={{ color: COLOR.textMuted, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{desc}</p>
        </div>
    );
}

/* =========================================================================
   GOOD FOR / LIMITATION
   ========================================================================= */

function GoodForSection() {
    const [ref, visible] = useReveal();
    return (
        <section ref={ref} style={fadeStyle(visible, { padding: '80px 20px' })}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h2 style={h2Style}>Supaya ekspektasi kamu tepat sejak awal</h2>
                    <p style={{ color: COLOR.textMuted }}>Kami transparan soal apa yang bisa dan tidak bisa dilakukan aplikasi ini.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="two-col-equal">
                    <div style={{ background: 'rgba(16,185,129,0.06)', border: `1px solid ${COLOR.borderAccent}`, borderRadius: 14, padding: 24 }}>
                        <h3 style={{ color: COLOR.accent, fontFamily: FONT_HEAD, fontSize: 15, marginBottom: 14 }}>✓ Bagus Untuk</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {GOOD_FOR.map((item) => (
                                <li key={item} style={{ fontSize: 13.5, color: COLOR.text, display: 'flex', gap: 8 }}>
                                    <span style={{ color: COLOR.accent }}>✓</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ background: 'rgba(239,68,68,0.05)', border: `1px solid #7f1d1d`, borderRadius: 14, padding: 24 }}>
                        <h3 style={{ color: '#f87171', fontFamily: FONT_HEAD, fontSize: 15, marginBottom: 14 }}>✕ Bukan Untuk</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {NOT_FOR.map((item) => (
                                <li key={item} style={{ fontSize: 13.5, color: COLOR.textMuted, display: 'flex', gap: 8 }}>
                                    <span style={{ color: '#f87171' }}>✕</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <style jsx>{`
                    @media (min-width: 700px) {
                        .two-col-equal { grid-template-columns: 1fr 1fr !important; }
                    }
                `}</style>
            </div>
        </section>
    );
}

/* =========================================================================
   DEMO — CAROUSEL SCREENSHOT + VIDEO EMBED (dummy)
   ========================================================================= */

function DemoSection() {
    const [ref, visible] = useReveal();
    const [slide, setSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setSlide((s) => (s + 1) % SCREENSHOTS.length), 4500);
        return () => clearInterval(timer);
    }, []);

    const current = SCREENSHOTS[slide];

    return (
        <section id="demo" ref={ref} style={fadeStyle(visible, { padding: '80px 20px', background: COLOR.bgElevated })}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h2 style={h2Style}>Lihat cara kerjanya</h2>
                    <p style={{ color: COLOR.textMuted }}>Tampilan aplikasi (placeholder) — akan diganti dengan screenshot asli.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="demo-grid">
                    {/* Carousel screenshot */}
                    <div>
                        <div
                            style={{
                                background: `linear-gradient(135deg, ${COLOR.bgCard}, #0b2a22)`, border: `1px solid ${COLOR.border}`,
                                borderRadius: 14, aspectRatio: '16/10', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden',
                            }}
                            role="img"
                            aria-label={current.label}
                        >
                            <span style={{ fontSize: 34 }}>🖥️</span>
                            <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15 }}>{current.label}</span>
                            <span style={{ fontSize: 11, color: COLOR.textFaint }}>Screenshot placeholder</span>
                        </div>
                        <p style={{ textAlign: 'center', color: COLOR.textMuted, fontSize: 13, marginTop: 12, minHeight: 36 }}>{current.caption}</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
                            {SCREENSHOTS.map((s, i) => (
                                <button
                                    key={s.label}
                                    onClick={() => setSlide(i)}
                                    aria-label={`Lihat ${s.label}`}
                                    style={{
                                        width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                        background: i === slide ? COLOR.accent : COLOR.border,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Video embed placeholder */}
                    <div>
                        <div
                            style={{
                                background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 14,
                                aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexDirection: 'column', gap: 10,
                            }}
                        >
                            {/* TODO: ganti div ini dengan <iframe> video (YouTube/Vimeo) saat link tersedia */}
                            <div
                                style={{
                                    width: 56, height: 56, borderRadius: '50%', background: COLOR.accent,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff',
                                }}
                                aria-label="Putar video demo"
                            >
                                ▶
                            </div>
                            <span style={{ fontSize: 13, color: COLOR.textMuted }}>Video Demo Aplikasi (segera hadir)</span>
                        </div>
                        <p style={{ textAlign: 'center', color: COLOR.textMuted, fontSize: 13, marginTop: 12 }}>
                            Lihat proses generate motion graphic dari awal sampai siap upload.
                        </p>
                    </div>
                </div>
                <style jsx>{`
                    @media (min-width: 860px) {
                        .demo-grid { grid-template-columns: 1fr 1fr !important; align-items: start; }
                    }
                `}</style>
            </div>
        </section>
    );
}

/* =========================================================================
   TESTIMONIALS
   ========================================================================= */

function Stars() {
    return (
        <div style={{ color: '#fbbf24', fontSize: 14, letterSpacing: 2, marginBottom: 10 }} aria-label="Rating 5 dari 5 bintang">
            ★★★★★
        </div>
    );
}

function TestimonialsSection() {
    const [ref, visible] = useReveal();
    return (
        <section id="testimoni" ref={ref} style={fadeStyle(visible, { padding: '80px 20px' })}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 44 }}>
                    <h2 style={h2Style}>Apa kata member kami</h2>
                    <p style={{ color: COLOR.textMuted }}>Testimoni dummy — siap diganti dengan testimoni asli.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                    {TESTIMONIALS.map((t) => (
                        <div key={t.name} style={{ background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 14, padding: 22 }}>
                            <Stars />
                            <p style={{ fontSize: 13.5, color: COLOR.text, lineHeight: 1.7, marginBottom: 18, fontStyle: 'italic' }}>
                                &ldquo;{t.quote}&rdquo;
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div
                                    style={{
                                        width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg, ${COLOR.primary}, ${COLOR.accent})`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0,
                                    }}
                                    aria-label={`Foto ${t.name}`}
                                >
                                    {t.initials}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</div>
                                    <div style={{ fontSize: 11.5, color: COLOR.textFaint }}>{t.city}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   BONUS
   ========================================================================= */

function BonusSection() {
    const [ref, visible] = useReveal();
    return (
        <section ref={ref} style={fadeStyle(visible, { padding: '80px 20px', background: COLOR.bgElevated })}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h2 style={h2Style}>Bonus khusus buat kamu</h2>
                    <p style={{ color: COLOR.textMuted }}>Didapat langsung begitu lisensi aktif.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18 }}>
                    {BONUSES.map((b) => (
                        <div key={b.title} style={{ background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
                            <div style={{ fontSize: 26, marginBottom: 10 }}>{b.icon}</div>
                            <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13.5, marginBottom: 6 }}>{b.title}</div>
                            <div style={{ fontSize: 12.5, color: COLOR.textMuted, lineHeight: 1.6 }}>{b.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   PURCHASE SECTION — FORM & LOGIC PEMBELIAN ASLI (tidak diubah)
   ========================================================================= */

function PurchaseSection({ form, setForm, loading, message, handleSubmit }) {
    const [ref, visible] = useReveal();
    return (
        <section id="beli" ref={ref} style={fadeStyle(visible, { padding: '80px 20px' })}>
            <div style={{ maxWidth: 460, margin: '0 auto' }}>
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
                        <p style={{ textAlign: 'center', fontSize: 11.5, color: '#64748b', margin: 0 }}>
                            ✓ Free update aplikasi &nbsp;·&nbsp; ✓ Akses Forum WhatsApp &nbsp;·&nbsp; ✓ Bonus spreadsheet keyword
                        </p>
                    </form>

                    {message && <p style={messageStyle}>{message}</p>}
                </main>
            </div>
        </section>
    );
}

/* =========================================================================
   FAQ
   ========================================================================= */

function FAQSection({ openFaq, setOpenFaq }) {
    return (
        <section id="faq" style={{ padding: '80px 20px', background: COLOR.bgElevated }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
                <h2 style={{ ...h2Style, textAlign: 'center', marginBottom: 36 }}>Pertanyaan yang sering ditanya</h2>
                {FAQS.map((faq, i) => (
                    <div key={faq.q} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                        <button
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            style={{
                                width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '20px 0',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, cursor: 'pointer',
                                fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14, color: COLOR.text,
                            }}
                        >
                            {faq.q}
                            <span style={{ color: COLOR.accent, fontSize: 20, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }}>
                                +
                            </span>
                        </button>
                        <div style={{ maxHeight: openFaq === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                            <p style={{ paddingBottom: 18, color: COLOR.textMuted, lineHeight: 1.7, fontSize: 13.5, margin: 0 }}>{faq.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* =========================================================================
   FINAL CTA
   ========================================================================= */

function FinalCTASection({ scrollTo }) {
    return (
        <section style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div style={{ maxWidth: 620, margin: '0 auto' }}>
                <h2 style={h2Style}>Mulai produksi motion graphic microstock hari ini</h2>
                <p style={{ color: COLOR.textMuted, marginBottom: 28 }}>
                    Ratusan motion graphic siap upload, tanpa perlu jago After Effects.
                </p>
                <button
                    onClick={() => scrollTo('beli')}
                    style={{
                        background: COLOR.accent, color: '#fff', border: 'none', padding: '16px 34px', borderRadius: 10,
                        fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: FONT_BODY, boxShadow: '0 8px 25px rgba(16,185,129,0.3)',
                    }}
                >
                    Miliki Lisensi Sekarang ⚡
                </button>
                <p style={{ marginTop: 14, fontSize: 12, color: COLOR.textFaint }}>
                    ✓ Free update aplikasi &nbsp;·&nbsp; ✓ Forum WhatsApp member &nbsp;·&nbsp; ✓ Bonus riset keyword
                </p>
            </div>
        </section>
    );
}

/* =========================================================================
   FOOTER
   ========================================================================= */

function Footer() {
    return (
        <footer style={{ borderTop: `1px solid ${COLOR.border}`, padding: '40px 20px' }}>
            <div
                style={{
                    maxWidth: MAXW, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 20,
                    justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, color: COLOR.textFaint,
                }}
            >
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: COLOR.textMuted }}>Ⓜ️ SVG Motion Studio</div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <a href="#" style={{ color: COLOR.textFaint }}>Tentang</a>
                    <a href="#" style={{ color: COLOR.textFaint }}>Kebijakan Privasi</a>
                    <a href="#" style={{ color: COLOR.textFaint }}>Syarat & Ketentuan</a>
                    <a href="#" style={{ color: COLOR.textFaint }}>Kontak</a>
                </div>
                <div>© {new Date().getFullYear()} SVG Motion Studio. Semua hak dilindungi.</div>
            </div>
        </footer>
    );
}

/* =========================================================================
   HELPERS
   ========================================================================= */

const h2Style = { fontFamily: FONT_HEAD, fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, textAlign: 'center', marginBottom: 14, color: COLOR.text };

function fadeStyle(visible, extra) {
    return {
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        ...extra,
    };
}

/* =========================================================================
   STYLE OBJECTS ASLI (form pembelian) — TIDAK DIUBAH
   ========================================================================= */
const cardStyle = { background: '#16191f', border: '1px solid #1f2937', padding: '32px 24px', borderRadius: 16, width: '100%', maxWidth: 460, boxSizing: 'border-box' };
const badgeStyle = { background: '#1e293b', color: '#3b82f6', fontSize: 11, fontWeight: 'bold', padding: '4px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 12 };
const titleStyle = { margin: 0, fontSize: 24, fontWeight: 'bold', color: '#fff' };
const subtitleStyle = { margin: '8px 0 0 0', color: '#94a3b8', fontSize: 13, lineHeight: '1.4' };
const pricingCardStyle = { background: '#111317', border: '1px solid #10b981', borderRadius: 12, padding: 16, marginBottom: 24, marginTop: 12 };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 6 };
const inputStyle = { display: 'block', width: '100%', padding: 10, background: '#111317', border: '1px solid #1f2937', borderRadius: 8, color: '#fff', fontSize: 13, boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: 12, background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 14, transition: '0.2s' };
const messageStyle = { marginTop: 16, padding: 10, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12, color: '#cbd5e1', textAlign: 'center', lineHeight: '1.4' };