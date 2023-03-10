import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Text,
  Heading,
  Stack,
  Button,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  useDisclosure,
  Spinner,
  Alert,
  AlertTitle,
  AlertIcon,
  TableCaption,
  Badge,
} from "@chakra-ui/react";
import { ReactComponent as Avatar } from "../assets/avatar-male.svg";
import { Grant, Share, Shareholder } from "../types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import produce from "immer";
import AddGrantModal from "../modules/shareholder/components/AddGrantModal";
import { getGrantsWithEquity, getSharePricesPerType } from "../modules/dashboard/utils/utils";
import { postGrant } from "../apis/grant";
import { AuthContext } from "../App";

export function ShareholderPage() {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { shareholderID = '' } = useParams();
  const { deauthorize } = useContext(AuthContext);
  const grants = useQuery<{ [dataID: number]: Grant }>("grants", () =>
    fetch("/grants").then((e) => e.json())
  );

  const shareholders = useQuery<{ [dataID: number]: Shareholder }>(
    "shareholders",
    () => fetch("/shareholders").then((e) => e.json())
  );

  const shares = useQuery<{ [dataID: number]: Share }>(
    "shares",
    () => fetch("/shares").then((e) => e.json())
  );
  const availableTypes = Object.values(shares.data ?? {}).map(share => share.type);

  const grantsWithEquity = getGrantsWithEquity(shares.data, grants.data);

  const [draftGrant, setDraftGrant] = React.useState<Omit<Grant, "id">>({
    name: "",
    amount: 0,
    issued: "",
    type: "common",
  });

  const grantMutation = useMutation<Grant, unknown, Omit<Grant, "id">>(
    (grant) => postGrant(grant, shareholderID),
    {
      onSuccess: (data) => {
        // this doesn't seem to triggering an instant re-render on consumers even though thats that it should ...
        /// https://github.com/tannerlinsley/react-query/issues/326
        queryClient.setQueryData<{ [id: number]: Shareholder } | undefined>(
          "shareholders",
          (s) => {
            if (s)
              return produce(s, (draft) => {
                draft[parseInt(shareholderID, 10)].grants.push(data.id);
              });
          }
        );
        queryClient.setQueriesData<{ [id: number]: Grant } | undefined>(
          "grants",
          (g) => {
            if (g) {
              return produce(g, (draft) => {
                draft[data.id] = data;
              });
            }
          }
        );
      },
    }
  );
  async function submitGrant(e: React.FormEvent) {
    e.preventDefault();
    try {
      await grantMutation.mutateAsync(draftGrant);
      onClose();
      setDraftGrant({ name: "", amount: 0, issued: "", type: "common" });
    } catch (e) {
      console.warn(e);
    }
  }

  if (
    grants.status !== "success" ||
    shareholders.status !== "success"
  ) {
    return <Spinner />;
  }
  if (!grants.data || !shareholders.data) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error: {grants.error}</AlertTitle>
      </Alert>
    );
  }

  const grantChangeHandler = (grant: Omit<Grant, "id">) => {
    setDraftGrant(grant);
  }

  const shareholder = shareholders.data[parseInt(shareholderID)];

  const getTotalEquity = () => {
    const grantIds = shareholders.data[parseInt(shareholderID, 10)].grants
    return grantIds.map(grantId => grantsWithEquity[grantId]).reduce((prev, curr) => {
      return prev + curr.equity;
    }, 0);
  }

  return (
    <Stack>
      <Stack direction="row" justify="space-between" alignItems="baseline">
        <Heading
          size="md"
          bgGradient="linear(to-br, teal.400, teal.100)"
          bgClip="text"
        >
          Fair Share
        </Heading>
        <Stack direction="row" justify="flex-end" >
          <Button colorScheme="teal" onClick={() => { }}>
            Logout
          </Button>
        </Stack>
      </Stack>
      <Heading size="md" textAlign="center">
        Shareholder
      </Heading>
      <Stack direction="row" spacing="8">
        <Avatar width="100px" height="100%" />
        <Stack>
          <Text fontSize="xl" fontWeight="bold">
            {shareholder.name}
          </Text>
          <Text fontSize="sm" fontWeight="thin">
            <strong data-testid="grants-issued">
              {shareholder.grants.length}
            </strong>{" "}
            grants issued
          </Text>
          <Text fontSize="sm" fontWeight="thin">
            <strong data-testid="shares-granted">
              {shareholder.grants.reduce(
                (acc, grantID) => acc + grants.data[grantID].amount,
                0
              )}
            </strong>{" "}
            shares
          </Text>
          <Text fontSize="sm" fontWeight="thin">
            <strong data-testid="shares-equity">
              ${getTotalEquity().toLocaleString()}
            </strong>{" "}
            equity
          </Text>
        </Stack>
      </Stack>
      <Heading size="md" textAlign="center">
        Grants
      </Heading>
      <Table size="s">
        <Thead>
          <Tr>
            <Td>Occasion</Td>
            <Td>Date</Td>
            <Td>Amount</Td>
            <Td>Class</Td>
            <Td>Value</Td>
          </Tr>
        </Thead>
        <Tbody role="rowgroup">
          {shareholders.data[parseInt(shareholderID, 10)].grants.map(
            (grantID) => {
              const { name, issued, amount, type, equity } = grantsWithEquity[grantID];
              return (
                <Tr key={grantID}>
                  <Td>{name}</Td>
                  <Td>{new Date(issued).toLocaleDateString()}</Td>
                  <Td>{amount}</Td>
                  <Td><Badge>{type}</Badge></Td>
                  <Td data-testid={`grant-${grantID}-equity`}>${equity?.toLocaleString()}</Td>
                </Tr>
              );
            }
          )}
        </Tbody>
        <TableCaption>
          <Button colorScheme="teal" onClick={onOpen}>
            Add Grant
          </Button>
        </TableCaption>
      </Table>
      <AddGrantModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={submitGrant}
        value={draftGrant}
        onChange={grantChangeHandler}
        availableTypes={availableTypes}
      />
    </Stack>
  );
}
