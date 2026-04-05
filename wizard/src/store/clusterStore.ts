import { create } from 'zustand';
import type { Cluster } from '../types';
import { clusters as initialClusters } from '../data/clusters';

interface ClusterState {
  clusters: Cluster[];
  activeCluster: string;
  setActive: (id: string) => void;
  reorder: (from: number, to: number) => void;
}

export const useClusterStore = create<ClusterState>((set) => ({
  clusters: initialClusters,
  activeCluster: 'all',
  setActive: (id) =>
    set((s) => ({ activeCluster: s.activeCluster === id ? 'all' : id })),
  reorder: (from, to) =>
    set((s) => {
      const arr = [...s.clusters];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { clusters: arr };
    }),
}));
