const mongoose = require("mongoose");

const SubDepartmentSchema = mongoose.Schema({
  Faculty: {
    type: String,
    required: true,
  },
  SubDepartment: {
    type: String,
    required: true,
  },
});

const SubdepartmentModel = mongoose.model("subDepartment", SubDepartmentSchema);
module.exports = SubdepartmentModel;
