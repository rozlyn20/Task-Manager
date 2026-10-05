const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        default:""
    },

    // "Daily" = tracked every day.
    // "Weekly" = tracked only on the weekdays listed in daysOfWeek.
    frequency:{
        type:String,
        enum:["Daily","Weekly"],
        default:"Daily"
    },

    // 0 = Sunday ... 6 = Saturday. Only used when frequency is "Weekly".
    daysOfWeek:{
        type:[Number],
        default:[]
    },

    color:{
        type:String,
        default:"#4f46e5"
    },

    // One entry per day the habit was completed, stored as a UTC midnight
    // Date so "YYYY-MM-DD" comparisons are stable regardless of server timezone.
    logs:{
        type:[Date],
        default:[]
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

module.exports = mongoose.model("Habit", habitSchema);
