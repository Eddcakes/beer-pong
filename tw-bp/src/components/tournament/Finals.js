import {
  SingleEliminationBracket,
  Match,
  MATCH_STATES,
  SVGViewer,
} from '@g-loot/react-tournament-brackets';
import { useWindowSize } from '../../hooks/useWindowSize';

export function Finals({ games }) {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const bracketGames = games.filter((game) => !game.stage.includes('group'));
  const formattedMatches = bp_db_to_matches_format(bracketGames);
  return (
    <div>
      <SingleEliminationBracket
        matches={formattedMatches}
        matchComponent={Match}
        svgWrapper={({ children, ...props }) => (
          <SVGViewer
            width={windowWidth - 100}
            height={windowHeight - 80}
            {...props}
          >
            {children}
          </SVGViewer>
        )}
      />
    </div>
  );
}

function isWinner(myCups, oppCups) {
  if (myCups > 0 && oppCups > 0) {
    return null;
  }
  if (myCups > oppCups) {
    return true;
  } else {
    return false;
  }
}

function bp_db_to_matches_format(games) {
  return games.map((game) => {
    return {
      id: game.id,
      name: game.stage,
      nextMatchId: game.next_game_id,
      tournamentRoundText: game.stage.includes('quarter') ? '1' : null,
      // startTime: game.date,
      state: game.locked ? MATCH_STATES.DONE : null,
      participants: [
        {
          id: game.home_id,
          resultText: game.home_cups_left + '',
          isWinner: isWinner(game.home_cups_left, game.away_cups_left),
          status: game.locked ? MATCH_STATES.PLAYED : null,
          name: game.home_name,
        },
        {
          id: game.away_id,
          resultText: game.away_cups_left + '',
          isWinner: isWinner(game.away_cups_left, game.home_cups_left),
          status: game.locked ? MATCH_STATES.PLAYED : null,
          name: game.away_name,
        },
      ],
    };
  });
}
