import mongoose, { Mongoose } from "mongoose";

const teamSchema = new mongoose.Schema({
    leader:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    maxteamsize:{
        type:Number,
        default:5
    },
    currentteamsize:{
        type:Number,
        default: 1
    },
    Members:[{
        memberId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true
        },
        joinedAt: { 
            type: Date, 
            default: Date.now 
        }
    }],
    teamname:{
        type:String,
        required:true
    },
    description: {
        type: String,
        maxlength: 500
    },
    avatar: {
        type: String,
        default: ""
    },
    tags: {
        type: [String],
        default: []
    },
    tasks:[{
        text:{type:String},
        completed:{type:Boolean}
    }],
    challengescompleted:{
        type:String
    },
    pendingInvites:{
        type:[String]
    }    
},{timestamps: true})

const Team = mongoose.models.team || mongoose.model("Team", teamSchema);

export default Team;