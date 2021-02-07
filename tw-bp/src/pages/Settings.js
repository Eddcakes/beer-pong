import React from 'react';
import {
  Card,
  Container,
  Nav,
  ThemeSwitcher,
  UserPreferences,
} from '../components';

export function Settings() {
  return (
    <>
      <Nav />
      <Container>
        <Card title='Local browser preferences'>
          <ThemeSwitcher />
        </Card>
        <Card title='My preferences'>
          <UserPreferences />
        </Card>
      </Container>
    </>
  );
}
