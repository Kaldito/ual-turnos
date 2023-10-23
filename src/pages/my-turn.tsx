import connectDB from '@/models/mongoConnection';
import Turn from '@/models/mongoSchemas/turnScheme';
import { Box, Center, Heading, Text, VStack } from '@chakra-ui/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface TakeTurnProps {
  turn_data: any;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await connectDB();

  const turn_id = context.query.turn_id;

  const turnFetching = await Turn.findOne({
    _id: turn_id,
    $or: [{ status: 'pending' }, { status: 'attending' }],
  });

  const turn = JSON.parse(JSON.stringify(turnFetching));

  if (!turn) {
    return {
      notFound: true,
    };
  }

  return {
    props: { turn_data: turn },
  };
}

export default function TakeTurn({ turn_data }: TakeTurnProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>UAL - My Turn</title>
        <meta name="description" content="Turn information for UAL" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center h="100vh" bgColor="gray.100">
        <Box w="sm" p={8} rounded="md" bgColor="white" boxShadow="lg">
          <Box
            textAlign={'center'}
            h={'150px'}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <img src="/logo.png" alt="Logo UAL" style={{ height: '100%' }} />
          </Box>
          <VStack spacing={6} align="stretch">
            <Box textAlign={'center'} pt={2}>
              <Heading size="md">Información de tu turno</Heading>
              <Text mt={4} fontSize="xl">
                Tu turno: {turn_data.turn}
              </Text>
              <Text color="gray.500">
                ID: {turn_data._id.slice(turn_data._id.length - 5)}
              </Text>
            </Box>
          </VStack>
        </Box>
      </Center>
    </>
  );
}
