import Navbar from '@/components/layout/navbar';
import { withSessionSsr } from '@/lib/auth/witSession';
import { Box, Button, Spinner, useToast } from '@chakra-ui/react';
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

        {myServicePoint == null ? (
          <>Cargando...</>
        ) : myServicePoint == 'no asignado' ? (
          <>
            No le ha sido asignado un punto de servicio, comuniquese con un
            administrador
          </>
        ) : myServicePoint == 'no disponible' ? (
          <>
            Su punto de servicio esta inhabilitado, comuniquese con un
            administrador
          </>
        ) : (
          <>
            Gestionar mi punto de servicio {myServicePoint.name}
            <Box>
              {myTurn == null ? (
                <>Cargando...</>
              ) : myTurn == '404' ? (
                <>No has tomado un turno</>
              ) : (
                <>{`Atendiendo turno: ${myTurn.turn}`}</>
              )}
            </Box>
            <Box>
              Fila de turnos:{' '}
              <Box>
                {queue == null ? (
                  <>Cargando...</>
                ) : queue == '404' ? (
                  <>No hay turnos en la fila</>
                ) : (
                  <>
                    {queue.map((turn: any) => {
                      return (
                        <>
                          {turn.status == 'pending' ? <>{turn.turn}</> : <></>}
                        </>
                      );
                    })}
                  </>
                )}
              </Box>
            </Box>
            {/* // ---------- ABRIR/CERRAR CAJA ---------- // */}
            <Box>
              {myServicePointStatus == null ? (
                <></>
              ) : myServicePointStatus == 'open' ? (
                <>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      changeServicePointStatus('closed');
                    }}
                  >
                    Cerrar Punto de Servicio
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    colorScheme="green"
                    onClick={() => {
                      changeServicePointStatus('open');
                    }}
                  >
                    Abrir Punto de servicio
                  </Button>
                </>
              )}
            </Box>
            <Box>
              {myServicePointStatus == null ? (
                <></>
              ) : myServicePointStatus == 'open' ? (
                <>
                  {loadingButton ? (
                    <>
                      <Button>
                        <Spinner size={'sm'} mx={5} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={getATurn}>Atender Turno</Button>
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
            </Box>
          </>
        )}
      </main>
    </>
  );
}
