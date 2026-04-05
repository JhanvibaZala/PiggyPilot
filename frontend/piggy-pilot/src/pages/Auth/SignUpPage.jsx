import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/input.jsx";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage"; // example path

const SignUp = () => {
  // profile picture state
  const [profilePic, setProfilePic] = useState(null);
  // full name, email, and password states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // error state
  const [error, setError] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // navigation hook
  // const navigate = useNavigate();

  // handle signup function
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate full name
    if (!fullName) {
      setError("Please enter your full name");
      return;
    }

    // Validate password
    if (!password) {
      setError("Please enter a password");
      return;
    }

    setError("");

    // Simulate signup API call
    try {
      let profileImageUrl = "";
      // Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }

    // After successful signup, navigate to the login page
    // navigate("/login");
  };
  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-10 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details today
        </p>

        {/* -------------Form----------- */}
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />
            <Input
              type="text"
              label="Email Address"
              placeholder="john@example.com"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="col-span-2">
              <Input
                type="password"
                label="Password"
                placeholder="Minimum 8 characters"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {/* Submit Button */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGNUP
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <span
              className="font-medium text-purple-500 cursor-pointer underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
