// lib/notify.js
// Helper pengiriman notifikasi lisensi via WhatsApp (Fonnte) dan Email (Brevo).

/**
 * Generate license key acak, contoh: CGP-A1B2-C3D4-E5F6
 */
export function generateLicenseKey(appPrefix = 'LIC') {
    const rand = () =>
        Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${appPrefix}-${rand()}-${rand()}-${rand()}`;
}

/**
 * Kirim WhatsApp via Fonnte.
 * Butuh env FONNTE_TOKEN.
 */
export async function sendWhatsApp(target, message) {
    if (!process.env.FONNTE_TOKEN) {
        console.warn('FONNTE_TOKEN tidak diset, lewati pengiriman WA');
        return { skipped: true };
    }
    const res = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
            Authorization: process.env.FONNTE_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ target, message }),
    });
    return res.json();
}

/**
 * Kirim Email via Brevo (dahulu Sendinblue).
 * Butuh env BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME.
 */
export async function sendEmail({ to, subject, htmlContent }) {
    if (!process.env.BREVO_API_KEY) {
        console.warn('BREVO_API_KEY tidak diset, lewati pengiriman email');
        return { skipped: true };
    }
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            sender: {
                email: process.env.BREVO_SENDER_EMAIL,
                name: process.env.BREVO_SENDER_NAME || 'License System',
            },
            to: [{ email: to }],
            subject,
            htmlContent,
        }),
    });
    return res.json();
}

/**
 * Template pesan pengiriman lisensi baru.
 */
export function buildLicenseMessage({ appName, licenseKey, type, expiresAt }) {
    const expiryText = expiresAt
        ? new Date(expiresAt).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric',
          })
        : 'Tidak ada (manual/perlu aktivasi)';

    const text =
        `Terima kasih telah membeli ${appName}!\n\n` +
        `Kode Lisensi Anda:\n${licenseKey}\n\n` +
        `Tipe: ${type}\n` +
        `Berlaku hingga: ${expiryText}\n\n` +
        `Cara aktivasi:\n` +
        `1. Buka aplikasi ${appName}\n` +
        `2. Masukkan kode lisensi di atas pada dialog aktivasi\n` +
        `3. Aplikasi akan otomatis terkunci ke perangkat ini\n\n` +
        `Simpan kode ini baik-baik. Jika butuh bantuan, balas pesan ini.`;

    const html = text.replace(/\n/g, '<br/>');
    return { text, html };
}
