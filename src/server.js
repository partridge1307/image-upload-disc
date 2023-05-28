const { config } = require('dotenv');
config();

const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Listing on port ${port}...`);
});
