import LoaderSpinner from '@/components/loaderSpinner';
import ServicePointTurnBox from '@/components/servicePointTurnBox';
import connectDB from '@/models/mongoConnection';
import Department from '@/models/mongoSchemas/departmentSchema';
import { WarningTwoIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface TakeTurnProps {
  department: any;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await connectDB();

  const department = context.params?.department;

  const validateDepartment = await Department.findOne({
    name: department,
    available: true,
  });

  if (!validateDepartment) {
    return {
      notFound: true,
    };
  }

  return {
    props: { department: JSON.parse(JSON.stringify(validateDepartment)) },
  };
}

export default function TakeTurn({ department }: TakeTurnProps) {
  // --------- HOOKS --------- //
  const router = useRouter();
  const toast = useToast();

  const [queue, setQueue] = useState<any>(null);
  const [servicePoints, setServicePoints] = useState<any>(null);

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

  // --------- OBTENER LOS PUNTOS DE SERVICIO --------- //
  const getServicePoints = async () => {
    await fetch(
      `/api/servicePoints/getDepartmentServicePoints?department_id=${department._id}`
    ).then(async (res) => {
      const data = await res.json();

      if (res.status == 200) {
        setServicePoints(data.service_points_data);
      } else if (res.status == 404) {
        setServicePoints('404');
      } else if (res.status == 400) {
        setServicePoints('400');
      } else {
        toast({
          title: 'Error al consultar los puntos de servicio',
          description: 'Error desconocido',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    });
  };

  // --------- USE EFFECT --------- //
  useEffect(() => {
    getQueue();
    getServicePoints();
  }, []);

  return (
    <>
      <Head>
        <title>UAL - See turns</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box h={'100vh'} bgColor={'gray.100'}>
          <Flex
            as="header"
            justifyContent="center"
            alignItems="center"
            p={5}
            borderBottom="1px"
            borderColor="gray.200"
            h={'10vh'}
          >
            <Text fontWeight="bold" fontSize="4xl">
              {department.name}
            </Text>
          </Flex>

          <Box h={'90vh'}>
            <Grid
              h={'100%'}
              templateColumns={'repeat(4, 1fr)'}
              w={'100%'}
              overflow={'hidden'}
            >
              {/* Queue */}
              <GridItem>
                <Box flex={1} p={5} mr={2} overflow={'hidden'} h={'100%'}>
                  {queue == null ? (
                    <LoaderSpinner size="xl" paddingY="2rem" />
                  ) : queue == '404' ? (
                    <>
                      <Center h={'100%'}>
                        <Box textAlign="center" py={10} px={6}>
                          <WarningTwoIcon
                            boxSize={'50px'}
                            color={'orange.300'}
                          />
                          <Heading as="h2" size="xl" mt={6} mb={2}>
                            No hay turnos de momento...
                          </Heading>
                          <Text color={'gray.500'}>
                            No hay turnos en la fila de espera, sea el primero
                            en tomar un turno.
                          </Text>
                        </Box>
                      </Center>
                    </>
                  ) : (
                    <>
                      <Center>
                        <VStack spacing={3} w="90%" rounded="xl">
                          {queue.map((turn: any, i: any) => (
                            <Box
                              key={turn._id}
                              p={5}
                              w="100%"
                              fontSize="3xl"
                              boxShadow="xl"
                              fontWeight={i == 0 ? 'bold' : 'medium'}
                              bgColor={i == 0 ? 'green.100' : 'white'}
                              borderRadius="lg"
                              borderWidth={i == 0 ? '2px' : '1px'}
                              borderColor={i == 0 ? 'green.500' : 'gray.300'}
                              textAlign="center"
                              transition="all 0.5s ease-out"
                              opacity="0"
                              transform="translateY(-20px)"
                              onAnimationEnd={(e) => {
                                e.currentTarget.style.opacity = '1';
                                e.currentTarget.style.animation =
                                  'pulseIdle 5s infinite';
                              }}
                              animation="fadeInMove 0.5s forwards"
                            >
                              {i == 0 ? 'Siguiente:  ' : null}
                              {turn.turn}
                            </Box>
                          ))}
                        </VStack>
                      </Center>
                    </>
                  )}
                </Box>
              </GridItem>

              {/* Service Points */}
              <GridItem colSpan={3}>
                <Box flex={1} borderRadius="md" px={5} ml={2} h={'90vh'}>
                  <Center h={'100%'} w={'100%'}>
                    <Box w={'100%'}>
                      <Grid
                        templateColumns={'repeat(2, 1fr)'}
                        gap={3}
                        h={'100%'}
                      >
                        {servicePoints == null ? (
                          <Box>Cargando...</Box>
                        ) : servicePoints == '400' ? (
                          <Box>
                            No se han creado puntos de servicio para este
                            departamento
                          </Box>
                        ) : (
                          servicePoints.map((servicePoint: any) =>
                            servicePoint.available ? (
                              <>
                                <GridItem h={'100%'}>
                                  <ServicePointTurnBox
                                    key={servicePoint._id}
                                    servicePointId={servicePoint._id}
                                  />
                                </GridItem>
                              </>
                            ) : null
                          )
                        )}
                      </Grid>
                    </Box>
                  </Center>
                </Box>
              </GridItem>
            </Grid>
          </Box>
        </Box>
      </main>

      <style jsx global>{`
        @keyframes pulseIdle {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.996);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fadeInMove {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
