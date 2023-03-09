import { useDisclosure, Stack, Table, Text, Thead, Tr, Th, Tbody, Td, Button, Modal, ModalContent, FormControl, Input, Select, Badge } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Grant } from "../../../types";
import AddGrantModal from "../../shareholder/components/AddGrantModal";
import { OnboardingContext } from "../context/OnboardingContext";

const ShareholderGrantsStep = () => {
  const { shareholders, grants, dispatch } = useContext(OnboardingContext);
  const { shareholderID = '' } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const shareholder = shareholders[parseInt(shareholderID, 10)];

  const [draftGrant, setDraftGrant] = React.useState<Omit<Grant, "id">>({
    name: "",
    amount: 0,
    issued: "",
    type: "common",
  });
  const nextLink = !shareholders[shareholder.id + 1]
    ? `/start/done`
    : `/start/grants/${shareholder.id + 1}`;

  if (!shareholder) {
    return <Navigate to="/start/shareholders" replace={true} />;
  }

  const grantChangeHandler = (grant: Omit<Grant, "id">) => {
    setDraftGrant(grant);
  }

  function submitGrant(e: React.FormEvent) {
    e.preventDefault();
    dispatch({
      type: "addGrant",
      payload: {
        shareholderID: parseInt(shareholderID, 10),
        grant: draftGrant,
      },
    });
    onClose();
    setDraftGrant({ name: "", amount: 0, issued: "", type: "common" });
  }
  return (
    <Stack>
      <Text color="teal-400">
        What grants does <strong>{shareholder.name}</strong> have?
      </Text>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Occasion</Th>
            <Th>Type</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {shareholder.grants.map((gid) => (
            <Tr key={gid}>
              <Td>{grants[gid].name}</Td>
              <Td><Badge>{grants[gid].type}</Badge></Td>
              <Td>{grants[gid].amount}</Td>
              <Td>{grants[gid].issued}</Td>
            </Tr>
          ))}
          {shareholder.grants.length === 0 && (
            <Tr>
              <Td colSpan={3} textAlign="center">
                No grants to show for <strong>{shareholder.name}</strong>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <Button variant="outline" onClick={onOpen}>
        Add Grant
      </Button>
      <AddGrantModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={submitGrant}
        value={draftGrant}
        onChange={grantChangeHandler}
      />
      <Button as={Link} to={nextLink} colorScheme="teal">
        Next
      </Button>
    </Stack>
  );
}

export default ShareholderGrantsStep;