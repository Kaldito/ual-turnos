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
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BiEdit } from 'react-icons/bi';

export interface IEditServicePointModalProps {
  servicePoint_data: any;
  reloadServicePoints: Function;
}

const EditServicePointModal: React.FC<IEditServicePointModalProps> = ({
  servicePoint_data,
  reloadServicePoints,
}) => {
  // ------- HOOKS ------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // ------- USESTATE DECLARATIONS ------- //
  const [servicePointName, setServicePointName] = useState<string>(
    servicePoint_data.name
  );

  // ------- EDITAR DEPARTAMENTO ------- //
  const editServicePoint = async () => {
    if (servicePointName.trim() == '') {
      toast({
        title: 'Error al editar el punto de servicio.',
        description: 'El nombre del punto de servicio no puede estar vacio.',
        variant: 'left-accent',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });

      return;
    }

    const body = {
      service_point_id: servicePoint_data._id,
      name: servicePointName,
    };

    await fetch(`/api/servicePoints/editServicePoint`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        toast({
          title: 'Punto de Servicio editado.',
          description: 'El punto de servicio ha sido editado exitosamente.',
          variant: 'left-accent',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });

        onClose();
        reloadServicePoints();
      } else if (res.status == 400) {
        toast({
          title: 'Error al editar punto de servicio.',
          description: data.message,
          variant: 'left-accent',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });

        onClose();
      } else {
        toast({
          title: 'Error al editar punto de servicio.',
          description: 'Ha ocurrido un error al editar punto de servicio.',
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
        Editar Punton de Servicio
      </MenuItem>

      {/* // - MODAL - // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          {/* // - HEADER - // */}
          <ModalHeader>
            <span style={{ fontWeight: 'bold' }}>Editar: </span>{' '}
            {servicePoint_data.name}
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
                value={servicePointName}
                onChange={(e) => setServicePointName(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          {/* // - FOOTER - // */}
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>

            <Button colorScheme="green" onClick={editServicePoint}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditServicePointModal;
