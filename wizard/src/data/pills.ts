import type { PillDef } from '../types';

export const pills: PillDef[] = [
  { t: 'all', count: 93, label: 'All', bg: '#1a1a1a', bc: '#1a1a1a', tc: '#fff' },
  { t: 'theme', count: 7, label: 'Themes', bg: '#f1efe8', bc: '#D3D1C7', tc: '#444441' },
  { t: 'cluster', count: 8, label: 'Clusters', bg: '#E6F1FB', bc: '#85B7EB', tc: '#0C447C' },
  { t: 'actor', count: 6, label: 'Actors', bg: '#EEEDFE', bc: '#AFA9EC', tc: '#3C3489' },
  { t: 'process', count: 66, label: 'Processes', bg: '#FAEEDA', bc: '#EF9F27', tc: '#633806' },
  { t: 'subprocess', count: 12, label: 'Sub-processes', bg: '#FAECE7', bc: '#F0997B', tc: '#712B13' },
  { t: 'action', count: 38, label: 'Steps', bg: '#EAF3DE', bc: '#97C459', tc: '#27500A' },
  { t: 'connection', count: 11, label: 'Connections', bg: '#F5F3FF', bc: '#DDD6FE', tc: '#5B21B6' },
  { t: 'fact', count: 8, label: 'Facts / policies', bg: '#E1F5EE', bc: '#5DCAA5', tc: '#085041' },
  { t: 'unc', count: 3, label: 'Unclassified', bg: '#fafafa', bc: '#e5e5e5', tc: '#999' },
];
