import React, { useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { API_PATH } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance"
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, seterror] = React.useState("");

    const {updateUser} = useContext(UserContext)

  const navigate = useNavigate();

  // handle login function
  const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)) {
      seterror("Please enter a valid email address");
      return;
    }

    // Validate email and password
    if (!password) {
      seterror("Please enter the password");
      return;
    }

    seterror("");
    // Simulate login API call
    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
        email,
        password,
      });
      // eslint-disable-next-line no-unused-vars
      const {token, user} = response.data;

      if(token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard")
      }
    }
    catch (error) {
      if(error.response && error.response.data.message) {
        seterror(error.response.data.message);
      }
      else {
        console.log("Error for login",error);
        seterror("Something went wrong. Please try again.")
      }
    }
  }
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to login
        </p>
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            label="Email Address"
            placeholder="john@example.com"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            label="Password"
            placeholder="Minimum 8 characters"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        
          <button type="submit" className="btn-primary">
            LOGIN
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <span
              className="font-medium text-purple-500 cursor-pointer underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
