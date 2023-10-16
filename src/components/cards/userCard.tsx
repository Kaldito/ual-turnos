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
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { CgDanger } from 'react-icons/cg';

export interface UserCardProps {
  myRol: string;
  user: any;
}

export default function UserCard({ myRol, user }: UserCardProps) {
  const glow = keyframes`
  from {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #fff, 0 0 35px #fff, 0 0 40px #fff, 0 0 50px #fff, 0 0 75px #fff;
  }
  to {
    text-shadow: 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #fff, 0 0 35px #fff, 0 0 40px #fff, 0 0 50px #fff, 0 0 75px #fff, 0 0 100px #fff;
  }
`;

  // ------- USESTATE DECLARATIONS ------- //
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.correo);
  const [rol, setRol] = useState(user.rol);
  const [servicePoint, setServicePoint] = useState(
    user.service_point ? user.service_point : ''
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
    user.service_point ? user.service_point : ''
  );

  const changeUserStatus = () => {};

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
        <FormControl mt={3}>
          <Input
            type="text"
            size={'sm'}
            placeholder="Nombre de usuario"
            value={isEditing ? username : usernamePreview}
            onChange={(e) => setUsernamePreview(e.target.value)}
            autoComplete="off"
            disabled={myRol == 'superadmin' ? !isEditing : true}
          />
        </FormControl>

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
              >
                Guardar
              </Button>
            </>
          ) : (
            <>
              {user.status == 'active' ? (
                <>
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
                  >
                    <Box
                      css={{
                        animation: `${glow} 1s ease-in-out infinite alternate`,
                      }}
                    >
                      Activo
                    </Box>
                  </Button>
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
  );
}
