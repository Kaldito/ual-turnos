import {
  Button,
  Divider,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AiFillLock } from 'react-icons/ai';

export interface IDeactivateServicePointModalProps {
  servicePoint_data: any;
  reloadServicePoints: Function;
}

const DeactivateDepartmentModal: React.FC<
  IDeactivateServicePointModalProps
> = ({ servicePoint_data, reloadServicePoints }) => {
  // ------- HOOKS ------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const deactivateServicePoint = async () => {
    await fetch(`/api/servicePoints/deactivateServicePoint`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_point_id: servicePoint_data._id,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        toast({
          title: 'Punto de servicio desactivado.',
          description: `El punto de servicio ${servicePoint_data.name} ha sido desactivado.`,
          status: 'success',
          variant: 'left-accent',
          duration: 5000,
          isClosable: true,
        });

        onClose();
        reloadServicePoints();
      } else if (res.status == 400) {
        toast({
          title: 'Error al desactivar punto de servicio.',
          description: data.message,
          variant: 'left-accent',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error al desactivar punto de servicio.',
          description: `Ha ocurrido un error al desactivar el punto de servicio ${servicePoint_data.name}.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    });
  };

  return (
    <>
      {/* // - BOTON - //  */}
      <MenuItem
        icon={<AiFillLock />}
        color={'red'}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        Desactivar Punto de Servicio
      </MenuItem>

      {/* // - MODAL - // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          {/* // - HEADER - // */}
          <ModalHeader>
            <span style={{ fontWeight: 'bold', color: 'red' }}>
              Desactivar Punto de Servicio
            </span>
          </ModalHeader>

          <ModalCloseButton />

          <Divider />

          {/* // - BODY - // */}
          <ModalBody>
            <span style={{ fontWeight: 'bold' }}>{servicePoint_data.name}</span>{' '}
            se desactivara, lo cual implica que no se podran asignar turnos a
            este punto de servicio hasta que se reactive.
          </ModalBody>

          {/* // - FOOTER - // */}
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>

            <Button colorScheme="red" onClick={deactivateServicePoint}>
              Desactivar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeactivateDepartmentModal;
