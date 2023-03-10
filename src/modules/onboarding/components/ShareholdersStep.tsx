import { useDisclosure, Stack, StackDivider, Badge, Modal, ModalContent, Input, Select, Button, Text } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shareholder, ShareholderGroup } from "../../../types";
import AddShareholderModal from "../../shareholder/components/AddShareholderModal";
import { OnboardingContext } from "../context/OnboardingContext";

const ShareholdersStep = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { shareholders, companyName, dispatch } = useContext(OnboardingContext);
  const [newShareholder, setNewShareholder] = React.useState<
    Omit<Shareholder, "id" | "grants">
  >({ name: "", group: "employee" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!companyName) {
      return navigate("/start/shares");
    }
  }, [companyName]);

  function submitNewShareholder(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: "addShareholder", payload: newShareholder });
    setNewShareholder({ name: "", group: "employee" });
    onClose();
  }

  return (
    <Stack>
      <Text color="teal.400">
        Who are <strong>{companyName}</strong>'s shareholders?
      </Text>
      <Stack divider={<StackDivider borderColor="teal-200" />}>
        {Object.values(shareholders).map((s, i) => (
          <Stack justify="space-between" direction="row" key={i}>
            <Text>{s.name}</Text>
            <Badge>{s.group}</Badge>
          </Stack>
        ))}
        <AddShareholderModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={submitNewShareholder}
                value={newShareholder}
                onChange={(shareholder) => setNewShareholder(shareholder)} />
      </Stack>
      <Button colorScheme="teal" variant="outline" onClick={onOpen}>
        Add Shareholder
      </Button>
      <Button as={Link} to="/start/grants" colorScheme="teal">
        Next
      </Button>
    </Stack>
  );
}

export default ShareholdersStep;