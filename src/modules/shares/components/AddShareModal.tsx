import { Modal, ModalContent, Stack, FormControl, Input, Select, Button, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Share, ShareType } from "../../../types";

interface AddShareModalProps {
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (e: React.FormEvent) => void,
  value: Omit<Share, "id">,
  onChange: (grant: Omit<Share, "id">) => void,
  availableTypes: ShareType[]
}

const shareTypeLabels = {
  "common": "Common",
  "preferred": "Preferred"
}

const AddShareModal: React.FC<AddShareModalProps> = ({ isOpen, onClose, onSubmit, value, onChange, availableTypes }) => {
  const isShareValid = value.type && value.price;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <Stack p="10" as="form" onSubmit={onSubmit}>
          <FormControl>
            <Select
              variant="flushed"
              value={value.type}
              data-testid="share-type"
              onChange={(e) => onChange({ ...value, type: e.target.value as ShareType })}>
              <option disabled value="">Type of Shares</option>
              {availableTypes.map(availableType => <option key={availableType} value={availableType}>
                {shareTypeLabels[availableType]}
              </option>)}
            </Select>
          </FormControl>
          <FormControl>
            <InputGroup>
              <InputLeftElement
                pointerEvents='none'
                color='gray.300'
                fontSize='1.2em'
                children='$'
              />
              <Input
                variant="flushed"
                placeholder="Share price"
                data-testid="share-price"
                value={value.price || ""}
                onChange={(e) =>
                  onChange({ ...value, price: parseInt(e.target.value) })
                }
              />
            </InputGroup>
          </FormControl>
          <Button type="submit" isDisabled={!isShareValid}>Save</Button>
        </Stack>
      </ModalContent>
    </Modal>
  )
};

export default AddShareModal;