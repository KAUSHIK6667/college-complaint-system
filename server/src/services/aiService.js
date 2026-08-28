const categoryRules = [
  { category: 'Wi-Fi', words: ['wifi', 'internet', 'network', 'router'] },
  { category: 'Cleanliness', words: ['dirty', 'garbage', 'trash', 'clean'] },
  { category: 'Laboratory', words: ['lab', 'equipment', 'computer'] },
  { category: 'Hostel', words: ['hostel', 'dorm', 'room'] },
  { category: 'Transportation', words: ['bus', 'transport', 'shuttle'] },
  { category: 'Classroom', words: ['classroom', 'projector', 'desk', 'chair'] }
];

export async function classifyComplaint(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const match = categoryRules.find((rule) => rule.words.some((word) => text.includes(word)));
  const critical = ['fire', 'danger', 'shock', 'flood', 'emergency'].some((word) => text.includes(word));
  return { suggestedCategory: match?.category || 'Infrastructure', confidenceScore: match ? 0.78 : 0.42, priority: critical ? 'Critical' : 'Medium' };
}