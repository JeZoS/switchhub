import { create } from "zustand";

interface candidateStore {
    selectedCandidates: any;
    addCandidate: (candidateId: any) => void;
    removeCandidate: (candidateId: any) => void;
    removeAllCandidates: () => void;
}

const useCandidateStore = create<candidateStore>((set) => ({
    selectedCandidates: [],
    addCandidate: (candidateId: any) =>
        set((state) => ({
            selectedCandidates: [...state.selectedCandidates, candidateId],
        })),
    removeCandidate: (candidateId: any) =>
        set((state) => ({
            selectedCandidates: state.selectedCandidates.filter((id: string) => id !== candidateId),
        })),
    removeAllCandidates: () =>
        set(() => ({
            selectedCandidates: [],
        })),
}));

export default useCandidateStore;
