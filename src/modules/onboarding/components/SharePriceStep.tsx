import { Stack, Text, Button, Badge, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Share } from "../../../types";
import AddShareModal from "../../shares/components/AddShareModal";
import { OnboardingContext } from "../context/OnboardingContext";

const SharePriceStep = () => {
    const { shares, companyName, dispatch, } = useContext(OnboardingContext);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [draftShare, setDraftShare] = React.useState<Omit<Share, "id">>({
        type: "common",
        price: 0,
      });

      useEffect(() => {
        if (!companyName) {
          return navigate("/start/company");
        }
      }, [companyName]);

    function submitShare(e: React.FormEvent) {
        e.preventDefault();
        dispatch({
          type: "addShare",
          payload: draftShare,
        });
        onClose();
        setDraftShare({ type: "common", price: 0 });
    }

    const shareChangeHandler = (share: Omit<Share, "id">) => {
        setDraftShare(share);
    }

    return (
        <Stack>
      <Text color="teal-400">
        What shares does <strong>{companyName}</strong> have?
      </Text>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th>Price</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.values(shares).map((share, i) => (
            <Tr key={i}>
              <Td><Badge>{share.type}</Badge></Td>
              <Td>{share.price}</Td>
            </Tr>
          ))}
          {Object.keys(shares).length === 0 && (
            <Tr>
              <Td colSpan={3} textAlign="center">
                No shares to show for <strong>{companyName}</strong>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <Button variant="outline" onClick={onOpen}>
        Add Share
      </Button>
      <AddShareModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={submitShare}
        value={draftShare}
        onChange={shareChangeHandler}
      />
      <Button as={Link} to="/start/shareholders" colorScheme="teal">
        Next
      </Button>
    </Stack>
    )


}

export default SharePriceStep;