import { useState } from 'react';

import { Tab, TabContent, Tabs } from '../layout/Tabs';
import { Standings } from './Standings';

export function Group({ details, title }) {
  const [tab, setTab] = useState('initialTab');
  const handleChange = (evt, newValue) => {
    setTab(newValue);
  };
  return (
    <div>
      <Tabs value={tab} onChange={handleChange} title={title}>
        <Tab label='Standings' tabId='initialTab' panelId='tab-content-1' />
        <Tab label='Matches' tabId='secondTab' panelId='tab-content-2' />
      </Tabs>
      <TabContent value={tab} tabId='initialTab' panelId='tab-content-1'>
        <Standings details={details} />
      </TabContent>
      <TabContent value={tab} tabId='secondTab' panelId='tab-content-2'>
        <GroupGames games={details} />
      </TabContent>
    </div>
  );
}

function GroupGames({ games }) {
  const [highlightPlayer, setHighlightPlayer] = useState('');
  const handleHighlight = (evt, playerId) => {
    setHighlightPlayer(playerId);
  };
  return (
    <div className='grid gap-4 grid-cols-3 grid-rows-3 py-2'>
      {games.map((game) => {
        return (
          <GroupMatch
            key={game.id}
            details={game}
            handleHighlight={handleHighlight}
            highlightPlayer={highlightPlayer}
          />
        );
      })}
    </div>
  );
}

function GroupMatch({ details, handleHighlight, highlightPlayer }) {
  const highlight = (cur) =>
    cur === highlightPlayer ? 'bg-primary text-white' : '';

  return (
    <div className='border p-2'>
      <PlayerScore
        playerId={details.home_id}
        playerName={details.home_name}
        playerCupsLeft={details.home_cups_left}
        handleHighlight={handleHighlight}
        highlight={highlight}
      />

      <PlayerScore
        playerId={details.away_id}
        playerName={details.away_name}
        playerCupsLeft={details.away_cups_left}
        handleHighlight={handleHighlight}
        highlight={highlight}
      />
    </div>
  );
}

function PlayerScore({
  playerId,
  playerName,
  playerCupsLeft,
  handleHighlight,
  highlight,
}) {
  const mouseEnter = (evt) => handleHighlight(evt, playerId);
  const mouseExit = (evt) => handleHighlight(evt, '');
  return (
    <div className='flex'>
      <div
        className={`grow text-center ${highlight(playerId)}`}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseExit}
      >
        {playerName}
      </div>
      <div className='border-l px-3'>{playerCupsLeft}</div>
    </div>
  );
}
