import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";

interface DashboardStatsProps {
    marketCap: number
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ marketCap }) => {
    return (
        <Stat>
            <StatLabel>Market Cap</StatLabel>
            <StatNumber data-testid="marketCap">${marketCap.toLocaleString()}</StatNumber>
        </Stat>
    );
}

export default DashboardStats;