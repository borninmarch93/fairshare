import { Modal, ModalContent, Stack, FormControl, Input, Select, Button } from "@chakra-ui/react";
import { Share } from "../../../types";

interface AddShareModalProps {
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (e: React.FormEvent) => void,
    value: Omit<Share, "id">,
    onChange: (grant: Omit<Share, "id">) => void,
}

const AddShareModal: React.FC<AddShareModalProps> = ({ isOpen, onClose, onSubmit, value, onChange }) => {
    const isShareValid = value.type && value.price;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <Stack p="10" as="form" onSubmit={onSubmit}>
            {/* TODO any type */}
            <FormControl>
              <Select 
              variant="flushed"
              value={value.type} 
              data-testid="share-type" 
              onChange={(e) => onChange({...value, type: e.target.value as any})}>
                <option disabled value="">Type of Shares</option>
                <option value="common">Common</option>
                <option value="preferred">Preferred</option>
              </Select>
            </FormControl>
            <FormControl>
              <Input
                variant="flushed"
                placeholder="Share price"
                data-testid="share-price"
                value={value.price || ""}
                onChange={(e) =>
                  onChange({ ...value, price: parseInt(e.target.value)})
                }
              />
            </FormControl>
            <Button type="submit" isDisabled={!isShareValid}>Save</Button>
          </Stack>
        </ModalContent>
      </Modal>
    )
};

export default AddShareModal;