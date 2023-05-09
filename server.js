const app = require("./src/app");

const PORT = process.env.PORT || 3008;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`)
});

// ctrl + C => server auto close 
process.on('SIGINT', () => {
  server.close(() => console.log(`Exit Server Express 123:wq`))
  // notify.send(e.....)
})