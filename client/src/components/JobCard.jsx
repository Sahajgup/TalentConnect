import { GoLocation } from "react-icons/go";
import moment from "moment";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import { apiRequest } from "../utils";
import { useSelector } from "react-redux";

const JobCard = ({ job }) => {

  const [isSaved, setIsSaved] = useState(false);
  const {user} = useSelector((state) => state.user)
  console.log("checking",user);

  useEffect(() => {
    console.log("isSaved:", isSaved);
  });

  const handleSave = async (e) => {
    e.preventDefault();

    if(user && Object.keys(user).length > 0){
     try{
      const requestData = {
        user: user,
        jobId: job._id
      };
          const res = await apiRequest({
            url: "/jobs/save-job",
            method:"POST",
            data:requestData,

          });
          console.log("cabra",res)
          setIsSaved(true); 
          console.log(isSaved)
       }catch(error){
        setIsSaved(false);
        console.error("Error saving job:", error);
       }
      }else{
        setIsSaved(false);
        console.error("Authenticate First:", error);
      }
  };


  const handleDelete = async (e) => {
    e.preventDefault();

    if(user && Object.keys(user).length > 0){
     try{
      const requestData = {
        user: user,
        jobId: job._id
      };
          const res = await apiRequest({
            url: "/jobs/delete-saved-job",
            method:"POST",
            data:requestData,
          });
          console.log("cabra",res)
          setIsSaved(false); 
          console.log(isSaved)
       }catch(error){
        setIsSaved(true);
        console.error("Error saving job:", error);
       }
      }else{
        setIsSaved(true);
        console.error("Authenticate First:", error);
      }
  };




  return (
    <Link to={`/job-detail/${job?._id}`}>
      <div className="w-full md:w-64 lg:w-72 h-80 bg-white   shadow-lg rounded-md p-6">
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center gap-3">
            <img
              src={job?.thumbnail}
              alt={job?.company}
              className="w-14 h-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold line-clamp-2">{job?.jobTitle.slice(0,40)}</p>
              <p className="font line-clamp-2 text-sm "> {job?.company}</p>
              <div className="flex items-center gap-2 text-sm">
                <GoLocation className="text-slate-900 text-sm w-5 h-5" />

                <span>{job?.location}</span>
              </div>
            </div>
          </div>

          <div className="py-3">
            <p className="text-sm text-gray-700 line-clamp-3">{job?.detail}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="bg-[#1d4fd826] text-[#1d4fd8] py-0.5 px-2 rounded font-semibold text-sm">
              {job?.jobType}
            </p>
            <span className="bg-[#FF8E8F] text-[#A0153E] py-0.5 px-2 rounded font-semibold text-sm">Show More</span>
          </div>
          <div className="flex items-center justify-between">
            {!isSaved ? (
              <button
                className="bg-blue-500 text-white py-0.5 px-2 rounded font-semibold text-sm"
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <button
                className="bg-gray-200 text-gray-600 py-0.5 px-2 rounded font-semibold text-sm"
                onClick={handleDelete}
              >
                Unsave
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;