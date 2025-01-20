import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../utils/confog";

const SignUp = () => {
  const [logIn, setLogin] = useState(true);
  const navigate = useNavigate();

  const toogleLogIn = () => {
    if (!logIn) {
      setLogin(true);
    }
  };
  const toogleSignUp = () => {
    if (logIn) {
      setLogin(false);
    }
  };
  const toastSuccessOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const toastErrorOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const LoginPage = () => {
    const [loginCredentials, setLoginCredentials] = useState({
      email: "",
      password: "",
    });

    const loginChangeHandler = (e) => {
      let { name, value } = e.target;
      setLoginCredentials({ ...loginCredentials, [name]: value });
    };

    const handleLogin = async () => {
      try {
        const response = await axios.post(`${API_URL}/user/login`, loginCredentials);
        const user = response?.data?.loggedInUser;
        if (response.status == 200) {
          toast.success("Logged In Successfully", toastSuccessOptions);
          localStorage.setItem("userInfo", JSON.stringify(user));
          navigate("app/chat")
        }
      } catch (error) {
        if (error.response.status == 400) {
          toast.error("All fields are required", toastErrorOptions);
        }
        if (error.response.status == 401) {
          toast.error("Invalid Email", toastErrorOptions);
        }
        if (error.response.status == 402) {
          toast.error("Invalid Password", toastErrorOptions);
        }
        if (error.response.status == 404) {
          toast.error("User does not found", toastErrorOptions);
        }
      }
    };

    return (
      <>
        <div className="flex flex-col w-full border-2 pl-4 rounded-md h-full">
          <div className="flex-1 p-2">
            <p className="font-serif font-medium text-base">Email</p>
            <input
              className="outline-none p-1 w-full rounded-md"
              type="email"
              name="email"
              onChange={loginChangeHandler}
              placeholder="Enter your email"
            />
          </div>
          <div className="flex-1 p-2">
            <p className="font-serif font-medium text-base">Password</p>
            <input
              className="outline-none p-1 w-full rounded-md"
              type="password"
              name="password"
              onChange={loginChangeHandler}
              placeholder="Enter you password"
            />
          </div>
          <div className="flex p-2 h-auto justify-between text-white">
            <button
              className="bg-blue-400 h-8 w-1/3 rounded-md"
              onClick={handleLogin}
            >
              LogIn
            </button>
            <button className="bg-blue-400 h-8 w-1/3 rounded-md">
              Forgot Password
            </button>
          </div>
        </div>
      </>
    );
  };

  const SignUpPage = () => {
    const [signUpCredentials, setSignUpCredentials] = useState({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: null,
    });

    const signUpChangeHandler = (e) => {
      const { name, value } = e.target;
      setSignUpCredentials({ ...signUpCredentials, [name]: value });
    };

    const handleAvatarChange = (e) => {
      const avatar = e.target.files[0];
      setSignUpCredentials({ ...signUpCredentials, avatar });
    };

    const handelSignUp = async () => {
      console.log(signUpCredentials);

      try {
        const formData = new FormData();
        formData.append("userName", signUpCredentials.userName);
        formData.append("email", signUpCredentials.email);
        formData.append("password", signUpCredentials.password);
        formData.append("confirmPassword", signUpCredentials.confirmPassword);
        formData.append("avatar", signUpCredentials.avatar); 
        const response = await axios.post(`${API_URL}/user/register`, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Specify multipart/form-data
          },
        });
        const user = response?.data?.createdUser;
        if (response.status == 200) {
          toast.success("SignnedUp Successfully", toastSuccessOptions);
          localStorage.setItem("userInfo", JSON.stringify(user));
          navigate("app/chat")
        }
      } catch (error) {
        if (error.response.status == 400) {
          toast.error("All fields are required", toastErrorOptions);
        }
        if (error.response.status == 405) {
          toast.error("Invalid Email", toastErrorOptions);
        }
        if (error.response.status == 401) {
          toast.error("User already existed", toastErrorOptions);
        }
        if (error.response.status == 402) {
          toast.error("No file is uploaded", toastErrorOptions);
        }
        if (error.response.status == 403) {
          toast.error("Fail to upload", toastErrorOptions);
        }
      }
    };

    return (
      <>
        <div className="flex flex-col w-full border-2 pl-4 rounded-md h-full sm:p-1">
          <div className="flex-1 p-2">
            <p className="font-serif font-medium text-base">Name</p>
            <input
              className="outline-none p-1 w-full rounded-md"
              type="text"
              name="userName"
              onChange={signUpChangeHandler}
              placeholder="Enter your name"
            />
          </div>
          <div className="flex-1 p-2">
            <p className="font-serif font-medium text-base">Email</p>
            <input
              className="outline-none p-1 w-full rounded-md"
              type="email"
              name="email"
              onChange={signUpChangeHandler}
              placeholder="Enter your email"
            />
          </div>
          <div className="flex-1 p-2">
            <p className="font-serif font-medium text-base">Password</p>
            <input
              className="outline-none p-1 w-full rounded-md"
              type="password"
              name="password"
              onChange={signUpChangeHandler}
              placeholder="Enter you password"
            />
          </div>
          <div className="flex-1 p-2">
            <p className="font-serif font-medium text-base">Confirm Password</p>
            <input
              className="outline-none p-1 w-full rounded-md"
              type="password"
              name="confirmPassword"
              onChange={signUpChangeHandler}
              placeholder="Re Enter you password"
            />
          </div>
          <div className="flex-1 p-2">
            <p className="font-serif font-medium text-base">
              Upload Your Picture
            </p>
            <input
              className="outline-none p-1 w-full rounded-md"
              type="file"
              name="avatar"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex p-2 h-auto justify-center text-white">
            <button
              className="bg-blue-400 h-8 w-1/3 rounded-md"
              onClick={handelSignUp}
            >
              SignUp
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col items-center h-screen bg-blue-300">
        <div className="flex justify-center text-2xl font-mono font-semibold mt-24 w-full max-w-lg p-4 bg-slate-100 rounded-md">
          <h2>Pinzz: Where Every Chat Matters</h2>
        </div>
        <div className="flex flex-col justify-center mt-4 w-full max-w-lg bg-slate-100 rounded-md ">
          <div className="flex justify-center gap-2 w-full h-auto p-2 ">
            <button
              className="flex-1  text-lg h-12 hover:bg-blue-200 rounded-full"
              onClick={toogleLogIn}
            >
              Login
            </button>
            <button
              className="flex-1  text-lg h-12 hover:bg-blue-200 rounded-full"
              onClick={toogleSignUp}
            >
              SignUp
            </button>
          </div>
          <div>{logIn ? <LoginPage /> : <SignUpPage />}</div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
