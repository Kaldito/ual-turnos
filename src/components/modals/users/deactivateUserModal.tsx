import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';

export interface IDeactivateUserModalProps {
  glow: string;
  changeUserStatus: Function;
  username: string;
  myRol: string;
  userRol: string;
}

const DeactivateUserModal: React.FC<IDeactivateUserModalProps> = ({
  glow,
  changeUserStatus,
  username,
  myRol,
  userRol,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* // ------ BOTON DE ESTADO DEL USUARIO ------ // */}
      <Button
        flex={1}
        fontSize={'sm'}
        rounded={'xl'}
        bg={'green.400'}
        color={'white'}
        boxShadow={
          '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
        }
        _hover={{
          bg: 'green.300',
        }}
        _focus={{
          bg: 'green.300',
        }}
        onClick={() => {
          if (myRol == 'admin' && userRol == 'admin') return;

          onOpen();
        }}
      >
        <Box
          css={{
            animation: `${glow} 1s ease-in-out infinite alternate`,
          }}
        >
          Activo
        </Box>
      </Button>

      {/* // ------ MODAL DE DESACTIVAR USUARIO ------ // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={'red'} fontWeight={'bold'}>
            Desactivar Usuario
          </ModalHeader>

          <ModalCloseButton />

          <Divider />

          <ModalBody>
            El usuario <span style={{ fontWeight: 'bold' }}>{username}</span> se
            desactivara, lo cual cerrara la sesion de este usuario y no podra
            volverla a iniciar hasta que se vuelva a activar.
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>

            <Button
              colorScheme="red"
              onClick={
                // - CAMBIAR ESTADO DEL USUARIO
                () => {
                  changeUserStatus('inactive');
                  onClose();
                }
              }
            >
              Desactivar usuario
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeactivateUserModal;
