const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Contact Support",
        "Report Driver",
        "Lost & Found",
        "Refund Request",
        "Wrong fare charged",
        "Driver didn’t arrive on time",
        "Safety concern",
        "Lost items",
        "Poor vehicle condition",
      ],
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    rideId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Received", "In Process", "Resolved"],
      default: "Received",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SupportRequest", supportRequestSchema);
