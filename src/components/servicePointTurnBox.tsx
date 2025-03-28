import { CloseIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export interface IServicePointTurnBoxProps {
  servicePointId: string;
}

const ServicePointTurnBox: React.FC<IServicePointTurnBoxProps> = ({
  servicePointId,
}) => {
  // --------- HOOKS --------- //
  const toast = useToast();

  // --------- USESTATE DECLARATIONS --------- //
  const [servicePointData, setServicePointData] = useState<any>(null);
  const [servicePointTurn, setServicePointTurn] = useState<any>(null);

  // --------- OBTENER INFORMACION DEL PUNTO DE SERVICIO --------- //
  const getServicePointData = async () => {
    await fetch(
      `/api/servicePoints/getServicePoint?service_point_id=${servicePointId}`
    ).then(async (res) => {
      const data = await res.json();

      if (res.status == 200) {
        setServicePointData(data.service_point_data);
        getServicePointTurn();
      } else if (res.status == 404) {
        setServicePointData('404');
      } else {
        toast({
          title: 'Error al consultar el punto de servicio',
          description: 'Error desconocido',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    });
  };

  // --------- OBTENER TURNO DEL PUNTO DE SERVICIO --------- //
  const getServicePointTurn = async () => {
    await fetch(`/api/turns/getMyTurn?service_point_id=${servicePointId}`).then(
      async (res) => {
        const data = await res.json();

        console.log(data);

        if (res.status == 200) {
          setServicePointTurn(data.my_turn_data);
        } else if (res.status == 404) {
          setServicePointTurn('404');
        }
      }
    );

    setTimeout(() => {
      getServicePointData();
    }, 2500);
  };

  useEffect(() => {
    getServicePointData();
  }, []);

  return (
    <>
      <Box
        boxShadow={'2xl'}
        borderRadius="md"
        w={'full'}
        h={'100%'}
        bgColor={'white'}
        overflow={'hidden'}
      >
        {servicePointData == null ? (
          <Box>Cargando...</Box>
        ) : servicePointData == '404' ? (
          <Box
            color="black"
            h={'100%'}
            fontWeight={'bold'}
            fontSize={'2xl'}
            bgColor={'red.100'}
          >
            <Center h={'100%'}>
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
            </Center>
          </Box>
        ) : (
          <Box h={'100%'}>
            <Box
              fontWeight="bold"
              p={6}
              h={servicePointData.status == 'closed' ? '100%' : undefined}
            >
              <Center fontSize={'3xl'} h={'100%'}>
                {servicePointData.name}{' '}
                {servicePointData.status == 'closed' ? (
                  <span style={{ color: 'red', marginLeft: '0.5rem' }}>
                    (Cerrado)
                  </span>
                ) : null}
              </Center>
            </Box>

            {servicePointData.status == 'open' ? (
              <>
                {servicePointTurn == null ? (
                  <Box>Cargando...</Box>
                ) : servicePointTurn == '404' ? (
                  <>
                    <Center bgColor={'gray.50'} p={'2.5rem'}>
                      <Box fontSize={'xl'} fontWeight={'bold'} color={'gray'}>
                        Esperando...
                      </Box>
                    </Center>
                  </>
                ) : (
                  <Center bgColor={'gray.50'} p={'2.5rem'}>
                    <Box fontSize={'4xl'} fontWeight={'bold'} color={'black'}>
                      Atendiendo turno: {servicePointTurn.turn}
                    </Box>
                  </Center>
                )}
              </>
            ) : (
              <></>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default ServicePointTurnBox;
