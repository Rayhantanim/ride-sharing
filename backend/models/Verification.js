const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one verification doc per driver
    },

    // NID documents
    nidFront: { type: String, required: true }, // file path/URL
    nidBack:  { type: String, required: true },
    nidNumber: { type: String, trim: true },

    // Driving licence
    licenceFront: { type: String, required: true },
    licenceBack:  { type: String, required: true },
    licenceNumber: { type: String, trim: true },
    licenceExpiry: { type: Date },

    // Review state
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    rejectionReason: String,

    // Submission tracking
    submittedAt: { type: Date, default: Date.now },
    resubmissionCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Verification', verificationSchema);