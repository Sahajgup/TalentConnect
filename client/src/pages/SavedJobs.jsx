import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { Loading, JobCard } from "../components";

const SavedJobsPage = () => {
  const { user } = useSelector((state) => state.user);
  const [savedJobs, setSavedJobs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setIsFetching(true);
      const data = user;
      console.log(data);
      try {
        const res = await apiRequest({
          url: "/jobs/get-saved-jobs",
          method: "POST",
          data:data,
        });
        setSavedJobs(res?.savedJobs);
        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        setIsFetching(false);
      }
    };

    fetchSavedJobs();
  }, [user]);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold my-4">Saved Jobs</h1>
      {isFetching ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
