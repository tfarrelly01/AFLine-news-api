/* eslint-disable no-console */
const app = require('./src/server');
const { PORT } = process.env;

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});