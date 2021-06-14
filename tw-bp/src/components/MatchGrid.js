import { Match } from './Match';

//just a wrapper around Matches for now
export function MatchGrid({ games }) {
  return (
    <div className='grid md:grid-cols-3 gap-4'>
      {games.map((game) => {
        return <Match key={game.id} details={game} />;
      })}
    </div>
  );
}
