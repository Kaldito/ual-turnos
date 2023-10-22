import { Box, useToast } from '@chakra-ui/react';
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
      <Box>
        {servicePointData == null ? (
          <>Cargando...</>
        ) : servicePointData == '404' ? (
          <>Punto de servicio Inhabilitado...</>
        ) : (
          <>
            <Box>
              {servicePointData.name} {servicePointData.status}
              {servicePointData.status == 'open' ? (
                <>
                  {servicePointTurn == null ? (
                    <>Cargando...</>
                  ) : servicePointTurn == '404' ? (
                    <>Esperando...</>
                  ) : (
                    <>
                      <Box>{servicePointTurn.turn}</Box>
                    </>
                  )}
                </>
              ) : null}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default ServicePointTurnBox;
