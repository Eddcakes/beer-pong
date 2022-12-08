import { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchPlayers } from '../../queries';
import { fetchParticipantsByTournamentId } from '../../queries/fetchParticipantsByTournamentId';
import { Button } from '../Button';
import { PlayerPickerMultiple } from '../PlayerPickerMultiple';

export function Participants({ tournamentId }) {
  const { data, isLoading } = useQuery(
    ['participantsByTournamentId', tournamentId],
    () => fetchParticipantsByTournamentId(tournamentId)
  );
  const { data: players, isLoading: isLoadingPlayers } = useQuery(
    ['players'],
    fetchPlayers,
    { enabled: true }
  );
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const handleSelectPlayer = (evt, playerId) => {
    setSelectedPlayers((prev) => {
      if (prev.includes(playerId)) {
        console.log(`${playerId} is already selected`);
        return [...prev];
      } else {
        return [...prev, playerId];
      }
    });
  };

  const handleRemovePlayer = (evt, playerId) => {
    setSelectedPlayers((prev) => {
      return prev.filter((existing) => existing !== playerId);
    });
  };

  const handleSave = () => {
    console.log('I should be going off to save to the database');
  };
  return (
    <div>
      {isLoading && <div>loading entrants...</div>}
      {data?.map((participant) => {
        return <div key={participant.id}>{participant.player_name}</div>;
      })}
      {isLoadingPlayers && <div>loading players...</div>}
      {players?.length > 0 && (
        <PlayerPickerMultiple
          name='EntrantPicker'
          playerList={players}
          selectedPlayers={selectedPlayers}
          handleSelect={handleSelectPlayer}
        />
      )}
      <div>
        <pre>{JSON.stringify([...selectedPlayers], null, 2)}</pre>
      </div>
      {selectedPlayers.length > 0 && (
        <div>
          <div>
            {players.map((player) => {
              return selectedPlayers.includes(player.id) ? (
                <div key={player.id} className='flex'>
                  <div>{player.name}</div>
                  <div className='pl-4'>
                    <button
                      onClick={(evt) => handleRemovePlayer(evt, player.id)}
                    >
                      remove
                    </button>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
      <Button text='Save' handleClick={handleSave} />
    </div>
  );
}
