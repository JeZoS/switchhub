import { create } from "zustand";

interface OrgStore {
    orgId: any;
    openingId: string;
    setOrgId: (orgId: any) => void;
    setOpeningId: (openingId: string) => void;
}

const useOrgStore = create<OrgStore>((set) => ({
    orgId: {},
    openingId: "",
    setOrgId: (orgId: any) => set({ orgId }),
    setOpeningId: (openingId: string) => set({ openingId }),
}));

export default useOrgStore;
