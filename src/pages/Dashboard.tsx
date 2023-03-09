import React, { useContext } from "react";
import { VictoryPie } from "victory";
import { Link, useParams } from "react-router-dom";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Text,
  Heading,
  Stack,
  Button,
  Input,
  StackDivider,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  Modal,
  useDisclosure,
  ModalContent,
  Spinner,
  Alert,
  AlertTitle,
  AlertIcon,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
} from "@chakra-ui/react";
import { Grant, Share, Shareholder } from "../types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import produce from "immer";
import { AuthContext } from "../App";
import UpdateShareModal from "../modules/shares/components/UpdateShareModal";

export function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onOpen: shareOnOpen, isOpen: isShareOpen, onClose: onShareClose } = useDisclosure();

  const queryClient = useQueryClient();
  const [newShareholder, setNewShareholder] = React.useState<Omit<Shareholder, "id" | "grants">>({ name: "", group: "employee" });
  const [updatedShare, setUpdatedShare] = React.useState<Share>();
  const { mode } = useParams();
  const { deauthorize } = useContext(AuthContext);

  // TODO: using this dictionary thing a lot... hmmm
  const grant = useQuery<{ [dataID: number]: Grant }, string>("grants", () =>
    fetch("/grants").then((e) => e.json())
  );
  const shareholder = useQuery<{ [dataID: number]: Shareholder }>(
    "shareholders",
    () => fetch("/shareholders").then((e) => e.json())
  );
  const shares = useQuery<{ [dataID: number]: Share }>(
    "shares",
    () => fetch("/shares").then((e) => e.json())
  );

  const calcMarketCap = () => {
    const sharePricesPerType = Object.values(shares?.data ?? {})
      .reduce((prev, curr) => {
        prev[curr.type] = curr.price
        return prev;
      }, { common: 0, preferred: 0 });
    //TODO fix type

    return Object.values(grant?.data ?? {})
      .reduce((prev, curr) => {
        return prev += curr.amount * sharePricesPerType[curr.type]
      }, 0)
  }

  const updateShareTypeValue = (id: number) => {
    const foundShare = Object.values(shares?.data ?? {}).find(share => share.id === id);
    if (foundShare) {
      setUpdatedShare({...foundShare});
    }
    shareOnOpen();
  }

  const shareChangeHandler = (share: Share) => {
    setUpdatedShare(share);
  }

  const shareMutation = useMutation<
    Share,
    unknown,
    Share
  >(
    (share) =>
      fetch("/share/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(share),
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        queryClient.setQueryData<{ [id: number]: Share } | undefined>(
          "shares",
          (s) => {
            if (s) {
              return produce(s, (draft) => {
                draft[data.id] = data;
              });
            }
          }
        );
      },
    }
  );

  async function updateShareHandler(e: React.FormEvent) {
    e.preventDefault();
    if (updatedShare) {
      await shareMutation.mutateAsync(updatedShare);
    }
    onShareClose();
  }


  const shareholderMutation = useMutation<
    Shareholder,
    unknown,
    Omit<Shareholder, "id" | "grants">
  >(
    (shareholder) =>
      fetch("/shareholder/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shareholder),
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        queryClient.setQueryData<{ [id: number]: Shareholder } | undefined>(
          "shareholders",
          (s) => {
            if (s) {
              return produce(s, (draft) => {
                draft[data.id] = data;
              });
            }
          }
        );
      },
    }
  );

  if (grant.status === "error") {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error: {grant.error}</AlertTitle>
      </Alert>
    );
  }
  if (grant.status !== "success") {
    return <Spinner />;
  }
  if (!grant.data || !shareholder.data) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Failed to get any data</AlertTitle>
      </Alert>
    );
  }

  // TODO: why are these inline?
  function getGroupData() {
    if (!shareholder.data || !grant.data) {
      return [];
    }
    return ["investor", "founder", "employee"].map((group) => ({
      x: group,
      y: Object.values(shareholder?.data ?? {})
        .filter((s) => s.group === group)
        .flatMap((s) => s.grants)
        .reduce((acc, grantID) => acc + grant.data[grantID].amount, 0),
    })).filter((group) => group.y > 0);
  }

  function getInvestorData() {
    if (!shareholder.data || !grant.data) {
      return [];
    }
    return Object.values(shareholder.data)
      .map((s) => ({
        x: s.name,
        y: s.grants.reduce(
          (acc, grantID) => acc + grant.data[grantID].amount,
          0
        ),
      }))
      .filter((e) => e.y > 0);
  }

  async function submitNewShareholder(e: React.FormEvent) {
    e.preventDefault();
    await shareholderMutation.mutateAsync(newShareholder);
    onClose();
  }

  const getShareTypeData = () => {
    if (!shareholder.data || !grant.data) {
      return [];
    }

    return ["common", "preferred"].map((shareType) => ({
      x: shareType,
      y: Object.values(grant?.data ?? {})
        .filter((g) => g.type === shareType)
        .map((g) => g.amount)
        .reduce((acc, curr) => acc + curr, 0),
    })).filter((s) => s.y > 0);
  };

  const getData = () => {
    if (mode === 'investor') {
      return getInvestorData();
    }
    if (mode === 'group') {
      return getGroupData();
    }
    if (mode === 'shareType') {
      return getShareTypeData();
    }

    return [];
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
        <Stack direction="row">
          <Button
            colorScheme="teal"
            as={Link}
            to="/dashboard/investor"
            variant="ghost"
            isActive={mode === "investor"}
          >
            By Investor
          </Button>
          <Button
            colorScheme="teal"
            as={Link}
            to="/dashboard/group"
            variant="ghost"
            isActive={mode === "group"}
          >
            By Group
          </Button>
          <Button
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
      <Stat>
        <StatLabel>Market Cap</StatLabel>
        <StatNumber>${calcMarketCap().toLocaleString()}</StatNumber>
      </Stat>
      <VictoryPie
        colorScale="blue"
        data={getData()}
      />
      <Stack divider={<StackDivider />}>
        <Heading size="md">Shareholders</Heading>
        <Table>
          <Thead>
            <Tr>
              <Td>Name</Td>
              <Td>Group</Td>
              <Td>Grants</Td>
              <Td>Shares</Td>
            </Tr>
          </Thead>
          <Tbody>
            {Object.values(shareholder.data).map((s) => (
              <Tr key={s.id}>
                <Td>
                  <Link to={`/shareholder/${s.id}`}>
                    <Stack direction="row" alignItems="center">
                      <Text color="teal.600">{s.name}</Text>
                      <ArrowForwardIcon color="teal.600" />
                    </Stack>
                  </Link>
                </Td>
                <Td data-testid={`shareholder-${s.name}-group`}>{s.group}</Td>
                <Td data-testid={`shareholder-${s.name}-grants`}>
                  {s.grants.length}
                </Td>
                <Td data-testid={`shareholder-${s.name}-shares`}>
                  {s.grants.reduce(
                    (acc, grantID) => acc + grant.data[grantID].amount,
                    0
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button onClick={onOpen}>Add Shareholder</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <Stack p="10" as="form" onSubmit={submitNewShareholder}>
              <Input
                value={newShareholder.name}
                placeholder="Shareholder Name"
                onChange={(e) =>
                  setNewShareholder((s) => ({ ...s, name: e.target.value }))
                }
              />
              <Select
                value={newShareholder.group}
                onChange={(e) =>
                  setNewShareholder((s) => ({
                    ...s,
                    group: e.target.value as any,
                  }))
                }
              >
                <option disabled value="">Type of Shareholder</option>
                <option value="investor">Investor</option>
                <option value="founder">Founder</option>
                <option value="employee">Employee</option>
              </Select>
              <Button type="submit" colorScheme="teal" isDisabled={!newShareholder.name.length}>
                Save
              </Button>
            </Stack>
          </ModalContent>
        </Modal>
      </Stack>
      <Stack>
        <Heading as="h3" size='md'>Shares</Heading>
        <Table>
          <Thead>
            <Tr>
              <Td>Type</Td>
              <Td>Price</Td>
              <Td></Td>
            </Tr>
          </Thead>
          <Tbody>
            {Object.values(shares?.data || {}).map((s) => (
              <Tr key={s.id}>
                <Td data-testid={`share-${s.type}`}><Badge>{s.type}</Badge></Td>
                <Td data-testid={`share-${s.price}`}>
                  ${s.price}
                </Td>
                <Td>
                  <Button variant="link" data-share-id={4} onClick={() => updateShareTypeValue(s.id)}>Edit</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {updatedShare &&
          <UpdateShareModal
            value={updatedShare}
            onClose={onShareClose}
            isOpen={isShareOpen}
            onSubmit={updateShareHandler}
            onChange={shareChangeHandler} />
        }
      </Stack>
    </Stack>
  );
}
