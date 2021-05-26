/* should be a page to edit these terms, should probably be stored in db? or do we want to do without db request */
export const searchPages = [
  {
    matches: ['tournaments', 'events', 'fixtures'],
    link: '/tournaments',
    text: 'Tournaments!',
    description: '',
  },
  {
    matches: ['players', 'fixtures'],
    link: '/players',
    text: 'Players!',
    description: '',
  },
  {
    matches: ['tournaments', 'events', 'fixtures', 'games', 'new', 'new game'],
    link: '/games',
    text: 'Games!',
    description: '',
  },
  {
    matches: ['stats', 'compare', 'versus', 'vs', 'comparison'],
    link: '/versus',
    text: 'Versus!',
    description: '',
  }, //vs less than 3 chars?
  {
    matches: [
      'stats',
      'records',
      'most',
      'wins',
      'gold',
      'silver',
      'bronze',
      'losses',
      'least',
    ],
    link: '/records',
    text: 'Records!',
    description: '',
  },
  {
    matches: ['settings', 'preferences', 'theme', 'colours', 'colors'],
    link: '/settings',
    text: 'Settings!',
    description: '',
  },
  {
    matches: ['test'],
    link: '/test',
    text: 'Test!',
    description: '',
  },
];
