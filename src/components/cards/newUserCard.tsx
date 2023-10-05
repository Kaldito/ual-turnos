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
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible, AiOutlinePlus } from 'react-icons/ai';
import { CgDanger } from 'react-icons/cg';

export interface NewUserCardProps {
  userRol: string;
}

export default function NewUserCard({ userRol }: NewUserCardProps) {
  // ------- HOOKS ------- //
  const toast = useToast();

  // ------- USESTATE DECLARATIONS ------- //
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password'); // - Password type [password, text]
  const [hide, setHide] = useState(true); // - Hide or show password [true = hide, false = show]
  const [rol, setRol] = useState('');
  const [servicePoint, setServicePoint] = useState('');

  // ------- FUNCION PARA CREAR USUARIO ------- //
  const createUser = async () => {
    // - Validar campos obligatorios
    if (username == '' || email == '' || password == '' || rol == '') {
      toast({
        title: 'Error al generar usuario',
        variant: 'left-accent',
        description: 'Favor de llenar todos los campos obligatorios',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // - Validar correo valido
    if (!isValidEmail) {
      toast({
        title: 'Error al generar usuario',
        variant: 'left-accent',
        description: 'Favor de ingresar un correo valido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // - Validar contraseña de al menos 8 caracteres
    if (password.length < 8) {
      toast({
        title: 'Error al generar usuario',
        variant: 'left-accent',
        description: 'La contraseña debe tener al menos 8 caracteres',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await fetch('/api/users/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        rol,
        servicePoint,
      }),
    })
      .then(async (res) => {
        const response = await res.json();

        if (res.status == 200) {
          // - Limpiar campos
          setUsername('');
          setEmail('');
          setPassword('');
          setRol('');
          setServicePoint('');

          toast({
            title: 'Usuario generado',
            variant: 'left-accent',
            description: 'El usuario se ha generado correctamente',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else if (res.status == 400) {
          toast({
            title: 'Error al generar usuario',
            variant: 'left-accent',
            description: response.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Error al generar usuario',
            variant: 'left-accent',
            description: 'Ha ocurrido un error al generar el usuario',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        toast({
          title: 'Error al generar usuario',
          variant: 'left-accent',
          description: err,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // ------- ADMIN HANDLER ------- //
  useEffect(() => {
    if (rol == 'admin') {
      setServicePoint('');
    }
  }, [rol]);

  // ------- VERIFICAR EMAIL VALIDO ------- //
  useEffect(() => {
    if (email == '') {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(/\S+@\S+\.\S+/.test(email));
    }
  }, [email]);

  // ------- VER/OCULTAR PASSWORD ------- //
  useEffect(() => {
    if (hide) {
      setPasswordType('password');
    } else {
      setPasswordType('text');
    }
  }, [hide]);

  return (
    <Center py={6}>
      <Box
        maxW={'320px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        textAlign={'center'}
      >
        <Avatar
          size={'xl'}
          bg={'black'}
          icon={<AiOutlinePlus />}
          src="https://bit.ly/broken-link"
          mb={4}
          pos={'relative'}
        />

        <Heading fontSize={'2xl'} fontFamily={'body'}>
          Nuevo Usuario
        </Heading>

        {/* // - NOMBRE DE USUARIO - // */}
        <FormControl mt={3}>
          <Input
            type="text"
            size={'sm'}
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
          />
        </FormControl>

        {/* // - CORREO - // */}
        <FormControl mt={3}>
          <InputGroup>
            <Input
              type="text"
              size={'sm'}
              placeholder="Correo"
              value={email}
              isInvalid={!isValidEmail}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        <FormControl mt={3}>
          <Select
            title="Selecciona tu Rol..."
            size="sm"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="">Selecciona un rol...</option>
            {userRol == 'superadmin' ? (
              <option value="admin">Administrador</option>
            ) : null}
            <option value="asesor">Asesor de Servicio</option>
          </Select>
        </FormControl>

        {/* // - PUNTO DE SERVICIO - // */}
        {rol == 'admin' ? null : (
          <>
            <FormControl mt={3}>
              <Select
                size="sm"
                value={servicePoint}
                onChange={(e) => setServicePoint(e.target.value)}
              >
                <option value="">Punto de Servicio (opcional)</option>
              </Select>
            </FormControl>
          </>
        )}

        {/* // - BOTON DE AGREGAR - // */}
        <Stack mt={3} direction={'row'} spacing={4}>
          <Button
            flex={1}
            fontSize={'sm'}
            rounded={'xl'}
            onClick={createUser}
            bg={'green.500'}
            color={'white'}
            boxShadow={
              '0px 1px 25px -5px rgb(0 0 0 / 48%), 0 10px 10px -5px rgb(0 0 0 / 43%)'
            }
            _hover={{
              bg: 'green.600',
            }}
            _focus={{
              bg: 'green.600',
            }}
          >
            Agregar
          </Button>
        </Stack>
      </Box>
    </Center>
  );
}
