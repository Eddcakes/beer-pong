import { Cup } from './Cup';

export function CupsView({ side, cups, gameSize = 6 }) {
  if (Number(gameSize) === 10) {
    return <svg viewBox='0 0 12 12' data-name={`${side}Svg`}></svg>;
  }
  return (
    <div className='grid justify-center pb-4'>
      <svg
        viewBox='0 0 12 12'
        height='15em'
        width='15em'
        data-name={`${side}Svg`}
        className='border'
      >
        {cups
          .filter((cup) => !cup.hit)
          .map((cup) => {
            return (
              <Cup
                details={cup}
                key={cup.name}
                rerack={undefined}
                pickCup={undefined}
              />
            );
          })}
      </svg>
    </div>
  );
}
