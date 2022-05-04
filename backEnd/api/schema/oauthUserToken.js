const mongoose = require("mongoose");

const Oath = mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  DisplayName: {
    type: String,
    required: true,
  },
});

const OathModel = mongoose.model("faculty", Oath);
module.exports = OathModel;
