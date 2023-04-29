const mongoose = require('mongoose');
 
const miniUserSchema = new mongoose.Schema({
    fname: String,
    ldesc: String
});
 
module.exports = new mongoose.model('miniUser',miniUserSchema);
