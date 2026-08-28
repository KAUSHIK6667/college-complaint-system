import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';

export default function Dashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api.get('/complaints').then(({ data }) => setComplaints(data.complaints)).catch(() => {});
  }, []);

  function signOut() {
    logout();
    router.replace('/login');
  }

  const open = complaints.filter(({ status }) => !['Resolved', 'Closed'].includes(status)).length;
  const resolved = complaints.filter(({ status }) => ['Resolved', 'Closed'].includes(status)).length;

  return <main className="min-h-screen">
    <nav className="border-b border-ink/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <strong className="text-xl">Edu<span className="text-coral">Fix</span></strong>
        <div className="flex items-center gap-5"><Link href="/settings" className="text-sm font-bold">Settings</Link><button onClick={signOut} className="text-sm font-bold">Sign out</button></div>
      </div>
    </nav>
    <section className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-sm font-bold uppercase tracking-widest text-coral">Student dashboard</p>
      <h1 className="mt-3 text-5xl font-bold">Good to see you{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.</h1>
      <div className="mt-12 grid gap-4 md:grid-cols-3"><Stat label="Open complaints" value={open} /><Stat label="Resolved this term" value={resolved} /><Stat label="Total reports" value={complaints.length} /></div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-ink/10 pt-8"><div><h2 className="text-2xl font-bold">Your complaint queue</h2><p className="mt-2 text-ink/60">{complaints.length ? 'Track your latest campus reports.' : 'Your submitted issues and their latest updates will appear here.'}</p></div><div className="flex gap-3"><Link href="/complaints" className="rounded-full border border-ink/20 px-5 py-3 font-bold">View reports</Link><Link href="/complaints/new" className="rounded-full bg-coral px-5 py-3 font-bold">Report an issue</Link></div></div>
    </section>
  </main>;
}

function Stat({ label, value }) { return <div className="rounded-2xl bg-white p-6"><p className="text-sm text-ink/60">{label}</p><p className="mt-3 text-4xl font-bold">{value}</p></div>; }
