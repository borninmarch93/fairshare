import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { useMemo } from "react";
import { VictoryPie } from "victory";
import { Shareholder, Grant, Share } from "../../../types";

interface GrantWithEquity extends Grant {
    equity: number
}

interface ChartProps {
    groupBy?: string,
    shareholder: { [dataID: number]: Shareholder },
    grant: { [dataID: number]: Grant },
    shares: { [dataID: number]: Share; } | undefined,
}

const Chart: React.FC<ChartProps> = ({ groupBy = 'investor', shareholder = {}, grant = {}, shares = {} }) => {
    
    const grantsWithEquity = useMemo(() => {
        const sharePricesPerType = Object.values(shares).reduce((prev, curr) => {
          prev[curr.type] = curr.price
          return prev;
        }, { common: 0, preferred: 0 });

        return Object.values(grant).reduce((prev, curr) => { 
            prev[curr.id] = {...curr, equity: curr.amount * sharePricesPerType[curr.type]};
            return prev;
        }, {} as any)
    }, [shares, grant]);

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

    const getData = (metric: "amount" | "equity") => {
        if (groupBy === 'investor') {
            return getInvestorData(metric);
        }
        if (groupBy === 'group') {
            return getGroupData(metric);
        }
        if (groupBy === 'shareType') {
            return getShareTypeData(metric);
        }

        return [];
    }

    return (
        <Tabs>
            <TabList>
                <Tab>Share #</Tab>
                <Tab>Equity</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <VictoryPie
                        colorScale="blue"
                        data={getData("amount")}
                    />
                </TabPanel>
                <TabPanel>
                    <VictoryPie
                        colorScale="green"
                        data={getData("equity")}
                    />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default Chart;