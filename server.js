const app = require("./src/app");

const PORT = 3007;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`)
});

// ctrl + C => server auto close 
process.on('SIGINT', () => {
  server.close(() => console.log(`Exit Server Express`))
  // notify.send(e.....)
})