const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  courseCode: {
    type: String,
    trim: true,
  },
  comment: {
    type: String,
    trim: true,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'faculty',
  },
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
