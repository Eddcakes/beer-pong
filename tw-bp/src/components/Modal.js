import React, { useEffect } from 'react';

//investigate focus trapping ?
export function Modal({ isOpen = false, dismiss = () => {}, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => (document.body.style.overflow = '');
  }, [isOpen]);
  if (isOpen) {
    return (
      <div className='fixed z-10 inset-0'>
        <div className='flex items-center justify-center min-h-screen pt-4 px-4 text-center'>
          <div className='fixed inset-0 transition-opacity'>
            <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
          </div>
          <div
            className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-20 w-3/4'
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-headline'
          >
            <div className='flex justify-between'>
              <h3 className='text-lg p-4' id='modal-headline'>
                {title}
              </h3>
              <button onClick={dismiss} className='cursor-pointer px-2 text-lg'>
                ×
              </button>
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
