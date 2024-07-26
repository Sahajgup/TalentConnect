import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { experience, jobTypes, jobs } from "../utils/data";
import { CustomButton, JobCard, ListBox } from "../components";
import { apiRequest } from "../utils";
import SavedJobsPage from "./SavedJobs";
const FindJobs = () => {
  const [sort, setSort] = useState("Newest");
  const {user} = useSelector((state) => state.user)
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [filterJobTypes, setFilterJobTypes] = useState("");
  const [filterExp, setFilterExp] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setIsFetching(true);
    var add_cond = "?"
    if (searchQuery) {
      add_cond += `search=${searchQuery}`;
    }

    if (filterJobTypes) {
      add_cond += `search=${filterJobTypes}`;
    }

    if (jobLocation) {
      if (add_cond.length > 1) add_cond += "&";
      add_cond += `location=${jobLocation}`;
    }

    if (page) {
      if (add_cond.length > 1) add_cond += "&";
      add_cond += `page=${page}`;
    }

    if (add_cond === "?") add_cond = ""

    console.log(add_cond)
    try {
      const res = await apiRequest({
        url: "/jobs/find-jobs" + add_cond,
        method: "GET",
      });
      // console.log(res.data)
      setNumPage(res?.numOfPage);
      setRecordCount(res?.totalJobs);
      setData(res?.data);
      setIsFetching(false);

    } catch (error) {

    }

  };




  // const filterJobs = async(val) => {
  //   console.log("gii",val);
  //   setFilterJobTypes(val);
  //   console.log("shrey",filterJobTypes)
  //   fetchJobs();
  // };

  const filterJobs = async (val) => {
    // console.log("gii", val);
    setFilterJobTypes(val);
  };

  useEffect(() => {
    // console.log("shrey", filterJobTypes);
    // Call fetchJobs here if needed
  }, [filterJobTypes]);


  const handleSearchSubmit = async (e) => {
    // console.log("satya hii",searchQuery,"f",jobLocation)
    e.preventDefault();
    await fetchJobs();

  };



  const handleShowMore = async (e) => {
    e.preventDefault();
    // console.log(page)
    setPage((prev) => prev + 1);
    // console.log(page)

  }

  useEffect(() => {
    fetchJobs();
  }, [sort, filterJobTypes, filterExp, page]);

  const filterExperience = async (e) => {
    setFilterExp(e);
  };

  return (
    
    <div>
      <Header
        title='Find Your Dream Job with Ease'
        type='home'
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={jobLocation}
        setLocation={setJobLocation}
      />

      <div className='container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f7fdfd]'>
        <div className='hidden md:flex flex-col w-1/6 h-fit bg-white shadow-sm'>
          <p className='text-lg font-semibold text-slate-600'>Filter Search</p>

          <div className='py-2'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BiBriefcaseAlt2 />
                Job Type
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className='flex flex-col gap-2'>
              {jobTypes.map((jtype, index) => (
                <div key={index} className='flex gap-2 text-sm md:text-base '>
                  <input
                    type='checkbox'
                    value={jtype}
                    className='w-4 h-4'
                    // onChange={(e) => filterJobs(e.target.value)}
                    onChange={(e) => filterJobs(e.target.checked ? e.target.value : "")}
                  />
                  <span>{jtype}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='w-full md:w-5/6 px-5 md:px-0'>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-sm md:text-base'>
              Shwoing: <span className='font-semibold'>{recordCount}</span> Jobs
              Available
            </p>

            {/* <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
              <p className='text-sm md:text-base'>Sort By:</p>

              <ListBox sort={sort} setSort={setSort} />
            </div> */}
            <div className="mx-10">
              {user && Object.keys(user).length > 0 ? (
                <button
                  type="button"
                  className="bg-[#1d4fd826] text-[#1d4fd8] py-0.5 px-3 mx-15 rounded font-semibold text-sm"
                >
                  <Link to="/SavedJobsPage">Saved Jobs</Link>
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-[#1d4fd826] text-[#1d4fd8] py-0.5 px-3 mx-15 rounded font-semibold text-sm cursor-not-allowed"
                  disabled
                >
                  Saved Jobs
                </button>
              )}
            </div>;



          </div>

          <div className='w-full flex flex-wrap gap-4'>
            {data?.map((job, index) => {
              // console.log(job)


              const newJob = {
                name: job?.company,
                logo: job?.companyLogo,
                ...job,
              };
              return <JobCard job={newJob} key={index} />;
            })}
          </div>

          {numPage > page && !isFetching && (
            <div className='w-full flex items-center justify-center pt-16'>
              <CustomButton
                onClick={handleShowMore}
                title='Load More'
                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
