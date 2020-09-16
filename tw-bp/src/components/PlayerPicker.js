import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';

export function PlayerPicker({
  playerNames,
  players,
  selectPlayer = () => {},
  name,
}) {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = (evt) => {
    setShowModal(!showModal);
  };
  //should i look at useCallback instead of the extending selectPlayer on li onclick
  return (
    <>
      <div className='flex flex-col w-20'>
        <div className='rounded-full h-20 w-20 bg-primary flex items-center justify-center'>
          <span className='text-2xl cursor-pointer p-2' onClick={toggleModal}>
            {players[name] !== '' ? playerNames[players[name] - 1].name : '+'}
          </span>
        </div>
        <span className='text-center text-xs'>Click to pick player</span>
      </div>

      <Modal isOpen={showModal} dismiss={toggleModal} title='Add Player'>
        <div className='px-2'>
          <div className='text-center'>
            <input placeholder='Filter names' className='p-2 shadow' />
          </div>

          <div className='h-48 overflow-y-auto'>
            <ul role='listbox'>
              {playerNames.map((player) => (
                <li
                  key={player.player_ID}
                  value={player.player_ID}
                  role='option'
                  className='flex justify-between px-6 py-2 border-b'
                  onClick={() => {
                    selectPlayer(name, `${player.player_ID}`);
                    toggleModal();
                  }}
                  aria-selected={false}
                >
                  <span className=''>+</span>
                  <span>{player.name}</span>
                  <span className='text-gray-700'>{player.player_ID}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}
