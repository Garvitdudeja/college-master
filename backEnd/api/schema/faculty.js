const mongoose = require("mongoose");

const FacultySchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  DisplayName: {
    type: String,
    required: true,
  },
});

const FacultyModel = mongoose.model("faculty", FacultySchema);
module.exports = FacultyModel;
