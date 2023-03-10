import { Modal, ModalContent, Stack, FormControl, Input, Select, Button, Text } from "@chakra-ui/react";
import { Grant, Shareholder, ShareholderGroup } from "../../../types";

interface AddShareholderModalProps {
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (e: React.FormEvent) => void,
  value: Omit<Shareholder, "id" | "grants">,
  onChange: (shareholder: Omit<Shareholder, "id" | "grants">) => void,
}

const AddShareholderModal: React.FC<AddShareholderModalProps> = ({ isOpen, onClose, onSubmit, value, onChange }) => {
  return (<Modal isOpen={isOpen} onClose={onClose}>
    <ModalContent>
      <Stack p="10" as="form" onSubmit={onSubmit}>
        <Input
          variant="flushed"
          value={value.name}
          placeholder="Shareholder Name"
          onChange={(e) =>
            onChange(({ ...value, name: e.target.value }))
          }
        />
        <Select
          variant="flushed"
          value={value.group}
          onChange={(e) =>
            onChange(({ ...value, group: e.target.value as ShareholderGroup }))
          }
        >
          <option disabled value="">Type of Shareholder</option>
          <option value="investor">Investor</option>
          <option value="founder">Founder</option>
          <option value="employee">Employee</option>
        </Select>
        <Button type="submit" colorScheme="teal" isDisabled={!value.name.length}>
          Save
        </Button>
      </Stack>
    </ModalContent>
  </Modal>);
};

export default AddShareholderModal;