global.mongoose  = require('mongoose');
var config       = require('./config/configs.json')

mongoose.connect(config.dbURI)
  .then(connection => {
      console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log(error.message)
  })

mongoose.takedaTryDB  = mongoose.createConnection(config.dbURI);
module.exports        = mongoose;