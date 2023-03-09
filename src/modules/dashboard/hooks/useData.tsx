import { useMemo } from "react";
import { Shareholder, Grant, Share } from "../../../types";
import { getGrantsWithEquity } from "../utils/utils";

const useData = ( 
    shareholder: { [dataID: number]: Shareholder } = {}, 
    grant: { [dataID: number]: Grant } = {}, 
    shares: { [dataID: number]: Share; } = {}) => {

    const grantsWithEquity = useMemo(() => getGrantsWithEquity(shares, grant), [shares, grant]);

    // TODO: why are these inline?
    const getGroupData = (metric: "amount" | "equity") => {
        if (!shareholder || !grant) {
            return [];
        }
        return ["investor", "founder", "employee"].map((group) => ({
            x: group,
            y: Object.values(shareholder)
                .filter((s) => s.group === group)
                .flatMap((s) => s.grants)
                .map(grantID => grantsWithEquity[grantID][metric])
                .reduce((prev, curr) => prev + curr, 0),
        })).filter((group) => group.y > 0);
    }

    const getInvestorData = (metric: "amount" | "equity") => {
        if (!shareholder || !grant) {
            return [];
        }
        return Object.values(shareholder)
            .map((s) => ({
                x: s.name,
                y: s.grants.map(grantID => grantsWithEquity[grantID][metric])
                .reduce((prev, curr) => prev + curr, 0)
            }))
            .filter((e) => e.y > 0);
    }

    const getShareTypeData = (metric: "amount" | "equity") => {
        if (!shareholder || !grant) {
            return [];
        }

        return ["common", "preferred"].map((shareType) => ({
            x: shareType,
            y: Object.values(grant)
                .filter((g) => g.type === shareType)
                .map((g) => grantsWithEquity[g.id][metric])
                .reduce((prev, curr) => prev + curr, 0),
        })).filter((s) => s.y > 0);
    };

    return { getGroupData, getInvestorData, getShareTypeData }

}

export default useData;