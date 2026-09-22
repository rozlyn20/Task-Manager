import React, { useState } from 'react'
import './login.scss'
import axios from "axios";
import { Link,useNavigate} from 'react-router-dom'
import { API_BASE_URL } from "../../config";
import { TaskAlt } from "@mui/icons-material";

const Login = () => {
    const [formData,setFormData]=useState({
        email:"",
        password:"",
    })
    const [error,setError]=useState("");
    const [submitting,setSubmitting]=useState(false);
    const navigate=useNavigate()
    const handleChange=(e)=>{
    setFormData({
        ...formData,[e.target.name]:e.target.value,
    })
}
const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const targetUrl = `${API_BASE_URL}/api/auth/login`;
    console.log("[Deployment Debug Login] Target URL:", targetUrl);

    try {
        const res = await axios.post(
            targetUrl,
            {
                email: formData.email,
                password: formData.password
            }
        );

        localStorage.setItem("token", res.data.token);

        alert("Login Successful");

        navigate("/home");

    } catch (err) {

        setError(
            err.response?.data?.message || "Login failed"
        );

    } finally {
        setSubmitting(false);
    }
};
return (
    <div className='login'>
      <div className="left">
        <form onSubmit={handleSubmit}>
            <div className="wrapper">
                <div className="brand">
                    <span className="brand-icon"><TaskAlt/></span>
                    <span className="brand-name">TaskFlow</span>
                </div>
                <h1>Welcome back</h1>
                <p className="subtitle">Log in to keep track of your tasks.</p>

                {/* <input type="text" name="username" placeholder='username' onChange={handleChange} autoComplete='username' required /> */}
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder='you@example.com' onChange={handleChange} autoComplete='current-password' required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder='••••••••' onChange={handleChange} required />

                <button className='btn' type="submit" disabled={submitting}>
                    {submitting ? <span className="app-spinner app-spinner--light"></span> : "Login"}
                </button>
                {error && (
                    <div className="form-error">
                        {error}
                        </div>
                )}
                <p className="switch">
                        Don't have an account?{" "}
                        <Link to="/register" className="link">
                        Sign up
                        </Link>
                </p>
            </div>
        </form>
      </div>
      <div className="right">
        <div className="showcase">
            <p className="quote">"Finally a task manager that gets out of my way."</p>
        </div>
      </div>
    </div>
  )
}

export default Login
