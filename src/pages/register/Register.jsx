import React, { useState } from 'react'
import './register.scss'
import { Link,useNavigate} from 'react-router-dom'
const Register = () => {
    const [formData,setFormData]=useState({
    username:"",
    email:"",
    password:"",
    confirmPassword:"",
})
const [error,setError]=useState("")
const navigate=useNavigate()
const handleChange=(e)=>{
    setFormData({
        ...formData,[e.target.name]:e.target.value,
    })
}
const handleSubmit=(e)=>{
    e.preventDefault();
    if(formData.password !== formData.confirmPassword){
        setError("Passwords do not match")
        return;
    }
    setError("")
    alert("Registration successful")
    navigate("/login")
}
  return (
    <div className='register'>
      <div className="right">
        <img
        src="https://i.pinimg.com/474x/01/5c/d1/015cd1a2012af33b64bdf68583165341.jpg" 
        alt="Weclome to the productivity App"
        />
      </div>
      <div className="left">
        <form onSubmit={handleSubmit}>
            <div className="wrapper">
                <h1>Sign up</h1>
                <p className="body">
                     Organize your tasks,manage your time,and boost your productivity with intuitive interface
                </p>
                <input type="text" name="username" placeholder='username' onChange={handleChange} required />
                <input type="email" name="email" placeholder='email' onChange={handleChange} required />
                <input type="password" name="password" placeholder='password' onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder='confirmPassword' onChange={handleChange} required/>
                <button className='btn' type="submit">Sign up</button>
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
                    Already have an account <span style={{color:"#007bff",cursor:"pointer"}}>
                    <Link to="/login" style={{textDecoration:"none"}}>
                        Login
                        </Link>
                        </span>
                </p>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Register
