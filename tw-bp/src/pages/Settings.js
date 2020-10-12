import React from 'react';
import { Card, Nav, ThemeSwitcher, UserPreferences } from '../components';

export function Settings() {
  return (
    <>
      <Nav />
      <div>
        <Card title='Local browser preferences'>
          <ThemeSwitcher />
        </Card>
        <Card title='My preferences'>
          <UserPreferences />
        </Card>
      </div>
    </>
  );
}
