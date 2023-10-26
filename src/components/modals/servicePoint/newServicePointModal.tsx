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
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

export interface INewServicePointModalProps {
  department_data: any;
  reloadServicePoints: Function;
}

const NewServicePointModal: React.FC<INewServicePointModalProps> = ({
  department_data,
  reloadServicePoints,
}) => {
  // ------- HOOKS ------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // ------- USESTATE DECLARATIONS ------- //
  const [servicePointName, setServicePointName] = useState<string>('');

  // ------- CREAR PUNTO DE SERVICIO ------- //
  const createServicePoint = async () => {
    if (servicePointName.trim() == '') {
      toast({
        title: 'Error al crear el punto de servicio.',
        description: `El nombre del punto de servicio no puede estar vacio.`,
        variant: 'left-accent',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    await fetch(`/api/servicePoints/createServicePoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        department_id: department_data._id,
        name: servicePointName.trim(),
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        toast({
          title: 'Punto de Servicio creado.',
          description: `El punto de servicio ha sido creado.`,
          status: 'success',
          variant: 'left-accent',
          duration: 5000,
          isClosable: true,
        });

        onClose();
        reloadServicePoints();
      } else if (res.status == 400) {
        toast({
          title: 'Error al crear el punto de servicio.',
          description: data.message,
          variant: 'left-accent',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error al crear el punto de servicio.',
          description: `Ha ocurrido un error al crear el punto de servicio.`,
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
      {/* // - CREAR PUNTO DE SERVICIO - // */}
      <MenuItem
        icon={<AiOutlinePlus />}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        Crear Punto de Servicio
      </MenuItem>

      {/* // - MODAL - // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          {/* // - HEADER - // */}
          <ModalHeader>
            <span style={{ fontWeight: 'bold' }}>Crear Punto de Servicio </span>
          </ModalHeader>

          <ModalCloseButton />

          <Divider />

          {/* // - BODY - // */}
          <ModalBody>
            <Text mb={3} fontWeight={'bold'} color={'green'}>
              Departamento actual: {department_data.name}
            </Text>

            <Text fontSize={'0.9rem'}>
              El <span style={{ fontWeight: 'bold' }}>Punto de Servicio</span>{' '}
              creado se tendrá que asignar a todos los asesores para los que se
              desee que esté disponible desde la página de gestión usuarios.
            </Text>

            <Text mt={2} fontSize={'0.9rem'} color={'red'} fontWeight={'bold'}>
              Solo puede haber un máximo de 6 puntos de servicio por
              departamento.
            </Text>

            {/* // - NOMBRE DEL PUNTO DE SERVICIO - // */}
            <FormControl mt={3}>
              <FormLabel>
                Nombre del Punto de Servicio:
                <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
              </FormLabel>

              <Input
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

            <Button colorScheme="green" onClick={createServicePoint}>
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewServicePointModal;
