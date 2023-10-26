import {
  Avatar,
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible, AiOutlineUser } from 'react-icons/ai';
import { CgDanger } from 'react-icons/cg';

export interface MyUserCardProps {
  user: any;
  reloadUser: Function;
  validateUser: Function;
}

export default function MyUserCard({
  user,
  reloadUser,
  validateUser,
}: MyUserCardProps) {
  // ------- HOOKS ------- //
  const toast = useToast();

  // ------- USESTATE DECLARATIONS ------- //
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.correo);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password'); // - Password type [password, text]
  const [hide, setHide] = useState(true); // - Hide or show password [true = hide, false = show]
  const [isEditing, setIsEditing] = useState(false); // - Edit mode [true = edit, false = view]
  const [usernamePreview, setUsernamePreview] = useState(user.username);
  const [emailPreview, setEmailPreview] = useState(user.correo);

  // ------- UPDATE USER ------- //
  const updateUser = async () => {
    const canProceed = await validateUser();

    if (!canProceed) {
      return;
    }

    // - Validar que el usuario o el correo no esten en blanco
    if (username.trim() == '' || email.trim() == '') {
      toast({
        title: 'Error al actualizar usuario',
        description:
          'El nombre de usuario o el correo no puede estar en blanco.',
        status: 'error',
        variant: 'left-accent',
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    // - Validar si el email es valido
    if (!isValidEmail) {
      toast({
        title: 'Error al actualizar usuario',
        description: 'El correo no es valido.',
        variant: 'left-accent',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    // - Validar que la contra no se sea menor a ocho si es que se va a cambiar
    if (password.trim() != '' && password.length < 8) {
      toast({
        title: 'Error al actualizar usuario',
        description: 'La nueva contraseña debe tener al menos 8 caracteres.',
        status: 'error',
        variant: 'left-accent',
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    // - Objeto donde se pondran los cambios que se realicen
    const changeObj: any = {
      username: username,
      correo: email,
    };

    // -  Añadir la contraseña solo si se va a cambiar
    if (password != '') {
      changeObj.password = password;
    }

    // - Fetch para actualizar usuario
    await fetch('/api/users/updateUser', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user._id,
        changes: changeObj,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (res.status == 200) {
          setIsEditing(false);
          setUsernamePreview(username);
          setEmailPreview(email);
          setPassword('');
          reloadUser();

          toast({
            title: 'Usuario actualizado',
            description: 'Se ha actualizado el usuario correctamente.',
            variant: 'left-accent',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } else if (res.status == 400) {
          toast({
            title: 'Error al actualizar usuario',
            description: data.message,
            variant: 'left-accent',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Error al actualizar usuario',
            description: 'Ha ocurrido un error al actualizar el usuario.',
            variant: 'left-accent',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: 'Ha ocurrido un error al actualizar el usuario.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });

        console.log(err);
      });
  };

  // ------- ACTIVAR/DESACTIVAR EDICION ------- //
  useEffect(() => {
    if (!isEditing) {
      setUsername(usernamePreview);
      setEmail(emailPreview);
      setHide(true);
      setPassword('');
    }
  }, [isEditing]);

  // ------- VER/OCULTAR PASSWORD ------- //
  useEffect(() => {
    if (hide) {
      setPasswordType('password');
    } else {
      setPasswordType('text');
    }
  }, [hide]);

  // ------- VERIFICAR EMAIL VALIDO ------- //
  useEffect(() => {
    if (email == '') {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(/\S+@\S+\.\S+/.test(email));
    }
  }, [email]);

  return (
    <Center py={6} h={'100%'}>
      <Box
        maxW={'320px'}
        w={'full'}
        h={'100%'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        textAlign={'center'}
      >
        <Center h={'100%'} w={'100%'}>
          <Box w={'100%'}>
            <Avatar
              size={'xl'}
              bg={'green.400'}
              icon={<AiOutlineUser />}
              src="https://bit.ly/broken-link"
              mb={4}
              pos={'relative'}
            />

            <Heading fontSize={'2xl'} fontFamily={'body'}>
              Mi Usuario
            </Heading>

            <Text fontWeight={600} color={'gray.500'} mb={4}>
              {user.username} - {user.rol}
            </Text>

            {/* // - NOMBRE DE USUARIO - // */}
            {user.rol == 'admin' ? null : (
              <>
                <FormControl mt={3}>
                  <Input
                    type="text"
                    size={'sm'}
                    placeholder="Nombre de usuario"
                    value={isEditing ? username : usernamePreview}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={user.rol == 'superadmin' ? !isEditing : true}
                  />
                </FormControl>
              </>
            )}

            {/* // - CORREO - // */}
            <FormControl mt={3}>
              <InputGroup>
                <Input
                  type="text"
                  size={'sm'}
                  placeholder="Correo"
                  value={isEditing ? email : emailPreview}
                  isInvalid={!isValidEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  disabled={!isEditing}
                />

                <InputRightElement pb={2}>
                  <Box color={'red.400'}>
                    {isValidEmail ? (
                      <></>
                    ) : (
                      <>
                        <CgDanger />
                      </>
                    )}
                  </Box>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* // - CONTRASEÑA - // */}
            <FormControl mt={3}>
              <InputGroup>
                <Input
                  type={passwordType}
                  size={'sm'}
                  placeholder="Cambiar contraseña"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!isEditing}
                />

                <InputRightElement pb={2}>
                  <Box
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setHide(!hide);
                    }}
                  >
                    {hide ? (
                      <>
                        <AiFillEyeInvisible />
                      </>
                    ) : (
                      <>
                        <AiFillEye />
                      </>
                    )}
                  </Box>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Stack mt={8} direction={'row'} spacing={4}>
              {isEditing ? (
                <>
                  {/* // - BOTON PARA CANCELAR - // */}
                  <Button
                    flex={1}
                    fontSize={'sm'}
                    rounded={'xl'}
                    _focus={{
                      bg: 'gray.200',
                    }}
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    Cancelar
                  </Button>

                  {/* // - BOTON PARA GUARDAR - // */}
                  <Button
                    flex={1}
                    fontSize={'sm'}
                    rounded={'xl'}
                    bg={'green.500'}
                    color={'white'}
                    boxShadow={
                      '0px 1px 25px -5px rgb(0 0 0 / 48%), 0 10px 10px -5px rgb(0 0 0 / 43%)'
                    }
                    _hover={{
                      bg: 'green.600',
                    }}
                    _focus={{
                      bg: 'green.6  00',
                    }}
                    onClick={updateUser}
                  >
                    Guardar
                  </Button>
                </>
              ) : (
                <>
                  {/* // - BOTON PARA HABILITAR EDICION - // */}
                  <Button
                    flex={1}
                    fontSize={'sm'}
                    rounded={'xl'}
                    bg={'blue.400'}
                    color={'white'}
                    boxShadow={
                      '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                    }
                    _hover={{
                      bg: 'blue.500',
                    }}
                    _focus={{
                      bg: 'blue.500',
                    }}
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    Editar
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Center>
      </Box>
    </Center>
  );
}
