const mongoose = require("mongoose");
//mongoose.pluralize(null);

const lighterSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  position: [
    {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("lighter", lighterSchema);
