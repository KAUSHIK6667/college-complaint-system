import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Send } from 'lucide-react';
import { api } from '../../services/api';

const categories = ['Classroom', 'Laboratory', 'Hostel', 'Wi-Fi', 'Infrastructure', 'Transportation', 'Cleanliness', 'Other'];

export default function NewComplaint() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', category: 'Infrastructure', priority: 'Medium', location: { building: '', floor: '', roomNumber: '', additionalDetails: '' } });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState('');
  const update = (key, value) => setForm({ ...form, [key]: value });
  const updateLocation = (key, value) => setForm({ ...form, location: { ...form.location, [key]: value } });

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/complaints', form);
      setSubmitted(data.complaint.ticketId);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to submit this complaint. Please sign in again.');
    }
  }

  if (submitted) return <main className="grid min-h-screen place-items-center px-6"><div className="max-w-md text-center"><p className="text-sm font-bold uppercase tracking-widest text-coral">Complaint submitted</p><h1 className="mt-4 text-5xl font-bold">We have your report.</h1><p className="mt-4 text-ink/60">Your ticket number is <strong className="text-ink">{submitted}</strong>.</p><button onClick={() => router.push('/dashboard')} className="mt-8 rounded-full bg-ink px-6 py-3 font-bold text-cream">Back to dashboard</button></div></main>;
  return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-3xl"><Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold"><ArrowLeft size={16} /> Dashboard</Link><p className="mt-16 text-sm font-bold uppercase tracking-widest text-coral">New complaint</p><h1 className="mt-3 text-5xl font-bold">What needs fixing?</h1><p className="mt-3 text-ink/60">Give the campus team enough detail to act quickly.</p><form onSubmit={submit} className="mt-10 space-y-5 rounded-3xl bg-white p-7 shadow-sm"><Field label="Issue title" value={form.title} onChange={(value) => update('title', value)} placeholder="e.g. Projector not working in Lab 2" /><label className="block text-sm font-bold">Description<textarea required minLength="10" value={form.description} onChange={(event) => update('description', event.target.value)} className="mt-2 min-h-32 w-full rounded-xl border border-ink/15 px-4 py-3 outline-none focus:border-coral" placeholder="What happened, and when did you notice it?" /></label><div className="grid gap-5 md:grid-cols-2"><Select label="Category" value={form.category} options={categories} onChange={(value) => update('category', value)} /><Select label="Priority" value={form.priority} options={['Low', 'Medium', 'High', 'Critical']} onChange={(value) => update('priority', value)} /></div><div className="grid gap-5 md:grid-cols-3"><Field label="Building" value={form.location.building} onChange={(value) => updateLocation('building', value)} placeholder="Main block" /><Field label="Floor" value={form.location.floor} onChange={(value) => updateLocation('floor', value)} placeholder="2nd" /><Field label="Room number" value={form.location.roomNumber} onChange={(value) => updateLocation('roomNumber', value)} placeholder="204" /></div><Field label="Additional location details" value={form.location.additionalDetails} onChange={(value) => updateLocation('additionalDetails', value)} placeholder="Near the north stairwell" />{error && <p className="text-sm text-coral">{error}</p>}<button className="flex items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3 font-bold"><Send size={17} /> Submit complaint</button></form></div></main>;
}

function Field({ label, value, onChange, placeholder }) { return <label className="block text-sm font-bold">{label}<input required={label === 'Issue title' || label === 'Building'} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 outline-none focus:border-coral" /></label>; }
function Select({ label, value, options, onChange }) { return <label className="block text-sm font-bold">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none focus:border-coral">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }