import { useState } from 'react';
import Link from 'next/link';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Settings() { const user = useAuthStore((state) => state.user); const [name, setName] = useState(user?.name || ''); const [saved, setSaved] = useState(false); async function submit(event) { event.preventDefault(); const { data } = await api.put('/auth/profile', { name }); useAuthStore.setState({ user: data.user }); setSaved(true); } return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-xl"><Link href="/dashboard" className="text-sm font-bold">← Dashboard</Link><h1 className="mt-16 text-5xl font-bold">Settings</h1><form onSubmit={submit} className="mt-10 space-y-5 rounded-3xl bg-white p-7"><label className="block text-sm font-bold">Full name<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3" /></label>{saved && <p className="text-sm text-green-700">Profile updated.</p>}<button className="rounded-xl bg-ink px-5 py-3 font-bold text-cream">Save changes</button></form></div></main>; }
