import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/messages");
    }
  });

  const loginUser = async (payload) => {
    const response = await axios.post(
      "http://localhost:5000/user/login",
      payload
    );

    return response.data;
  };

  const mutation = useMutation({
    mutationFn: loginUser,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.accessToken);
      navigate("/messages");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    mutation.mutate(formData);
  };
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                className="input input-bordered"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                name="password"
                value={formData.password}
                className="input input-bordered"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
