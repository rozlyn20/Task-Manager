import React, { useState } from 'react'
import './login.scss'
import axios from "axios";
import { Link,useNavigate} from 'react-router-dom'
import { API_BASE_URL } from "../../config";

const Login = () => {
    const [formData,setFormData]=useState({
        email:"",
        password:"",
    })
    const [error,setError]=useState("");
    const navigate=useNavigate()
    const handleChange=(e)=>{
    setFormData({
        ...formData,[e.target.name]:e.target.value,
    })
}
const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post(
            `${API_BASE_URL}/api/auth/login`,
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

    }
};
return (
    <div className='login'>
      <div className="right">
        <img
        src="https://i.pinimg.com/474x/01/5c/d1/015cd1a2012af33b64bdf68583165341.jpg" 
        alt="Weclome to the productivity App"
        />
      </div>
      <div className="left">
        <form onSubmit={handleSubmit}>
            <div className="wrapper">
                <h1>Sign In</h1>
                
                {/* <input type="text" name="username" placeholder='username' onChange={handleChange} autoComplete='username' required /> */}
                <input type="email" name="email" placeholder='email' onChange={handleChange} autoComplete='current-password' required />
                <input type="password" name="password" placeholder='password' onChange={handleChange} required />
                
                <button className='btn' type="submit">Login</button>
                {error && (
                    <div style={{backgroundColor:"#ffe0e0",
                         color:"#d8000c",
                         padding:"12px 16px", 
                         border:"1px solid #d8000c", 
                         borderRadius:"8px", 
                         marginTop:"10px",
                        fontWeight:"500"
                        }}>
                        {error}
                        </div>
                )}
                <p style={{textAlign:"center"}}>
                        Don't have an account? <span style={{color:"#007bff",cursor:"pointer"}}>
                        <Link to="/register" style ={{textDecoration:"none"}}>
                        Sign up
                        </Link></span>
                </p>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Login
