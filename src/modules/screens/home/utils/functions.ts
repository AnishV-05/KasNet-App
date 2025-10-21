export const parseUbigeoIndex = (val?: string): number | null => {
    if (!val) return null;
    const raw = val.split('-')[0];
    const n = Number(raw);
    return !isNaN(n) ? n : null;
};