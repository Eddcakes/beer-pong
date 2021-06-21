import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { PlayerPicker } from './PlayerPicker';

it('renders blank player picker button', () => {
  render(<PlayerPicker name='player-picker' selected='' />);
  expect(screen.getByText('Click to pick player')).toBeInTheDocument();
});

it('disabled should be set back to disabled', () => {
  render(<PlayerPicker name='player-picker' selected='' disabled />);
  expect(
    screen.getByText('Click to pick player').closest('button')
  ).toBeDisabled();
});

it('Click should bring up add player modal', async () => {
  render(<PlayerPicker name='player-picker' selected='' />);
  const playerPickerButton = screen
    .getByText('Click to pick player')
    .closest('button');
  fireEvent.click(playerPickerButton);
  expect(screen.getByText('Add Player')).toBeInTheDocument();
});
