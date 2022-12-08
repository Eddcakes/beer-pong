import { useState } from 'react';
import { useQuery } from 'react-query';

import { fetchGamesByTournamentId } from '../../queries';
import { Tab, TabContent, Tabs } from '../layout';
import { Finals } from './Finals';
import { Group } from './Group';
import { Participants } from './Participants';

/*
  do we want to store fallback/mock data here
  for before the tournament is started

  so we can see predicted groups
  finals (not filled in, but correct no. of rounds)
  participants
  i guess don't add to participants list until starting the tournament?

  actually we have to store them somewhere so everyone can see them and it not just local data

*/

export function TournamentGames({ id }) {
  const [tab, setTab] = useState('groups');
  const handleTabChange = (evt, newValue) => {
    setTab(newValue);
  };
  const { data: games, isLoading: isLoadingGames } = useQuery(
    ['gamesByTournamentId', id],
    () => fetchGamesByTournamentId(id)
  );
  const gamesByStages = groupByStage(games);
  const groupGames = Object.keys(gamesByStages).filter((stage) =>
    stage.includes('group')
  );
  return (
    <div className='space-y-4'>
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label='Groups' tabId='groups' panelId='tournament-tab-1' />
        <Tab label='Finals' tabId='finals' panelId='tournament-tab-2' />
        <Tab label='Entrants' tabId='players' panelId='tournament-tab-3' />
      </Tabs>
      <TabContent value={tab} tabId='groups' panelId='tournament-tab-1'>
        {isLoadingGames && <div>loading games...</div>}
        {groupGames.length > 0 ? (
          groupGames.map((key) => {
            return <Group key={key} details={gamesByStages[key]} title={key} />;
          })
        ) : (
          <div>Tournament not yet started</div>
        )}
      </TabContent>
      <TabContent value={tab} tabId='finals' panelId='tournament-tab-2'>
        {games?.length > 0 ? (
          <Finals games={games} />
        ) : (
          <div>Tournament not yet started</div>
        )}
      </TabContent>
      <TabContent value={tab} tabId='players' panelId='tournament-tab-3'>
        <Participants tournamentId={id} />
      </TabContent>
    </div>
  );
}

function groupByStage(games) {
  if (games == null) return {};
  let stages = {};
  let seen = [];
  games.forEach((game) => {
    if (seen.includes(game.stage)) {
      stages[game.stage].push(game);
    } else {
      seen.push(game.stage);
      stages[game.stage] = [game];
    }
  });
  return stages;
}
