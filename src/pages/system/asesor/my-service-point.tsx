import Navbar from '@/components/layout/navbar';
import { withSessionSsr } from '@/lib/auth/witSession';
import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface AsesorServicePointProps {
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

export default function AsesorServicePoint({ user }: AsesorServicePointProps) {
  // - Esta pagina donde el asesor podra gestionar su punto de servicio
  const router = useRouter();
  const toast = useToast();

  // ------- USESTATE DECLARATIONS ------- //
  const [myUser, setMyUser] = useState<any>(null);
  const [myServicePoint, setMyServicePoint] = useState<any>(null);
  const [myServicePointStatus, setMyServicePointStatus] = useState<any>(null);
  const [myTurn, setMyTurn] = useState<any>(null);
  const [department, setDepartment] = useState<any>(null);
  const [queue, setQueue] = useState<any>(null);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

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

  // ------- OBTENER MI PUNTO DE SERVICIO ------- //
  const getMyServicePoint = async (getType: string) => {
    // - getType puede ser servicePoint o servicePointStatus
    let available = true;
    let canTakeTurn = true;

    if (myUser.servicePoint == undefined || myUser.servicePoint == null) {
      setMyServicePoint('no asignado');

      return;
    }

    await fetch(
      `/api/servicePoints/getServicePoint?service_point_id=${myUser.servicePoint}`
    ).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        if (getType == 'servicePoint') {
          setMyServicePoint(data.service_point_data);
        } else if (getType == 'servicePointStatus') {
          setMyServicePointStatus(data.service_point_data.status);
        }

        if (data.service_point_data.status == 'closed') {
          canTakeTurn = false;
        }
      } else if (res.status == 404) {
        setMyServicePoint('no disponible');
        available = false;
      }
    });

    if (getType == 'servicePointStatus') {
      return canTakeTurn;
    }

    return available;
  };

  // ------- CAMBIAR EL ESTADO DEL PUNTO DE SERVICIO ------- //
  const changeServicePointStatus = async (status: string) => {
    const canProceed = await validateUser();

    if (!canProceed) {
      return;
    }

    let available = await getMyServicePoint('servicePoint');

    if (!available) {
      return;
    }

    await fetch('/api/servicePoints/changeStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_point_id: myUser.servicePoint,
        newStatus: status,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        getMyServicePoint('servicePointStatus');
        getMyTurn();
      } else {
        toast({
          title: data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };

  // ------- OBTENER UN TURNO ------- //
  const getATurn = async () => {
    setLoadingButton(true);

    const canProceed = await validateUser();

    if (!canProceed) {
      return;
    }

    let available = await getMyServicePoint('servicePoint');
    let isOpen = await getMyServicePoint('servicePointStatus');

    if (!isOpen) {
      toast({
        title: 'El punto de servicio ha sido cerrado por otro asesor.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });

      setLoadingButton(false);

      return;
    }

    if (!available) {
      return;
    }

    await fetch(
      `/api/turns/getATurn?service_point_department=${myServicePoint.department}&service_point_id=${myServicePoint._id}&my_user_id=${myUser._id}`
    ).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        getMyTurn();
      } else if (res.status == 404) {
        toast({
          title: data.message,
          status: 'error',
          variant: 'left-accent',
          duration: 3000,
          isClosable: true,
        });
      }
    });

    setTimeout(() => {
      setLoadingButton(false);
    }, 500);
  };

  // ------- OBTENER MI TURNO ------- //
  const getMyTurn = async () => {
    if (department != null) {
      getQueue();
    }

    await fetch(
      `/api/turns/getMyTurn?service_point_id=${myServicePoint._id}`
    ).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        setMyTurn(data.my_turn_data);
      } else if (res.status == 404) {
        setMyTurn('404');
      }
    });
  };

  // --------- OBTENER LA FILA DE TURNOS --------- //
  const getQueue = async () => {
    await fetch(`/api/getQueue?department_name=${department.name}`).then(
      async (res) => {
        const data = await res.json();

        if (res.status == 200) {
          setQueue(data.queue_data);
        } else if (res.status == 404) {
          setQueue('404');
        } else if (res.status == 400) {
          toast({
            title: 'Error al consultar la fila',
            description: data.message,
            variant: 'left-accent',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Error al consultar la fila',
            description: 'Error desconocido',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      }
    );

    setTimeout(() => {
      getQueue();
    }, 5000);
  };

  const getMyDepartment = async () => {
    await fetch(
      `/api/departments/getDepartment?department_id=${myServicePoint.department}`
    ).then(async (res) => {
      const data = await res.json();

      if (res.status == 200) {
        setDepartment(data.department_data);
      }
    });
  };

  // ------- USEEFFECTS ------- //
  useEffect(() => {
    // - If the user is not logged in, redirect to /login
    if (!user || user.rol != 'asesor') {
      router.push('/login');

      return;
    }

    getMyUser();
  }, []);

  // ------- OBTENER EL PS CUANDO CAMBIO EL USER ------- //
  useEffect(() => {
    if (myUser != null) {
      getMyServicePoint('servicePoint');
      getMyServicePoint('servicePointStatus');
    }
  }, [myUser]);

  useEffect(() => {
    if (myServicePoint != null) {
      getMyDepartment();
      getMyTurn();
    }
  }, [myServicePoint]);

  useEffect(() => {
    if (department != null) {
      getQueue();
    }
  }, [department]);

  // - If the user is not logged in, redirect to /login
  if (!user || user.rol != 'asesor') {
    return <div>Redirecting...</div>;
  }

  return (
    <>
      <Head>
        <title>UAL - Asesor</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Navbar rol={user.rol} name={user.username} />

        <VStack height="calc(100vh - 60px)" spacing={1} paddingX={8}>
          <Center flexGrow={1}>
            <Heading size="lg" fontWeight={'bold'}>
              {myServicePoint && myServicePoint.name}
            </Heading>
          </Center>

          <Stack
            direction={['column', 'row']}
            flexGrow={3}
            width="100%"
            spacing={4}
            divider={<Divider orientation="vertical" />}
          >
            <Box
              flex="1"
              textAlign="center"
              p={5}
              border="1px"
              boxShadow={'xl'}
              borderColor="gray.200"
              borderRadius="md"
              h={'100%'}
            >
              {myTurn == null ? (
                'Cargando...'
              ) : myTurn == '404' ? (
                <Center w={'100%'} h={'100%'}>
                  <Box textAlign="center" py={10} px={6} w={'100%'}>
                    <Box display="inline-block">
                      <Flex
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        bg={'red.500'}
                        rounded={'50px'}
                        w={'55px'}
                        h={'55px'}
                        textAlign="center"
                      >
                        <CloseIcon boxSize={'20px'} color={'white'} />
                      </Flex>
                    </Box>
                    <Heading as="h2" size="xl" mt={6} mb={2}>
                      No esta atendiendo un turno actualmente...
                    </Heading>
                  </Box>
                </Center>
              ) : (
                <Center w={'100%'} h={'100%'}>
                  <Box textAlign="center" w={'100%'}>
                    <Heading as="h2" size="xl" mb={2}>
                      Atendiendo Turno: {myTurn.turn}
                    </Heading>
                    <Text color={'gray.500'}>
                      ID del turno: {myTurn._id.slice(myTurn._id.length - 5)}
                    </Text>
                  </Box>
                </Center>
              )}
            </Box>

            <Box
              flex="1"
              textAlign="center"
              p={5}
              border="1px"
              boxShadow={'xl'}
              borderColor="gray.200"
              borderRadius="md"
              h={'100%'}
              overflow={'hidden'}
            >
              <Text fontSize="2xl" fontWeight="bold">
                Fila de turnos
              </Text>

              <VStack mt={2} spacing={2} overflow={'hidden'}>
                {queue == null ? (
                  'Cargando...'
                ) : queue == '404' ? (
                  'No hay turnos en la fila'
                ) : (
                  <>
                    {queue.map((turn: any, i: any) => {
                      return turn.status == 'pending' && i < 7 ? (
                        <Box
                          key={turn._id}
                          p={2}
                          fontSize="xl"
                          w={'25%'}
                          boxShadow="xl"
                          fontWeight={i == 0 ? 'bold' : 'medium'}
                          bgColor={i == 0 ? 'green.100' : 'white'}
                          borderRadius="lg"
                          borderWidth={i == 0 ? '2px' : '1px'}
                          borderColor={i == 0 ? 'green.500' : 'gray.300'}
                          textAlign="center"
                        >
                          {turn.turn}
                        </Box>
                      ) : null;
                    })}

                    {queue.length > 8 ? (
                      <>
                        <Box
                          key={'more'}
                          p={2}
                          fontSize="xl"
                          w={'25%'}
                          boxShadow="xl"
                          fontWeight={'medium'}
                          bgColor={'white'}
                          borderRadius="lg"
                          borderWidth={'1px'}
                          borderColor={'gray.300'}
                          textAlign="center"
                        >
                          {queue.length - 7} mas...
                        </Box>
                      </>
                    ) : queue.length == 8 ? (
                      <>
                        <Box
                          key={queue[7]._id}
                          p={2}
                          fontSize="xl"
                          w={'25%'}
                          boxShadow="xl"
                          fontWeight={'medium'}
                          bgColor={'white'}
                          borderRadius="lg"
                          borderWidth={'1px'}
                          borderColor={'gray.300'}
                          textAlign="center"
                        >
                          {queue[7].turn}
                        </Box>
                      </>
                    ) : null}
                  </>
                )}
              </VStack>
            </Box>
          </Stack>

          <Flex width="100%" justify="space-between" paddingY={6}>
            {myServicePointStatus == 'open' && (
              <Button isLoading={loadingButton} onClick={getATurn} size={'lg'}>
                Atender Turno
              </Button>
            )}

            {myServicePointStatus == 'open' ? (
              <Button
                colorScheme="red"
                size={'lg'}
                onClick={() => changeServicePointStatus('closed')}
              >
                Cerrar Punto de Servicio
              </Button>
            ) : (
              <Button
                colorScheme="green"
                size={'lg'}
                ml="auto"
                onClick={() => changeServicePointStatus('open')}
              >
                Abrir Punto de servicio
              </Button>
            )}
          </Flex>
        </VStack>
      </main>
    </>
  );
}
