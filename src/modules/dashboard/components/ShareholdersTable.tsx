import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Text, Button, Heading, Input, Modal, ModalContent, Select, Stack, StackDivider, Table, Tbody, Td, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import produce from "immer";
import React from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { Grant, Shareholder } from "../../../types";

interface ShareholdersTableProps {
    shareholders: { [dataID: number]: Shareholder }
    grants: { [dataID: number]: Grant }
}

const ShareholdersTable: React.FC<ShareholdersTableProps> = ({ shareholders, grants }) => {
    const queryClient = useQueryClient();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newShareholder, setNewShareholder] = React.useState<Omit<Shareholder, "id" | "grants">>({ name: "", group: "employee" });

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

    async function submitNewShareholder(e: React.FormEvent) {
        e.preventDefault();
        await shareholderMutation.mutateAsync(newShareholder);
        onClose();
    }

    return (
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
                    {Object.values(shareholders).map((s) => (
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
                                    (acc, grantID) => acc + grants[grantID].amount,
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
    );
}

export default ShareholdersTable;