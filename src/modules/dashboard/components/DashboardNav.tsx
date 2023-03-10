import { Stack, Heading, Button } from "@chakra-ui/react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../App";


interface DashboardNavProps {
    mode?: string
}

const DashboardNav: React.FC<DashboardNavProps> = ({ mode }) => {
    const { deauthorize } = useContext(AuthContext);

    return (
        <Stack direction="row" justify="space-between" alignItems="baseline">
            <Heading
                size="md"
                bgGradient="linear(to-br, teal.400, teal.100)"
                bgClip="text"
            >
                Fair Share
            </Heading>
            <Stack direction="row">
                <Button
                    size={"sm"}
                    colorScheme="teal"
                    as={Link}
                    to="/dashboard/investor"
                    variant="ghost"
                    isActive={mode === "investor"}
                >
                    By Investor
                </Button>
                <Button
                    size={"sm"}
                    colorScheme="teal"
                    as={Link}
                    to="/dashboard/group"
                    variant="ghost"
                    isActive={mode === "group"}
                >
                    By Group
                </Button>
                <Button
                    size={"sm"}
                    colorScheme="teal"
                    as={Link}
                    to="/dashboard/shareType"
                    variant="ghost"
                    isActive={mode === "shareType"}
                >
                    By Share Type
                </Button>
            </Stack>
            <Stack direction="row" justify="flex-end" >
                <Button colorScheme="teal" onClick={deauthorize}>
                    Logout
                </Button>
            </Stack>
        </Stack>
    );
}

export default DashboardNav;