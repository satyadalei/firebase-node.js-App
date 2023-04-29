require('dotenv').config();
const  mongoose = require('mongoose');
const mongoUrl= process.env.mongoUrl;
mongoose.connect(mongoUrl, {useNewUrlParser: true});
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('Could not connect to Data base');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;