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

export interface IDeactivateDepartmentModalProps {
  department_data: any;
  reloadDepartments: Function;
  reloadServicePoints: Function;
}

const DeactivateDepartmentModal: React.FC<IDeactivateDepartmentModalProps> = ({
  department_data,
  reloadDepartments,
  reloadServicePoints,
}) => {
  // ------- HOOKS ------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const deactivateDepartment = async () => {
    await fetch(`/api/departments/deactivateDepartment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        department_id: department_data._id,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        toast({
          title: 'Departamento desactivado.',
          description: `El departamento ${department_data.name} ha sido desactivado.`,
          status: 'success',
          variant: 'left-accent',
          duration: 5000,
          isClosable: true,
        });

        onClose();
        reloadDepartments();
        reloadServicePoints();
      } else {
        toast({
          title: 'Error al desactivar el departamento.',
          description: `Ha ocurrido un error al desactivar el departamento ${department_data.name}.`,
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
        Desactivar Departamento
      </MenuItem>

      {/* // - MODAL - // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          {/* // - HEADER - // */}
          <ModalHeader>
            <span style={{ fontWeight: 'bold', color: 'red' }}>
              Desactivar Departamento
            </span>
          </ModalHeader>

          <ModalCloseButton />

          <Divider />

          {/* // - BODY - // */}
          <ModalBody>
            El departamento{' '}
            <span style={{ fontWeight: 'bold' }}>{department_data.name}</span>{' '}
            se desactivara, lo cual implica que no se podran generar turnos para
            este departamento hasta que se reactive.
          </ModalBody>

          {/* // - FOOTER - // */}
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>

            <Button colorScheme="red" onClick={deactivateDepartment}>
              Desactivar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeactivateDepartmentModal;
