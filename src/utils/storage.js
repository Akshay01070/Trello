import { sampleBoard, members } from '../data/seed';

const STORAGE_KEY = 'trello_clone_data_v1';

const DEFAULT_LABELS = [
  { id: 'lbl_frontend', name: 'frontend', color: 'green' },
  { id: 'lbl_backend', name: 'backend', color: 'blue' },
  { id: 'lbl_urgent', name: 'urgent', color: 'red' },
];

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = { boards: [sampleBoard], members, labels: DEFAULT_LABELS };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    const initial = { boards: [sampleBoard], members, labels: DEFAULT_LABELS };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
