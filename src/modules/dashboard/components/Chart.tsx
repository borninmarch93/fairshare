import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { useMemo } from "react";
import { VictoryPie } from "victory";
import { Shareholder, Grant, Share } from "../../../types";
import useData from "../hooks/useData";

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
    
    const { getGroupData, getInvestorData, getShareTypeData } = useData(shareholder, grant, shares);

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