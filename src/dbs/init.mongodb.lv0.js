const mongoose = require('mongoose')

const connectString = `mongodb://localhost:27018/shopDEV`
mongoose.connect(connectString).then(_ => console.log(`Connected MongoDB Success!`))
.catch(err => console.log(`Error Connect!`))

if (1 === 0 ) {
  mongoose.set('debug', true);
  mongoose.set('debug', {color: true})
}


// use Singleton Pattern => create only one instance

module.exports = mongoose