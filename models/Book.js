const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookSchema = new Schema({
  name: String,
  author: String,
  published: Number,
  cover: String,
  desc: String,
  type: String,
  availability: Number,
  lang: String
});
module.exports = mongoose.model('Book', bookSchema);