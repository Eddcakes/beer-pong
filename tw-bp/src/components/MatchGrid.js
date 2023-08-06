import { Match } from './Match';

//just a wrapper around Matches for now
export function MatchGrid({ games }) {
  if (games == null) {
    return <div>Games may be undefined</div>;
  }
  if (games.length < 1) {
    return <div>No games have been played</div>;
  }
  return (
    <div className='grid md:grid-cols-3 gap-4'>
      {games.map((game) => {
        return <Match key={game.id} details={game} />;
      })}
    </div>
  );
}
