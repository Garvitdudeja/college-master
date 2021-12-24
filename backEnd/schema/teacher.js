const mongoose = require ('mongoose')

const TeacherSchema = mongoose.Schema(
    {
        Name: {
            type:String,
            required:true
        },
        ScholarLink : {
            type: String,
            required: true
        },
        Faculty : {
            type: String,
            required: true
        },
        SubDepartment  : {
            type: String,
            required: true
        },
    }
)

const TeacherModel = mongoose.model('teacher',TeacherSchema)
module.exports= TeacherModel;