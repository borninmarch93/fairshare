import { Stack, Heading, Button, Badge, Table, Tbody, Td, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import produce from "immer";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { Share } from "../../../types";
import UpdateShareModal from "../../shares/components/UpdateShareModal";

interface SharesTableProps {
    shares: { [dataID: number]: Share }
}

const SharesTable: React.FC<SharesTableProps> = ({ shares }) => {
    const queryClient = useQueryClient();
    const { onOpen: shareOnOpen, isOpen: isShareOpen, onClose: onShareClose } = useDisclosure();
    const [updatedShare, setUpdatedShare] = React.useState<Share>();

    const updateShareTypeValue = (id: number) => {
        const foundShare = Object.values(shares ?? {}).find(share => share.id === id);
        if (foundShare) {
            setUpdatedShare({ ...foundShare });
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

    return (
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
                    {Object.values(shares || {}).map((s) => (
                        <Tr key={s.id}>
                            <Td data-testid={`share-${s.type}-type`}><Badge>{s.type}</Badge></Td>
                            <Td data-testid={`share-${s.type}-price`}>
                                ${s.price.toLocaleString()}
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
    );
}

export default SharesTable;