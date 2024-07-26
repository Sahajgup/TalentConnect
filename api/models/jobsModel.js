import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: { String },
    companyLogo: { type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" },
    jobType: { type: String},
    jobTitle: {type:String},
    location: { type: String },
    batch: {type: String},
    salary: { type: Number },
    experience: { type: Number, default: 0 },
    detail:  { type: String },
    stipend: { type: String },
    skill_req: {type:String},
    apply_url: {type:String},
    id_:{type: Schema.Types.ObjectId}
  },
  { timestamps: true }
);

const Jobs = mongoose.model("Jobs", jobSchema);

export default Jobs;
