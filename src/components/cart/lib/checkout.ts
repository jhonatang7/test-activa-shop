import { atom } from 'jotai';

export const useWalletPointsAtom = atom<boolean>(true);
export const payableAmountAtom = atom<number>(0);
export const verifiedTokenAtom = atom<string | null>(null);
