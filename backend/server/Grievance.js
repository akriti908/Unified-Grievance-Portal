const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema({
  text: String,
  city: String,
  area: String,
  landmark: String,
  contact: String,
  anonymous: Boolean,

  category: String,
  priority: String,
  action_within: String,

  image: String,
  trackingId: String,

  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },

  // ⭐ REVIEW
  rating: { type: Number, default: null },
  feedback: { type: String, default: "" },

  // ⭐ ADMIN DATA
  remarks: { type: [String], default: [] },
  officer_name: { type: String, default: "" },
  officer_phone: { type: String, default: "" },
  officer_note: { type: String, default: "" }
});

module.exports = mongoose.model("Grievance", grievanceSchema);