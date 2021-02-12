const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rentalSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  book: { type: Schema.Types.ObjectId, ref: 'Book' },
  rental_date: Date,
  return_date: Date
});
module.exports = mongoose.model('Rental', rentalSchema);