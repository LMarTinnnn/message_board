var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

//mLab DB
// mongoose.connect('mongodb://test:lyb97427@ds050077.mlab.com:50077/magikarp_blog')
module.exports = mongoose