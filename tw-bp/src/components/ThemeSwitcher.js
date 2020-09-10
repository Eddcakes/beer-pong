import React from 'react';
import ThemeContext from '../ThemeContext';

const themeNames = ['base', 'dark', 'casual'];

export function ThemeSwitcher() {
  return (
    <ThemeContext.Consumer>
      {({ theme, switchTheme }) => (
        <div className='flex justify-center'>
          <div className='w-full md:w-1/3 px-3 mb-6 md:mb-6'>
            <label
              htmlFor='theme-select'
              className='text-primary-text font-bold'
            >
              Theme switcher
            </label>
            <div className='relative'>
              <select
                id='theme-select'
                className={`w-full block appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                onChange={switchTheme}
                value={theme}
              >
                {themeNames.map((name) => {
                  return (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                <svg
                  className='fill-current h-4 w-4'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </ThemeContext.Consumer>
  );
}
