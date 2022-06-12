import { useEffect } from 'react';

import {
  Card,
  Container,
  Header,
  ThemeSwitcher,
  UserPreferences,
} from '../components';
import { UpdatePassword } from '../components/forms/UpdatePassword';

export function Settings({ updatePageTitle }) {
  useEffect(() => {
    updatePageTitle('Settings');
  }, [updatePageTitle]);
  return (
    <>
      <Header />
      <Container>
        <Card title='Local browser preferences'>
          <ThemeSwitcher />
        </Card>
        <Card title='My preferences'>
          <UserPreferences />
        </Card>
        <Card title='Account details'>
          <UpdatePassword />
        </Card>
      </Container>
    </>
  );
}
