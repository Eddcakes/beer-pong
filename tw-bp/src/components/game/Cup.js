export function Cup({ details, pickCup, rerack }) {
  const rad = 2;
  if (details?.rim) {
    return (
      <g>
        <circle
          cx={details.x}
          cy={details.y}
          r={rad}
          name={details.name}
          className='cursor-pointer'
          data-name={details.name}
          onClick={pickCup}
        />
        <text
          x={details.x}
          y={Number(details.y) + 0.5}
          textAnchor='middle'
          className='pointer-events-none fill-current text-red-500'
          style={{ fontSize: '0.1rem' }}
        >
          {details.rim.length}
        </text>
      </g>
    );
  }
  return (
    <circle
      cx={details.x}
      cy={details.y}
      r={rad}
      name={details.name}
      className='cursor-pointer'
      data-name={details.name}
      onClick={pickCup}
    />
  );
}
