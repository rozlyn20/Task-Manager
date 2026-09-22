import React from 'react'
import { Link } from 'react-router-dom'
import { TaskAlt, CalendarMonthOutlined, StickyNote2Outlined } from '@mui/icons-material'
import './welcome.scss'
const Welcome = () => {
  return (
    <div className='welcome'>
      <div className="left">
        <div className="wrapper">
            <div className="brand">
                <span className="brand-icon"><TaskAlt/></span>
                <span className="brand-name">TaskFlow</span>
            </div>
            <h1>Organize your work.<br/>Reclaim your time.</h1>
            <p className="body">
                Plan your day, track tasks and jot quick notes — all in one clean, distraction-free workspace built for getting things done.
            </p>
           <Link
  to="/register"
  className="btn"
>
  Get Started — it's free
</Link>
            <p className="switch">
                Already have an account?{" "}
                <Link to="/login" className="link">
                        Log in
                        </Link>
            </p>
        </div>
      </div>
      <div className="right">
        <div className="showcase">
            <div className="showcase-card card-1">
                <TaskAlt/>
                <div>
                    <strong>Daily focus</strong>
                    <span>Today &amp; Tomorrow views</span>
                </div>
            </div>
            <div className="showcase-card card-2">
                <CalendarMonthOutlined/>
                <div>
                    <strong>Calendar view</strong>
                    <span>Plan across the month</span>
                </div>
            </div>
            <div className="showcase-card card-3">
                <StickyNote2Outlined/>
                <div>
                    <strong>Sticky wall</strong>
                    <span>Quick notes &amp; ideas</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
