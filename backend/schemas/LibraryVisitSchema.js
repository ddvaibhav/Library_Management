const { Schema } = require('mongoose');

const LibraryVisitSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  checkInTime: { type: Date, default: null },
  checkOutTime: { type: Date, default: null },
  status: {
    type: String,
    enum: ['In Library', 'Out of Library'],
    default: 'Out of Library',
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = { LibraryVisitSchema };
