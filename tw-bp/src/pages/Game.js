import { useAuth } from '../hooks/useAuth';
import { Container, Header } from '../components';

/*
  only "authorised" users for this game should be able to save changes
*/

export function Game({ updatePageTitle }) {
  const auth = useAuth();
  return (
    <>
      <Header />
      <Container>Game by id</Container>
    </>
  );
}
