import React from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
// fucken love nextui yeses!

const SuccessModal = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
      <>
      <div className=''>
         <Button onPress={onOpen}>Open Modal</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Subscribed Successfuly</ModalHeader>
                <ModalBody>
                  <p> 
                    Thank you for your subscription. Your email will be added to our mailing list. This is for testing purposes.
                  </p>
                 
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
       
      </>
    );
}

export default SuccessModal;
