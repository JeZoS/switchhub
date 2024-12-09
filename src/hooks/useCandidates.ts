import { create } from "zustand";

interface candidateStore {
    selectedCandidates: any;
    addCandidate: (candidateId: any) => void;
    removeCandidate: (candidateId: any) => void;
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
}));

export default useCandidateStore;
