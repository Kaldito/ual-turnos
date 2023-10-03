import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export interface ILogoutButtonProps {}

const LogoutButton: React.FC<ILogoutButtonProps> = ({}) => {
  // -------- HOOKS -------- //
  const router = useRouter();

  return (
    <>
      <Button
        onClick={async () => {
          await fetch('/api/logout');
          router.push('/login');
        }}
      >
        LOGOUT
      </Button>
    </>
  );
};

export default LogoutButton;
