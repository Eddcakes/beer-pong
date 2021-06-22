import React, { useState } from 'react';

import { Button, Modal, Input } from './index';
import { Plus, Tick } from '../icons';

export function PlayerPicker({
  name,
  playerNames = [],
  selected,
  selectPlayer = () => {},
  variant = 'square',
  color = 'primary',
  fullWidth = false,
  disabled = false,
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
        item.id.toString().indexOf(searchText) > -1
    );

  //should i look at useCallback instead of the extending selectPlayer on li onclick
  return (
    <>
      <Button
        variant={variant}
        color={color}
        handleClick={toggleModal}
        text={
          selected !== ''
            ? playerNames[selected - 1].name
            : 'Click to pick player'
        }
        fullWidth={fullWidth}
        disabled={disabled}
      />

      <Modal isOpen={showModal} dismiss={toggleModal} title='Add Player'>
        <div className='px-2'>
          <div className='text-center'>
            <form role='search'>
              <Input
                placeholder='Filter names'
                onChange={handleSearchInput}
                value={searchText}
              />
            </form>
          </div>
          <div className='max-h-75vh flex'>
            <ul role='listbox' className='overflow-y-auto w-full'>
              {search(playerNames).map((player) => (
                <li
                  key={player.id}
                  value={player.id}
                  role='option'
                  className='grid grid-cols-3 hover:text-sec-background justify-items-center px-6 py-4 border-b cursor-pointer hover:bg-primary'
                  onClick={() => {
                    selectPlayer(name, `${player.id}`);
                    toggleModal();
                  }}
                  aria-selected={false}
                  tabIndex={0}
                >
                  {Number(selected) === Number(player.id) && (
                    <span className='text-positive'>
                      <Tick />
                    </span>
                  )}

                  <span className='col-start-2 font-semibold'>
                    {player.name}
                  </span>
                  <Plus />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}
