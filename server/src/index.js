import path from 'path';

import app from './app.js';

const __dirname = path.resolve();

// in production use the build file, in dev run server & front end individually
// space in package.json as:production means we have to trim
if (process.env.NODE_ENV.toLowerCase().trim() === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`listening at ${process.env.DB_HOST}:${port}`);
});
