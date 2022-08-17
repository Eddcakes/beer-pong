import { useQuery } from 'react-query';
import { fetchParticipantsByTournamentId } from '../../queries/fetchParticipantsByTournamentId';

export function Participants({ tournamentId }) {
  const { data, isLoading } = useQuery(
    ['participantsByTournamentId', tournamentId],
    () => fetchParticipantsByTournamentId(tournamentId)
  );
  return (
    <div>
      {isLoading && <div>loading games...</div>}
      {data?.map((participant) => {
        return <div key={participant.id}>{participant.player_name}</div>;
      })}
    </div>
  );
}
