import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from '@chakra-ui/react';
import { AiFillSetting, AiFillUnlock, AiOutlinePlus } from 'react-icons/ai';
import DeactivateDepartmentModal from '../modals/department/deactivateDepartmentModal';
import EditDepartmentModal from '../modals/department/editDepartmentModal';

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

  return (
    <>
      <AccordionItem key={department._id}>
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
                  <MenuItem
                    icon={<AiOutlinePlus />}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Crear Punto de Servicio
                  </MenuItem>

                  {department.available ? (
                    <>
                      {/* // - DESACTIVAR DEPARTAMENTO - // */}
                      <DeactivateDepartmentModal
                        department_data={department}
                        reloadDepartments={reloadDepartments}
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
        <AccordionPanel pb={4}>{department.description}</AccordionPanel>
      </AccordionItem>
    </>
  );
};

export default DepartmentAccordeonItem;
