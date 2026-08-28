import { escalateBreachedComplaints } from '../services/slaService.js';

export function startEscalationFallback() {
  setInterval(() => escalateBreachedComplaints().catch((error) => console.error('SLA escalation failed:', error.message)), 15 * 60 * 1000).unref();
}