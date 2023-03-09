import { Grant, Share } from "../../../types";

export const getSharePricesPerType = (shares: { [dataID: number]: Share; } = {}) => {
    return Object.values(shares).reduce((prev, curr) => {
        prev[curr.type] = curr.price
        return prev;
    }, { common: 0, preferred: 0 })
};

export const getGrantsWithEquity = (shares: { [dataID: number]: Share; } = {}, grant: { [dataID: number]: Grant } = {}) => {
    const sharePricesPerType = getSharePricesPerType(shares);
    return Object.values(grant).reduce((prev, curr) => { 
        prev[curr.id] = {...curr, equity: curr.amount * sharePricesPerType[curr.type]};
        return prev;
    }, {} as any)
};
