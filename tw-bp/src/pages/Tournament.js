import { useParams } from 'react-router-dom';

import {
  Container,
  Header,
  TournamentList,
  TournamentDetail,
  Button,
} from '../components';
import { usePageTitle } from '../hooks/usePageTitle';

export function Tournament() {
  const { tournamentId } = useParams();
  usePageTitle(`Tournament ${tournamentId ? `: ${tournamentId}` : 'list'}`);
  return (
    <>
      <Header />
      <Container>
        {tournamentId ? (
          <TournamentDetail id={tournamentId} />
        ) : (
          <>
            <div className='text-center'>
              <Button text='New Tournament' to='/tournaments/new' />
            </div>
            <TournamentList />
          </>
        )}
      </Container>
    </>
  );
}
