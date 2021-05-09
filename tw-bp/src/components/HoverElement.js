export function HoverElement({ x, y, size = 4 }) {
  if (x != null || y != null) {
    return (
      <rect
        x={x}
        y={y}
        height={size}
        width={size}
        className='fill-current text-blue-500 opacity-25'
      />
    );
  } else {
    return null;
  }
}
