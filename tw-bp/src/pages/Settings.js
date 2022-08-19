import {
  Card,
  Container,
  Header,
  MobileSpacer,
  ThemeSwitcher,
  UserPreferences,
} from '../components';
import { UpdatePassword } from '../components/forms/UpdatePassword';
import { usePageTitle } from '../hooks/usePageTitle';

export function Settings() {
  usePageTitle('Settings');
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
      <MobileSpacer />
    </>
  );
}
