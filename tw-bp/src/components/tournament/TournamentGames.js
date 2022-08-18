import { useState } from 'react';
import { useQuery } from 'react-query';

import { fetchGamesByTournamentId } from '../../queries';
import { Tab, TabContent, Tabs } from '../layout';
import { Finals } from './Finals';
import { Group } from './Group';
import { Participants } from './Participants';

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
        {groupGames.map((key) => {
          return <Group details={gamesByStages[key]} title={key} />;
        })}
      </TabContent>
      <TabContent value={tab} tabId='finals' panelId='tournament-tab-2'>
        {!isLoadingGames && <Finals games={games} />}
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
