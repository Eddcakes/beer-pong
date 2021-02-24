import { useTheme } from '../hooks/useTheme';

export function Decoration() {
  /* not all themes will have a decoration */
  let current = useTheme();
  if (current.theme === 'carling') {
    return (
      <div
        className='h-7 w-24 relative bg-secondary self-center transform -rotate-12'
        style={{
          clipPath: 'polygon(5% 0%, 0% 100%, 83.5% 100%, 95% 53%, 100% 0%)',
        }}
      >
        <div
          className='absolute right-0 transform rotate-90'
          style={{
            top: '15px',
            borderWidth: '0 16px 16px 0',
            borderColor:
              'var(--color-primary) var(--sec-background) var(--color-primary) var(--sec-background)',
            clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%)',
          }}
        ></div>
      </div>
    );
  }
  return null;
}

/* https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties */
