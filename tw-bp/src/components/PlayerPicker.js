import React, { useState } from 'react';
import { ButtonSquare } from './ButtonSquare';
import { Modal } from './Modal';

export function PlayerPicker({
  playerNames,
  players,
  selectPlayer = () => {},
  name,
}) {
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const toggleModal = (evt) => {
    setShowModal(!showModal);
  };
  const handleSearchInput = (evt) => setSearchText(evt.target.value);
  const search = (items) =>
    items.filter(
      (item) =>
        item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
        item.player_ID.toString().indexOf(searchText) > -1
    );

  //should i look at useCallback instead of the extending selectPlayer on li onclick
  return (
    <>
      <ButtonSquare
        handleClick={toggleModal}
        text={
          players[name] !== ''
            ? playerNames[players[name] - 1].name
            : 'Click to pick player'
        }
      ></ButtonSquare>

      <Modal isOpen={showModal} dismiss={toggleModal} title='Add Player'>
        <div className='px-2'>
          <div className='text-center'>
            <form role='search'>
              <input
                placeholder='Filter names'
                className='p-2 shadow mb-2'
                onChange={handleSearchInput}
                value={searchText}
              />
            </form>
          </div>
          <div className='h-48 overflow-y-scroll'>
            <ul role='listbox'>
              {search(playerNames).map((player) => (
                <li
                  key={player.player_ID}
                  value={player.player_ID}
                  role='option'
                  className='flex justify-between px-6 py-2 border-b cursor-pointer hover:bg-gray-200'
                  onClick={() => {
                    selectPlayer(name, `${player.player_ID}`);
                    toggleModal();
                  }}
                  aria-selected={false}
                >
                  <span className='select-none'>+</span>
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
