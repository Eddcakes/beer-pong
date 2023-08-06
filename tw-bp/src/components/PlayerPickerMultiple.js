// combine with player picker?
import { useState } from 'react';
import { Plus, Tick } from '../icons';
import { Button } from './Button';
import { Input } from './controls';
import { Modal } from './layout';

export function PlayerPickerMultiple({
  name,
  playerList,
  selectedPlayers,
  handleSelect,
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
  return (
    <>
      <Button handleClick={toggleModal} text='Add entrants' />

      <Modal isOpen={showModal} dismiss={toggleModal} title='Add Entrants'>
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
              {search(playerList).map((player) => (
                <li
                  key={player.id}
                  value={player.id}
                  role='option'
                  className='grid grid-cols-3 hover:text-sec-background justify-items-center px-6 py-4 border-b cursor-pointer hover:bg-primary'
                  onClick={(evt) => {
                    // what is this se9lect player
                    handleSelect(evt, player.id);

                    //toggleModal();
                  }}
                  aria-selected={false}
                  tabIndex={0}
                >
                  {selectedPlayers.includes(player.id) && (
                    <span className='text-positive'>
                      <Tick />
                    </span>
                  )}

                  <span className='col-start-2 font-semibold'>
                    {player.name}
                  </span>
                  <Plus />
                  {/* if player is added, should we allow them to be removed from modal? */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}
