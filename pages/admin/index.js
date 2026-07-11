// pages/admin/index.js
// Dashboard admin sederhana: login password, lihat/buat lisensi, buat kupon.
// Password disimpan di localStorage browser admin, dikirim sebagai Bearer token.

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [password, setPassword] = useState('');
    const [authed, setAuthed] = useState(false);
    const [tab, setTab] = useState('licenses');
    const [licenses, setLicenses] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const saved = typeof window !== 'undefined' && localStorage.getItem('admin_password');
        if (saved) {
            setPassword(saved);
            setAuthed(true);
        }
    }, []);

    async function login() {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        if (res.ok) {
            localStorage.setItem('admin_password', password);
            setAuthed(true);
        } else {
            setMessage('Password salah');
        }
    }

    function authHeaders() {
        return { Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' };
    }

    async function loadLicenses() {
        const res = await fetch('/api/admin/licenses', { headers: authHeaders() });
        const data = await res.json();
        if (res.ok) setLicenses(data.licenses);
    }

    async function loadCoupons() {
        const res = await fetch('/api/admin/coupons', { headers: authHeaders() });
        const data = await res.json();
        if (res.ok) setCoupons(data.coupons);
    }

    useEffect(() => {
        if (!authed) return;
        if (tab === 'licenses') loadLicenses();
        if (tab === 'coupons') loadCoupons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authed, tab]);

    async function createManualLicense(e) {
        e.preventDefault();
        const f = e.target;
        const body = {
            app_id: f.app_id.value,
            email: f.email.value,
            whatsapp: f.whatsapp.value,
            type: f.type.value,
        };
        const res = await fetch('/api/admin/licenses', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
        const data = await res.json();
        setMessage(res.ok ? `Lisensi dibuat: ${data.license.license_key}` : `Gagal: ${data.error}`);
        if (res.ok) loadLicenses();
    }

    async function createCoupon(e) {
        e.preventDefault();
        const f = e.target;
        const body = {
            app_id: f.app_id.value,
            code: f.code.value,
            discount_type: f.discount_type.value,
            discount_value: Number(f.discount_value.value || 0),
            trial_days: Number(f.trial_days.value || 0),
            max_uses: Number(f.max_uses.value || 1),
            expires_at: f.expires_at.value || null,
        };
        const res = await fetch('/api/admin/coupons', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
        const data = await res.json();
        setMessage(res.ok ? `Kupon dibuat: ${data.coupon.code}` : `Gagal: ${data.error}`);
        if (res.ok) loadCoupons();
    }

    async function revokeLicense(id) {
        if (!confirm('Cabut lisensi ini?')) return;
        const res = await fetch('/api/admin/licenses', { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ id, status: 'revoked' }) });
        if (res.ok) loadLicenses();
    }

    if (!authed) {
        return (
            <main style={{ maxWidth: 320, margin: '80px auto', fontFamily: 'sans-serif' }}>
                <h2>Admin Login</h2>
                <input type="password" placeholder="Password admin" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 8 }} />
                <button onClick={login} style={{ marginTop: 12, padding: 8, width: '100%' }}>Masuk</button>
                {message && <p>{message}</p>}
            </main>
        );
    }

    return (
        <main style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'sans-serif', padding: 16 }}>
            <h1>Admin Dashboard</h1>
            <div style={{ marginBottom: 16 }}>
                <button onClick={() => setTab('licenses')} style={{ marginRight: 8, fontWeight: tab === 'licenses' ? 'bold' : 'normal' }}>Lisensi</button>
                <button onClick={() => setTab('coupons')} style={{ fontWeight: tab === 'coupons' ? 'bold' : 'normal' }}>Kupon</button>
            </div>

            {message && <p style={{ color: '#333' }}>{message}</p>}

            {tab === 'licenses' && (
                <>
                    <h3>Buat Lisensi Manual</h3>
                    <form onSubmit={createManualLicense} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                        <input name="app_id" placeholder="app_id (mis. certgenpro)" required />
                        <input name="email" placeholder="email" type="email" required />
                        <input name="whatsapp" placeholder="whatsapp (62...)" />
                        <select name="type">
                            <option value="daily">Harian</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                            <option value="manual">Manual (tanpa expiry)</option>
                        </select>
                        <button type="submit">Buat</button>
                    </form>

                    <h3>Daftar Lisensi</h3>
                    <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
                        <thead>
                            <tr><th>Key</th><th>App</th><th>Email</th><th>Type</th><th>Status</th><th>Expires</th><th>HWID</th><th>Aksi</th></tr>
                        </thead>
                        <tbody>
                            {licenses.map((l) => (
                                <tr key={l.id}>
                                    <td>{l.license_key}</td>
                                    <td>{l.app_id}</td>
                                    <td>{l.email}</td>
                                    <td>{l.type}</td>
                                    <td>{l.status}</td>
                                    <td>{l.expires_at ? new Date(l.expires_at).toLocaleDateString('id-ID') : '-'}</td>
                                    <td>{l.hwid ? l.hwid.slice(0, 8) + '...' : '-'}</td>
                                    <td><button onClick={() => revokeLicense(l.id)}>Cabut</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {tab === 'coupons' && (
                <>
                    <h3>Buat Kupon</h3>
                    <form onSubmit={createCoupon} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                        <input name="app_id" placeholder="app_id" required />
                        <input name="code" placeholder="KODE" required />
                        <select name="discount_type">
                            <option value="percentage">Persentase</option>
                            <option value="fixed">Nominal Tetap</option>
                            <option value="free_trial">Free Trial</option>
                        </select>
                        <input name="discount_value" placeholder="nilai diskon" type="number" />
                        <input name="trial_days" placeholder="hari trial" type="number" />
                        <input name="max_uses" placeholder="maks pemakaian" type="number" defaultValue={1} />
                        <input name="expires_at" placeholder="expires_at" type="date" />
                        <button type="submit">Buat</button>
                    </form>

                    <h3>Daftar Kupon</h3>
                    <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
                        <thead>
                            <tr><th>Code</th><th>App</th><th>Type</th><th>Value</th><th>Used/Max</th><th>Expires</th></tr>
                        </thead>
                        <tbody>
                            {coupons.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.code}</td>
                                    <td>{c.app_id}</td>
                                    <td>{c.discount_type}</td>
                                    <td>{c.discount_type === 'free_trial' ? `${c.trial_days}d` : c.discount_value}</td>
                                    <td>{c.used_count}/{c.max_uses}</td>
                                    <td>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('id-ID') : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </main>
    );
}
