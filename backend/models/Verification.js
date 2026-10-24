const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    nidFront: { type: String, required: true },
    nidBack: { type: String, required: true },
    nidNumber: { type: String, trim: true },
    licenceFront: { type: String, required: true },
    licenceBack: { type: String, required: true },
    licenceNumber: { type: String, trim: true },
    licenceExpiry: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    rejectionReason: String,
    submittedAt: { type: Date, default: Date.now },
    resubmissionCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Verification', verificationSchema);