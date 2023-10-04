import { Box, Spinner } from '@chakra-ui/react';

export interface ILoaderSpinnerProps {
  paddingY: string;
  size: string;
}

const LoaderSpinner: React.FC<ILoaderSpinnerProps> = ({ paddingY, size }) => {
  return (
    <>
      <Box
        w={'100%'}
        display="flex"
        justifyContent="center"
        style={{ paddingTop: paddingY, paddingBottom: paddingY }}
      >
        <Spinner
          color="green.600"
          size={size}
          thickness="3px"
          emptyColor="gray.200"
        />
      </Box>
    </>
  );
};

export default LoaderSpinner;
