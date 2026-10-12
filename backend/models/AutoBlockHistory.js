const mongoose = require("mongoose");

const autoBlockHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    enabled: {
      type: Boolean,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

autoBlockHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("AutoBlockHistory", autoBlockHistorySchema);
