import DepartmentAccordeonItem from '@/components/accordionItems/departmentAccordeonItem';
import NavBar from '@/components/layout/navbar';
import LoaderSpinner from '@/components/loaderSpinner';
import { withSessionSsr } from '@/lib/auth/witSession';
import {
  Accordion,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

export interface DepartmentsPageProps {
  user: any;
}

export const getServerSideProps = withSessionSsr(
  async ({ req, res }: { req: any; res: any }) => {
    const user = req.session.user;

    if (!user) {
      return {
        props: { user: null },
      };
    }

    return {
      props: { user },
    };
  }
);

export default function DepartmentsPage({ user }: DepartmentsPageProps) {
  // - Esta es la pagina de gestion de departamentos para los administradores
  const router = useRouter();
  const toast = useToast();

  // ------- USESTATE DECLARATIONS ------- //
  const [myUser, setMyUser] = useState<any>(null);
  const [departments, setDepartments] = useState<any>(null);
  const [newDepartmentName, setNewDepartmentName] = useState<string>('');
  const [newDepartmentDescription, setNewDepartmentDescription] =
    useState<string>('');

  // ------- OBTENER MI USUARIO ------- //
  const getMyUser = async () => {
    await fetch(`/api/users/getUser?user_id=${user._id}`).then(async (res) => {
      if (res.status == 200) {
        const data = await res.json();

        // - Si el rol del usuario fue actualizado cerrar sesion
        if (
          data.user_data.rol != user.rol ||
          data.user_data.status == 'inactive'
        ) {
          await fetch('/api/logout');
          router.push('/login');
        }

        setMyUser(data.user_data);
      }
    });
  };

  // ------- VALIDAR USUARIO ------- //
  const validateUser = async () => {
    let canProceed = true;

    await fetch(`/api/users/getUser?user_id=${user._id}`).then(async (res) => {
      if (res.status == 200) {
        const data = await res.json();

        // - Si el rol del usuario fue actualizado cerrar sesion
        if (
          data.user_data.rol != user.rol ||
          data.user_data.status == 'inactive'
        ) {
          canProceed = false;
          await fetch('/api/logout');
          router.push('/login');
        }
      }
    });

    return canProceed;
  };

  // ------- CREAR DEPARTAMENTO ------- //
  const createDepartment = async () => {
    const canProceed = await validateUser();

    if (!canProceed) {
      return;
    }

    // - Validar que el nombre del departamento no este vacio
    if (newDepartmentName.trim() == '') {
      toast({
        title: 'Error al crear departamento',
        description: 'El nombre del departamento no puede estar vacio',
        status: 'error',
        variant: 'left-accent',
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // - Validar que la descripcion del departamento no este vacia
    if (newDepartmentDescription.trim() == '') {
      toast({
        title: 'Error al crear departamento',
        description: 'La descripcion del departamento no puede estar vacia',
        status: 'error',
        variant: 'left-accent',
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // - Crear el departamento
    await fetch('/api/departments/createDepartment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newDepartmentName,
        description: newDepartmentDescription,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        setDepartments(null);

        toast({
          title: 'Departamento creado',
          description: 'El departamento fue creado exitosamente',
          status: 'success',
          variant: 'left-accent',
          duration: 3000,
          isClosable: true,
        });

        setNewDepartmentName('');
        setNewDepartmentDescription('');
        getDepartments();
      } else if (res.status == 400) {
        toast({
          title: 'Error al crear departamento',
          description: data.message,
          status: 'error',
          variant: 'left-accent',
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };

  // ------- OBTENER DEPARTAMENTOS ------- //
  const getDepartments = async () => {
    await fetch('/api/departments/getDepartments').then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        setDepartments(data.departments_data);
      } else if (res.status == 400) {
        setDepartments('error');
      }
    });
  };

  // ------- USEEFFECTS ------- //
  useEffect(() => {
    // - If the user is not logged in, redirect to /login
    if (!user || (user.rol != 'admin' && user.rol != 'superadmin')) {
      router.push('/login');

      return;
    }

    getMyUser();
    getDepartments();
  }, []);

  // - If the user is not logged in, redirect to /login
  if (!user || (user.rol != 'admin' && user.rol != 'superadmin')) {
    return <div>Redirecting...</div>;
  }

  // - Page
  return (
    <>
      <Head>
        <title>UAL - Departamentos</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NavBar rol={user.rol} name={user.username} />

        {/* HEADER DE LA PAGINA */}
        <Box>
          <Box h={'70px'} w={'100%'} gap={0}>
            <Flex h={'100%'}>
              <Center>
                <Heading as={'h1'} fontSize={'25px'} fontWeight={'bold'} pl={6}>
                  Gestión de Departamentos
                </Heading>
              </Center>

              <Spacer />

              <Center pe={6}>
                {/* // ---------- AGREGAR DEPARTAMENTO ---------- // */}
                <Popover>
                  {/* // - Boton para agregar departamento */}
                  <PopoverTrigger>
                    <Button colorScheme="blue" gap={3}>
                      <AiOutlinePlus />
                      Agregar Departamento
                    </Button>
                  </PopoverTrigger>

                  {/* // - Formulario para agregar departamento */}
                  <PopoverContent>
                    <PopoverArrow />

                    <PopoverCloseButton />

                    <PopoverHeader fontWeight={'bold'}>
                      Nuevo Departamento
                    </PopoverHeader>

                    <PopoverBody>
                      {/* // - NOMBRE DEL DEPARTAMENTO */}
                      <FormControl mb={3}>
                        <FormLabel>
                          Nombre del Departamento:
                          <span style={{ color: 'red' }}>*</span>
                        </FormLabel>

                        <Input
                          type="text"
                          value={newDepartmentName}
                          onChange={(e) => setNewDepartmentName(e.target.value)}
                          autoComplete="off"
                        />
                      </FormControl>

                      {/* // - DESCRIPCION DEL DEPARTAMENTO */}
                      <FormControl mb={3}>
                        <FormLabel>
                          Descripcion:<span style={{ color: 'red' }}>*</span>
                        </FormLabel>

                        <Textarea
                          value={newDepartmentDescription}
                          onChange={(e) =>
                            setNewDepartmentDescription(e.target.value)
                          }
                        />
                      </FormControl>

                      {/* // - BOTON PARA AGREGAR DEPARTAMENTO */}
                      <Button
                        w={'100%'}
                        colorScheme="green"
                        onClick={createDepartment}
                      >
                        Agregar
                      </Button>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Center>
            </Flex>
          </Box>

          <Box pt={2} px={3}>
            <Divider
              borderWidth={'1px'}
              borderStyle={'solid'}
              borderRadius={10}
              borderColor={'green.500'}
            />
          </Box>
        </Box>

        {/* // ---------- LISTA DE DEPARTAMENTOS ---------- // */}
        <Box pt={6}>
          {departments == null ? (
            <>
              <LoaderSpinner paddingY="15rem" size="xl" />
            </>
          ) : departments == 'error' ? (
            <>No se han dado de alta departamentos...</>
          ) : (
            <>
              <Accordion allowMultiple colorScheme="green">
                {departments.map((department: any) => {
                  return (
                    <DepartmentAccordeonItem
                      key={department._id}
                      department={department}
                      reloadDepartments={getDepartments}
                      validateUser={validateUser}
                    />
                  );
                })}
              </Accordion>
            </>
          )}
        </Box>
      </main>
    </>
  );
}
