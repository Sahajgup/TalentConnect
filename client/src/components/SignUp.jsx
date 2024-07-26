import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { apiRequest } from "../utils";
import { Login } from "../redux/userSlice"
// import {OAuth} from "./OAuth";
import OAuth from "./OAuth"

const SignUp = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(true);
  const [accountType, setAccountType] = useState("seeker");

  const [errMsg, setErrMsg] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  let from = location.state?.from?.pathname || "/";

  const closeModal = () => setOpen(false);

  const onSubmit = async (data) => {

    console.log(data);

    let URL = null;
    if (isRegister) {
      URL = "auth/register";
    }
    else URL = "auth/login";

    try {
      const res = await apiRequest({
        url: URL,
        data: data,
        method: "POST",
      });
      if (res.status === "failed") {
        setErrMsg(res?.message);
      } else {

        setErrMsg("")
        const dat = { token: res?.token, ...res?.user };
        dispatch(Login(dat));
        navigate('/');
      }

    }
    catch (error) {
      console.log(error)
    }
  };




  return (
    <>
      <Transition appear show={open || false}>
        <Dialog as='div' className='relative z-10 ' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto '>
            <div className='flex min-h-full items-center justify-center p-4 text-center '>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all '>
                  <Dialog.Title
                    as='h3'
                    className='text-xl font-semibold lwading-6 text-gray-900'
                  >
                    { isRegister ? "Create Account" : "Account Sign In"}
                  </Dialog.Title>

                  <div className='w-full flex items-center justify-center py-4 '>
                    <button
                      className={`flex-1 px-4 py-2 rounded text-sm outline-none ${accountType === "seeker"
                        ? "bg-[#1d4fd862] text-blue-900 font-semibold"
                        : "bg-white border border-blue-400"
                        }`}
                      onClick={() => setAccountType("seeker")}
                    >
                      User Account
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded text-sm outline-none ${accountType !== "seeker"
                        ? "bg-[#1d4fd862] text-blue-900 font-semibold"
                        : "bg-white border border-blue-400"
                        }`}
                      onClick={() => setAccountType("company")}
                    >
                      Company Account
                    </button>
                  </div>

                  <form
                    className="w-full flex flex-col gap-5"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <TextInput
                      name="email"
                      label="Email Address"
                      placeholder="email@example.com"
                      type="email"
                      register={register("email", {
                        required: "Email Address is required!",
                      })}
                      error={errors.email ? errors.email.message : ""}
                    />

                    {isRegister && (
                      <div className="w-full">
                        <TextInput
                          name={
                            accountType === "seeker" ? "name" : "name"
                          }
                          label={
                            accountType === "seeker"
                              ? "Name"
                              : "Company Name"
                          }
                          placeholder={
                            accountType === "seeker"
                              ? "eg. James"
                              : "Company name"
                          }
                          type="text"
                          register={register(
                            accountType === "seeker" ? "name" : "name",
                            {
                              required:
                                accountType === "seeker"
                                  ? "Name is required"
                                  : "Company Name is required",
                            }
                          )}
                          error={
                            accountType === "seeker"
                              ? errors.name
                                ? errors.name.message
                                : ""
                              : errors.name
                                ? errors.name.message
                                : ""
                          }
                        />
                      </div>
                    )}

                    <div className="w-full">
                      <TextInput
                        name="password"
                        label="Password"
                        placeholder="Password"
                        type="password"
                        register={register("password", {
                          required: "Password is required!",
                        })}
                        error={
                          errors.password ? errors.password.message : ""
                        }
                      />
                    </div>


                    {errMsg && (
                      <span
                        role="alert"
                        className="text-sm text-red-500 mt-0.5"
                      >
                        {errMsg}
                      </span>
                    )}

                    <div className='text-justify'>
                      <CustomButton
                        type="submit"
                        containerStyles={`inline-flex justify-center rounded-md bg-blue-600 w-full py-3 text-sm font-medium text-white outline-none hover:bg-blue-800`}
                        title={isRegister ? "CREATE ACCOUNT" : "Login Account"}
                      />

                    </div>

                    <OAuth />
                  </form>

                  <div className='mt-4'>
                    <p className='text-sm text-gray-700'>
                      {isRegister
                        ? "Already has an account?"
                        : "Do not have an account"}

                      <span
                        className='text-sm text-blue-600 ml-2 hover:text-blue-700 hover:font-semibold cursor-pointer'
                        onClick={() => setIsRegister((prev) => !prev)}
                      >
                        {isRegister ? "Login" : "Create Account"}
                      </span>
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SignUp;