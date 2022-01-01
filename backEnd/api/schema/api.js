const mongoose = require('mongoose');

const apiDataSchema = mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    tableData: {
        type: [[Number]],
        required: true,
    },
    graphData: {
        type: [[Number]],
        required: true,
    },
    photoUrl: {
        type: String,
        required:true
    },
    date: {
        type: String,
        required: true
    },
    ScholarId : {
        type: String,
        required: true,
        unique: true

    },
    faculty: {
        type: String,
        required:true
    },
    subDepartment: {
        type: String,
        required:true
    }
})

// creating model
 const apiDataModel = mongoose.model('apiData',apiDataSchema);
module.exports = apiDataModel;