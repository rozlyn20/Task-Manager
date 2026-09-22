const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        default:""
    },

    category:{
        type:String,
        enum:["Personal","Work","Other"],
        default:"Personal"
    },

    dueDate:{
        type:Date
    },

    completed:{
        type:Boolean,
        default:false
    },

    status:{
        type:String,
        enum:["To Do","In Progress","Done"],
        default:"To Do"
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
}
},
{
    timestamps:true
});

module.exports = mongoose.model("Task", taskSchema);