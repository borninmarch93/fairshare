export const generateID = (items: { [key: string]: unknown }) => {
    return Math.max(
        0,
        ...Object.keys(items).map((e) => parseInt(e, 10))
    ) + 1;
}