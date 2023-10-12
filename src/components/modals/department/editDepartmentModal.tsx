import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BiEdit } from 'react-icons/bi';

export interface IEditDepartmentModalProps {
  department_data: any;
  reloadDepartments: Function;
}

const EditDepartmentModal: React.FC<IEditDepartmentModalProps> = ({
  department_data,
  reloadDepartments,
}) => {
  // ------- HOOKS ------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // ------- USESTATE DECLARATIONS ------- //
  const [departmentName, setDepartmentName] = useState<string>(
    department_data.name
  );
  const [departmentDescription, setDepartmentDescription] = useState<string>(
    department_data.description
  );

  // ------- EDITAR DEPARTAMENTO ------- //
  const editDepartment = async () => {
    if (departmentName.trim() == '') {
      toast({
        title: 'Error al editar el departamento.',
        description: 'El nombre del departamento no puede estar vacio.',
        variant: 'left-accent',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });

      return;
    }

    if (departmentDescription.trim() == '') {
      toast({
        title: 'Error al editar el departamento.',
        description: 'La descripcion del departamento no puede estar vacia.',
        variant: 'left-accent',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });

      return;
    }

    const body = {
      department_id: department_data._id,
      name: departmentName,
      description: departmentDescription,
    };

    await fetch(`/api/departments/editDepartment`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        toast({
          title: 'Departamento editado.',
          description: 'El departamento ha sido editado exitosamente.',
          variant: 'left-accent',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });

        onClose();
        reloadDepartments();
      } else if (res.status == 400) {
        toast({
          title: 'Error al editar el departamento.',
          description: data.message,
          variant: 'left-accent',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });

        onClose();
      } else {
        toast({
          title: 'Error al editar el departamento.',
          description: 'Ha ocurrido un error al editar el departamento.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });

        onClose();
      }
    });
  };

  return (
    <>
      {/* // - BOTON - //  */}
      <MenuItem
        icon={<BiEdit />}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        Editar Departamento
      </MenuItem>

      {/* // - MODAL - // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          {/* // - HEADER - // */}
          <ModalHeader>
            <span style={{ fontWeight: 'bold' }}>Editar: </span>{' '}
            {department_data.name}
          </ModalHeader>

          <ModalCloseButton />

          <Divider />

          {/* // - BODY - // */}
          <ModalBody>
            {/* // - INPUT DE NOMBRE - // */}
            <FormControl mt={2}>
              <FormLabel>Nombre:</FormLabel>

              <Input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
            </FormControl>

            {/* // - INPUT DE DESCRIPCION - // */}
            <FormControl mt={2}>
              <FormLabel>Descripcion:</FormLabel>
              <Textarea
                value={departmentDescription}
                onChange={(e) => setDepartmentDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          {/* // - FOOTER - // */}
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>

            <Button colorScheme="green" onClick={editDepartment}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditDepartmentModal;
