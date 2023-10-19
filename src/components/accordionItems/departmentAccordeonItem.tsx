import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Divider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AiFillSetting, AiFillUnlock } from 'react-icons/ai';
import LoaderSpinner from '../loaderSpinner';
import DeactivateDepartmentModal from '../modals/department/deactivateDepartmentModal';
import EditDepartmentModal from '../modals/department/editDepartmentModal';
import DeactivateServicePointModal from '../modals/servicePoint/deactivateServicePointModal';
import EditServicePointModal from '../modals/servicePoint/editServicePointModal';
import NewServicePointModal from '../modals/servicePoint/newServicePointModal';

export interface IDepartmentAccordeonItemProps {
  department: any;
  reloadDepartments: Function;
}

const DepartmentAccordeonItem: React.FC<IDepartmentAccordeonItemProps> = ({
  department,
  reloadDepartments,
}) => {
  // ------- HOOKS ------- //
  const toast = useToast();

  // ------- USESTATE DECLARATIONS ------- //
  const [servicePoints, setServicePoints] = useState<any>(null);

  // ------- ACTIVAR DEPARTAMENTO ------- //
  const activateDepartment = async () => {
    await fetch(`/api/departments/activateDepartment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        department_id: department._id,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        toast({
          title: 'Departamento activado.',
          description: `El departamento ${department.name} ha sido activado.`,
          status: 'success',
          variant: 'left-accent',
          duration: 5000,
          isClosable: true,
        });

        reloadDepartments();
        getServicePoints();
      } else {
        toast({
          title: 'Error al activar el departamento.',
          description: `Ha ocurrido un error al activar el departamento ${department.name}.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    });
  };

  // ------- ACTIVAR PUNTO DE SERVICIO ------- //
  const activateServicePoint = async (servicePoint: any) => {
    await fetch(`/api/servicePoints/activateServicePoint`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_point_id: servicePoint._id,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        toast({
          title: 'Punto de servicio activado.',
          description: `El punto de servicio ${servicePoint.name} ha sido activado.`,
          status: 'success',
          variant: 'left-accent',
          duration: 5000,
          isClosable: true,
        });

        reloadDepartments();
        getServicePoints();
      } else {
        toast({
          title: 'Error al activar el punto de servicio.',
          description: `Ha ocurrido un error al activar el punto de servicio ${servicePoint.name}.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    });
  };

  // ------- OBTENER PUNTOS DE SERVICIO ------- //
  const getServicePoints = async () => {
    setServicePoints(null);

    await fetch(
      `/api/servicePoints/getDepartmentServicePoints?department_id=${department._id}`
    ).then(async (res) => {
      const data = await res.json();
      if (res.status == 200) {
        setServicePoints(data.service_points_data);
      } else {
        setServicePoints('error');
      }
    });
  };

  return (
    <>
      <AccordionItem
        key={department._id}
        onClick={() => {
          if (servicePoints == null) getServicePoints();
        }}
      >
        {/* // - TITULO DEL ACORDEON - // */}
        <h2>
          <AccordionButton>
            <AccordionIcon me={3} />

            {/* // - NOMBRE DEL DEPARTAMENTO - // */}
            <Box as="span" flex="1" textAlign="left">
              {department.name}{' '}
              {!department.available ? (
                <>
                  <Badge ms={2} colorScheme="red">
                    Desactivado
                  </Badge>
                </>
              ) : (
                <></>
              )}
            </Box>

            {/* // - BOTON DE OPCIONES - // */}
            <Box>
              <Menu>
                <MenuButton
                  as={Button}
                  colorScheme={'green'}
                  onClick={(e) => e.stopPropagation()}
                >
                  <AiFillSetting />
                </MenuButton>

                <MenuList>
                  {/* // - EDITAR DEPARTAMENTO - // */}
                  <EditDepartmentModal
                    department_data={department}
                    reloadDepartments={reloadDepartments}
                  />

                  {/* // - CREAR PUNTO DE SERVICIO - // */}
                  <NewServicePointModal
                    department_data={department}
                    reloadServicePoints={getServicePoints}
                  />

                  {department.available ? (
                    <>
                      {/* // - DESACTIVAR DEPARTAMENTO - // */}
                      <DeactivateDepartmentModal
                        department_data={department}
                        reloadDepartments={reloadDepartments}
                        reloadServicePoints={getServicePoints}
                      />
                    </>
                  ) : (
                    <>
                      {/* // - ACTIVAR DEPARTAMENTO - // */}
                      <MenuItem
                        icon={<AiFillUnlock />}
                        onClick={(e) => {
                          e.stopPropagation();
                          activateDepartment();
                        }}
                        color={'green'}
                      >
                        Activar Departamento
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
            </Box>
          </AccordionButton>
        </h2>

        {/* // - CONTENIDO DEL ARCODEON - // */}
        <AccordionPanel pb={4}>
          <Box>{department.description}</Box>

          <Divider my={3} />

          <Box>
            <Box fontWeight={'bold'}>Puntos de Servicio:</Box>

            {/* // - LISTA DE PUNTOS DE SERVICIO - // */}
            <Box>
              {servicePoints == null ? (
                <>
                  <LoaderSpinner paddingY="5rem" size="xl" />
                </>
              ) : servicePoints == 'error' ? (
                <>No se han creado puntos de servicio...</>
              ) : (
                <>
                  <Table colorScheme="green">
                    <Thead>
                      <Tr>
                        <Th>Nombre</Th>
                        <Th>Disponibilidad</Th>
                        <Th>Estado</Th>
                        <Th isNumeric>Opciones</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {servicePoints.map((servicePoint: any) => (
                        <Tr key={servicePoint._id}>
                          {/* // - NOMBRE DEL PUNTO DE SERVICIO - // */}
                          <Td>{servicePoint.name}</Td>

                          {/* // - DISPONIBILIDAD DEL PUNTO DE SERVICIO - // */}
                          <Td fontWeight={'bold'}>
                            {!department.available ? (
                              <>
                                <span style={{ color: 'red' }}>
                                  DEPARTAMENTO DESACTIVADO
                                </span>
                              </>
                            ) : servicePoint.available ? (
                              <span style={{ color: 'green' }}>Activo</span>
                            ) : (
                              <span style={{ color: 'red' }}>Bloqueado</span>
                            )}
                          </Td>

                          {/* // - ESTADO DEL PUNTO DE SERVICIO - // */}
                          <Td fontWeight={'bold'}>
                            {servicePoint.status == 'open' ? (
                              <span style={{ color: 'green' }}>Abierto</span>
                            ) : (
                              <span style={{ color: 'red' }}>Cerrado</span>
                            )}
                          </Td>

                          {/* // - BOTON DE OPCIONES - // */}
                          <Td isNumeric>
                            <Menu>
                              <MenuButton
                                as={Button}
                                colorScheme={'green'}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <AiFillSetting />
                              </MenuButton>

                              <MenuList>
                                {/* // - EDITAR PUNTO DE SERVICIO - // */}
                                <EditServicePointModal
                                  servicePoint_data={servicePoint}
                                  reloadServicePoints={getServicePoints}
                                />

                                {department.available ? (
                                  <>
                                    {servicePoint.available ? (
                                      <>
                                        {/* // - DESACTIVAR PUNTO DE SERVICIO - // */}
                                        <DeactivateServicePointModal
                                          servicePoint_data={servicePoint}
                                          reloadServicePoints={getServicePoints}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        {/* // - ACTIVAR PUNTO DE SERVICIO - // */}
                                        <MenuItem
                                          icon={<AiFillUnlock />}
                                          color={'green'}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            activateServicePoint(servicePoint);
                                          }}
                                        >
                                          Activar Punto de Servicio
                                        </MenuItem>
                                      </>
                                    )}
                                  </>
                                ) : null}
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </>
              )}
            </Box>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </>
  );
};

export default DepartmentAccordeonItem;
