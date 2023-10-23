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
  Select,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { CgDanger } from 'react-icons/cg';
import DeactivateUserModal from '../modals/users/deactivateUserModal';

export interface UserCardProps {
  myRol: string;
  user: any;
  servicePoints: any;
  reloadUsers: Function;
  validateUser: Function;
}

export default function UserCard({
  myRol,
  user,
  servicePoints,
  reloadUsers,
  validateUser,
}: UserCardProps) {
  // ------- HOOKS ------- //
  const toast = useToast();

  // ----- EFECTO DE BRILLO ----- //
  const glow = keyframes`
  from {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #fff, 0 0 35px #fff, 0 0 40px #fff, 0 0 50px #fff, 0 0 75px #fff;
  }
  to {
    text-shadow: 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #fff, 0 0 35px #fff, 0 0 40px #fff, 0 0 50px #fff, 0 0 75px #fff, 0 0 100px #fff;
  }`;

  // ------- USESTATE DECLARATIONS ------- //
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.correo);
  const [rol, setRol] = useState(user.rol);
  const [servicePoint, setServicePoint] = useState(
    user.servicePoint ? user.servicePoint : ''
  );
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password'); // - Password type [password, text]
  const [hide, setHide] = useState(true); // - Hide or show password [true = hide, false = show]
  const [isEditing, setIsEditing] = useState(false); // - Edit mode [true = edit, false = view]
  const [usernamePreview, setUsernamePreview] = useState(user.username);
  const [emailPreview, setEmailPreview] = useState(user.correo);
  const [rolPreview, setRolPreview] = useState(user.rol);
  const [servicePointPreview, setServicePointPreview] = useState(
    user.servicePoint ? user.servicePoint : ''
  );

  // ------- FUNCION PARA CAMBIAR ESTADO DEL USUARIO ------- //
  const changeUserStatus = async (status: string) => {
    const canProceed = await validateUser();

    if (!canProceed) {
      return;
    }

    fetch(`/api/users/changeUserStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user._id,
        newStatus: status,
      }),
    }).then(async (res) => {
      const data = await res.json();

      if (res.status == 200) {
        toast({
          title: 'Usuario actualizado',
          variant: 'left-accent',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        reloadUsers();
      } else {
        toast({
          title: 'Error al actualizar usuario',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };

  // ------- UPDATE USER ------- //
  const updateUser = async () => {
    const canProceed = await validateUser();

    if (!canProceed) {
      return;
    }

    // - Validar que el usuario o el correo no esten en blanco
    if (username == '' || email == '') {
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
    if (password != '' && password.length < 8) {
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
      rol: rol,
      servicePoint: servicePoint != '' ? servicePoint : null,
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
          setRolPreview(rol);
          setServicePointPreview(servicePoint);
          setPassword('');
          reloadUsers();

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
      setRol(rolPreview);
      setServicePoint(servicePointPreview);
      setPassword('');
    }
  }, [isEditing]);

  // ------- QUITAR PS SI CAMBIA EL ROL ------- //
  useEffect(() => {
    if (rol != 'asesor') {
      setServicePoint('');
    }
  }, [rol]);

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
        h={'100%'}
        maxW={'320px'}
        w={'full'}
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
              bg={'teal'}
              name={user.username}
              src="https://bit.ly/broken-link"
              mb={4}
              pos={'relative'}
            />

            {/* // - NOMBRE DE USUARIO - // */}
            <Heading fontSize={'2xl'} fontFamily={'body'}>
              {user.username}
            </Heading>

            {/* // - ROL - // */}
            <Text fontWeight={600} color={'gray.500'} mb={4}>
              {user.rol}
            </Text>

            {/* // - NOMBRE DE USUARIO - // */}
            {myRol == 'admin' ? null : (
              <>
                <FormControl mt={3}>
                  <Input
                    type="text"
                    size={'sm'}
                    placeholder="Nombre de usuario"
                    value={isEditing ? username : usernamePreview}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="off"
                    disabled={myRol == 'superadmin' ? !isEditing : true}
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
                  placeholder="Contraseña"
                  autoComplete="new-password"
                  value={password}
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

            {/* // - ROL - // */}
            {myRol == 'superadmin' ? (
              <>
                <FormControl mt={3}>
                  <Select
                    title="Selecciona tu Rol..."
                    size="sm"
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="">Selecciona un rol...</option>
                    {myRol == 'superadmin' ? (
                      <option value="admin">Administrador</option>
                    ) : null}
                    <option value="asesor">Asesor de Servicio</option>
                  </Select>
                </FormControl>
              </>
            ) : null}

            {/* // - PUNTO DE SERVICIO - // */}
            {rol == 'admin' ? null : (
              <>
                <FormControl mt={3}>
                  <Select
                    size="sm"
                    value={servicePoint}
                    onChange={(e) => setServicePoint(e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="">Punto de Servicio (opcional)</option>
                    {
                      // - Mapear puntos de servicio
                      servicePoints.map((servicePoint: any) => {
                        return (
                          <option
                            key={`new-${servicePoint._id}`}
                            value={servicePoint._id}
                          >
                            {servicePoint.name}
                          </option>
                        );
                      })
                    }
                  </Select>
                </FormControl>
              </>
            )}

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
                    onClick={
                      // - ACTUALIZAR USUARIO
                      () => {
                        updateUser();
                      }
                    }
                  >
                    Guardar
                  </Button>
                </>
              ) : (
                <>
                  {user.status == 'active' ? (
                    <>
                      <DeactivateUserModal
                        glow={glow}
                        changeUserStatus={changeUserStatus}
                        username={user.username}
                        myRol={myRol}
                        userRol={user.rol}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        flex={1}
                        fontSize={'sm'}
                        rounded={'xl'}
                        bg={'red.500'}
                        color={'white'}
                        boxShadow={
                          '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                        }
                        _hover={{
                          bg: 'red.400',
                        }}
                        _focus={{
                          bg: 'red.400',
                        }}
                        onClick={
                          // - CAMBIAR ESTADO DEL USUARIO
                          () => {
                            if (myRol == 'admin' && user.rol == 'admin') return;

                            changeUserStatus('active');
                          }
                        }
                      >
                        Inactivo
                      </Button>
                    </>
                  )}

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
