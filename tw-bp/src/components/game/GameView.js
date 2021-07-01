/* if locked or view only people should see GameView instead of GamePlay */
import { CupsView } from './index';

export function GameView({ gameDetails }) {
  return (
    <>
      <div>
        <div>{gameDetails.home_name}</div>
        <div>home cups left: {gameDetails.home_cups_left}</div>
        <div>hit rim: {gameDetails.game_table.awayCupRimCount}</div>
        <div>
          reracked:
          {JSON.stringify(gameDetails.game_table.homeCupRerackComplete)}
        </div>
        <CupsView
          side='home'
          cups={gameDetails.game_table.homeCups}
          gameSize={6}
        />
      </div>
      <div>
        <div>{gameDetails.away_name}</div>
        <div>away cups left: {gameDetails.away_cups_left}</div>
        <div>hit rim: {gameDetails.game_table.homeCupRimCount}</div>
        <div>
          reracked:
          {JSON.stringify(gameDetails.game_table.awayCupRerackComplete)}
        </div>
        <CupsView
          side='away'
          cups={gameDetails.game_table.awayCups}
          gameSize={6}
        />
      </div>
    </>
  );
}
