const mongoose = require("mongoose");

const SubDepartmentSchema = mongoose.Schema({
  Faculty: {
    type: String,
  },
  SubDepartment: {
    type: String,
    unique: true,
  },
  DisplayName: {
    type: String,
  },
  getAll: {
    type: [Number],
  },
  Date: {
    type: String,
  },
});

const SubdepartmentModel = mongoose.model("subDepartment", SubDepartmentSchema);
module.exports = SubdepartmentModel;
