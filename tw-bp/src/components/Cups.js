import { Cup } from './Cup';
import { HoverElement } from './HoverElement';

export function Cups({
  side,
  cups,
  forwardRef,
  gameSize = 6,
  mouseExit,
  pickCup,
  newMove,
  svgCoord,
  rerack,
  movingState,
  lastHover,
  selectedCup,
}) {
  const lines = createGridLines(gameSize);
  const highlightSize = 4; //
  if (Number(gameSize) === 10) {
    return <svg viewBox='0 0 12 12' data-name={`${side}Svg`}></svg>;
  }
  return (
    <div className='grid justify-center'>
      <svg
        viewBox='0 0 12 12'
        height='15em'
        width='15em'
        data-name={`${side}Svg`}
        ref={forwardRef}
        onMouseMove={newMove}
        onMouseLeave={mouseExit}
        onClick={movingState ? svgCoord : undefined} //pickspot
        className='border'
      >
        {rerack &&
          lines.map(({ x1, y1, x2, y2 }) => (
            <line
              key={`${x1}${x2}${y1}${y2}`}
              x1={x1}
              x2={x2}
              y1={y1}
              y2={y2}
              className='stroke-current text-gray-500'
              strokeWidth={0.1}
            />
          ))}
        {movingState && side === selectedCup?.side && (
          <HoverElement x={lastHover.x} y={lastHover.y} size={highlightSize} />
        )}
        {cups
          .filter((cup) => !cup.hit)
          .map((cup) => {
            return (
              <Cup
                details={cup}
                key={cup.name}
                rerack={rerack}
                pickCup={pickCup}
              />
            );
          })}
      </svg>
    </div>
  );
}

function createGridLines(size) {
  const viewSize = size * 2;
  let lineList = [];
  for (let ii = 0; ii < viewSize; ii++) {
    lineList.push({ x1: 0, y1: ii, x2: viewSize, y2: ii });
    lineList.push({ x1: ii, y1: 0, x2: ii, y2: viewSize });
  }
  return lineList;
}
