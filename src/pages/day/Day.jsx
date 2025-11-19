import React from 'react'
import './day.scss';
import Today from '../../components/today/Today';
import Sidebar from '../../components/sidebar/Sidebar';


const Day = () => {
  return (
    <div className="day">
        <Sidebar/>
    <div className="dayContainer">
        <div className="today-title">
            <p>Today</p>
            <span>4</span>

        </div>
        <Today/>
      
    </div>
    </div>
  )
}

export default Day
