import { useEffect } from 'react';

import { Header, Container } from '../components';
import { useAuth } from '../hooks/useAuth';

export function Unauthorised({ updatePageTitle }) {
  const { user } = useAuth();
  useEffect(() => {
    updatePageTitle('Unauthorised');
  }, [updatePageTitle]);
  return (
    <>
      <Header />
      <Container maxW='max-w-screen-md'>
        <h2 className='text-5xl font-bold'>Unauthorised ⛔</h2>
        <div>
          Unfortunately you do not have the access level in order to reach this
          resource.
        </div>
        <p>
          You are currently signed in as{' '}
          <span className='bg-sec-background font-semibold px-1'>
            {user?.username}
          </span>
          .
        </p>
        <p>
          If you think you are logged in as the correct user and should have
          access to this resource please ask the admin.
        </p>
      </Container>
    </>
  );
}
