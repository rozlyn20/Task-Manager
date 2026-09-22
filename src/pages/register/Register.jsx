import React, { useState } from 'react'
import './register.scss'
import { Link,useNavigate} from 'react-router-dom'
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { TaskAlt } from "@mui/icons-material";
const Register = () => {
    const [formData,setFormData]=useState({
    username:"",
    email:"",
    password:"",
    confirmPassword:"",
})
const [error,setError]=useState("")
const [submitting,setSubmitting]=useState(false)
const navigate=useNavigate()
const handleChange=(e)=>{
    setFormData({
        ...formData,[e.target.name]:e.target.value,
    })
}
const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
    }
const targetUrl = `${API_BASE_URL}/api/auth/register`;
console.log("[Deployment Debug Register] Target URL:", targetUrl);

setSubmitting(true);
    try {
        await axios.post(
            targetUrl,
            {
                name: formData.username,
                email: formData.email,
                password: formData.password
            }
        );

        alert("Registration successful");
        navigate("/login");
    } catch (err) {
        setError(
            err.response?.data?.message || "Registration failed"
        );
    } finally {
        setSubmitting(false);
    }
};
  return (
    <div className='register'>
      <div className="left">
        <form onSubmit={handleSubmit}>
            <div className="wrapper">
                <div className="brand">
                    <span className="brand-icon"><TaskAlt/></span>
                    <span className="brand-name">TaskFlow</span>
                </div>
                <h1>Create your account</h1>
                <p className="body">
                     Organize your tasks, manage your time, and boost your productivity with an intuitive interface.
                </p>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" placeholder='Jane Doe' onChange={handleChange} required />
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder='you@example.com' onChange={handleChange} required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder='••••••••' onChange={handleChange} required />
                <label htmlFor="confirmPassword">Confirm password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder='••••••••' onChange={handleChange} required/>
                <button className='btn' type="submit" disabled={submitting}>
                    {submitting ? <span className="app-spinner app-spinner--light"></span> : "Sign up"}
                </button>
                {error && (
                    <div className="form-error">
                        {error}
                        </div>
                )}
                <p className="switch">
                    Already have an account?{" "}
                    <Link to="/login" className="link">
                        Login
                        </Link>
                </p>
            </div>
        </form>
      </div>
      <div className="right">
        <div className="showcase">
            <p className="quote">"Plan your day, not your chaos."</p>
        </div>
      </div>
    </div>
  )
}

export default Register
