import React, { useState } from "react";
import signupImg from "../assets/images/signup.gif";
import avatar from "../assets/images/doctor-img01.png";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config.js";  //TODO ----> Find out why using it is causing error 
import { toast } from "react-toastify";
import HashLoader from 'react-spinners/HashLoader'
import UploadImageToCloudinary from "../utils/uploadCloudinary.js";

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setpreviewURL] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    photo: selectedFile,
    gender: "",
    role: "patient",
    name: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];

    console.log(file);

    setLoading(true)

    try {
      const data = await UploadImageToCloudinary(file);


      console.log("Data after uploading on cloudinary : ", data);
      setLoading(false)
      setpreviewURL(data.url);
      setSelectedFile(data.url);
  
      // update the form data
      setFormData({ ...formData, photo: data.url });
    } catch (error) {
      setLoading(false);
      console.log("Error in saving cloudinary : ",error);
    }

   
  };



  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log("Calling submit handler ")
    try {
      const res = await fetch(`http://localhost:5000/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      

      console.log("Yha aa gya 01");

      const { message } = await res.json();
      if (!res.ok) {
        throw new Error(message);
      }

      // if res found , 1. show a toast notification , 2. setLoading false
      console.log("navigating now  ")
      setLoading(false);
      toast.success(message);
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg">
              <img src={signupImg} alt="" className="w-full rounded-l-lg" />
            </figure>
          </div>

          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Create an <span className="text-primaryColor">account</span>
            </h3>
            <form  onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  types="text"
                  placeholder="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
 focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
 cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  types="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
 focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
 cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  types="email"
                  placeholder="Enter Your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
 focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
 cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5 flex items-center justify-between">
                <label
                  htmlfor=""
                  className="text-headingColor font-bold text-[16px] leading-7"
                >
                  Are you a:
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3
focus:outline-none"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </label>

                <label className="text-headingColor font-bold text-[16px] leading-7">
                  Gender:
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3
focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>

              <div className="mb-5 flex items-center gap-3">
                {(selectedFile && (
                  <figure
                    className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor
flex items-center justify-center"
                  >
                    <img
                      src={previewURL}
                      alt=""
                      className="w-full h-full rounded-full"
                    />
                  </figure>
                )) || (
                  <figure
                    className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor
flex items-center justify-center"
                  >
                    <img src={avatar} alt="" className="w-full rounded-full" />
                  </figure>
                )}
                <div className="relative w-[130px]  h-[50px] ">
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    onChange={handleFileInputChange}
                    accept=".jpg, .png"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <label
                    htmlFor="customFile"
                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.
375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor
font-semibold rounded-lg truncate cursor-pointer"
                  >
                    Upload Photo
                  </label>
                </div>
              </div>

              <div className="mt-7">
                <button
                disabled={loading && true}  //to prevent multiple submit at a time
                  type="submit"
                  className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-2 "
                >
                  {loading?(<HashLoader size={35} color="#ffffff" /> ):("Signup")}
                </button>
              </div>


              <p className="mt-5 text-textColor text-center">
                Already have an account
                <Link
                  to="/login"
                  className="text-primaryColor font-medium ml-1"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Signup;