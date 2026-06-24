import React from 'react'
import './tomDay.scss';
import Tomorrow from '../../components/tomorrow/Tomorrow';
import Sidebar from '../../components/sidebar/Sidebar';


const TomDay = () => {
  return (
    <div className="tomday">
        <Sidebar/>
    <div className="dayContainer">
        <div className="today-title">
            <p>Tomorrow</p>
           

        </div>
        <Tomorrow/>
      
    </div>
    </div>
  )
}

export default TomDay
