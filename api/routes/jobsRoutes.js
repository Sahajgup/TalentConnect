import express from "express";
import {userAuth,adminAuth} from "../middlewares/authMiddleware.js";
import {
  createJob,
  deleteJobPost,
  getJobById,
  getJobPosts,
  updateJob,
  getSavedJobs,
  saveJob,
  deleteJob
} from "../controllers/jobController.js";

const router = express.Router();

router.post("/upload-job", userAuth ,adminAuth, createJob);
router.put("/update-job/:jobId", userAuth ,adminAuth, updateJob);
router.get("/find-jobs", getJobPosts);
router.post("/save-job", saveJob);
router.post("/get-saved-jobs", getSavedJobs);
router.get("/get-job-detail/:id", getJobById);
router.post("/delete-saved-job",deleteJob);
router.delete("/delete-job/:id", userAuth ,adminAuth, deleteJobPost);

export default router;
