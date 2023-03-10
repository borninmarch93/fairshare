import { Modal, ModalContent, Stack, FormControl, Input, Select, Button, Text } from "@chakra-ui/react";
import { Grant, ShareType } from "../../../types";

interface AddGrantModalProps {
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (e: React.FormEvent) => void,
    value: Omit<Grant, "id">,
    onChange: (grant: Omit<Grant, "id">) => void,
    availableTypes: ShareType[]
}

const shareTypeLabels = {
  "common": "Common",
  "preferred": "Preferred"
}

const AddGrantModal: React.FC<AddGrantModalProps> = ({ isOpen, onClose, onSubmit, value, onChange, availableTypes }) => {
    const isGrantValid = value.name.length && value.amount && value.issued;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <Stack p="10" as="form" onSubmit={onSubmit}>
            <Text>
              A <strong>Grant</strong> is any occasion where new shares are
              issued to a shareholder.
            </Text>

            <FormControl>
              <Input
                variant="flushed"
                placeholder="Name"
                data-testid="grant-name"
                value={value.name}
                onChange={(e) =>
                  onChange(({ ...value, name: e.target.value }))
                }
              />
            </FormControl>
            <FormControl>
              <Select 
              variant="flushed"
              value={value.type} 
              data-testid="grant-share-type" 
              onChange={(e) => onChange({...value, type: e.target.value as ShareType})}>
                <option disabled value="">Type of Shares</option>
                {availableTypes.map(availableType => <option key={availableType} value={availableType}>
                {shareTypeLabels[availableType]}
              </option>)}
              </Select>
            </FormControl>
            <FormControl>
              <Input
                variant="flushed"
                placeholder="Shares"
                data-testid="grant-amount"
                value={value.amount || ""}
                onChange={(e) =>
                  onChange({ ...value,amount: parseInt(e.target.value)})
                }
              />
            </FormControl>
            <FormControl>
              <Input
                variant="flushed"
                type="date"
                data-testid="grant-issued"
                value={value.issued}
                onChange={(e) => onChange({ ...value, issued: e.target.value})}
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" isDisabled={!isGrantValid}>Save</Button>
          </Stack>
        </ModalContent>
      </Modal>
    )
};

export default AddGrantModal;