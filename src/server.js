const { PORT } = require("../config.json");

const app = require("./app");

const port = PORT;

app.listen(port, () => {
  console.log(`Listing on port ${port}...`);
});
