const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
  bookId: { type: ObjectId,  ref: "book", trim : true },

  reviewedBy: { type: String , default : "Guest",trim : true },

  reviewedAt: { type: String ,trim :true },

  rating: { type: Number, required : true , trim : true },

  review: { type : String , trim : true },

  isDeleted: { type : Boolean , default : false}, 
});

module.exports = mongoose.model("review", reviewSchema);
