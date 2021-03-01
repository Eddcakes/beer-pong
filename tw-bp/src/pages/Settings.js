import React from 'react';
import {
  Card,
  Container,
  Header,
  ThemeSwitcher,
  UserPreferences,
} from '../components';

export function Settings() {
  return (
    <>
      <Header />
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
