import React from 'react'
import "./sidebar.scss";

import {Add, CalendarMonthOutlined, Checklist, Logout, Menu,NavigateNext, SearchOutlined, StickyNote2} from '@mui/icons-material';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <div className="menu">
            <span className="menu-title">
                Menu
            </span>
            <Menu/>
            
        </div>
        <div className="search">
            <input type="text" placeholder='Search'/>
            <SearchOutlined/>
        </div>
      </div>
      <div className="center"> 
      <ul>
        <p className='title'>Tasks</p>
        
        <li>
          <NavigateNext className="icon"/>
            <span>Upcoming</span>
            <div className="counter">5</div>
              </li>
            <li>
              <Checklist className="icon"/>
                <span> Today</span>
                <div className="counter">4</div>
            </li>
             <li>
              <CalendarMonthOutlined/>

                <span> Calendar</span>
            </li>
            <li>
              <StickyNote2 className="icon"/>
                <span> Sticky wall</span>
            </li>
          </ul>
         
            
      
      
      <p className="title">
        Category
      </p>
      
    <ul>
        <li>
            <div className="color" style={{backgroundColor:"#e74c3c"}}></div>
            <span>Personal</span>
            <div className="counter">5</div>
        </li>
        <li>
            <div className="color" style={{backgroundColor:"#3498db"}}></div>
            <span>Work</span>
            <div className="counter">10</div>
        </li>
        <li>
            <div className="color" style={{backgroundColor:"#f1c40f"}}></div>
            <span>Other</span>
            <div className="counter">8</div>
        </li>
      </ul>
      

      <p className="title">Tags</p>
      <div className="tags">
        <div className="tag" style={{backgroundColor:"blue"}}>
          <span style={{color:"white"}}>TAG 1</span>
        </div>
        <div className="tag" style={{backgroundColor:"green"}}>
          <span style={{color:"white"}}>TAG 2</span>
        </div>
        <div className="tag add-tag">
            <input type="text" placeholder='New Tag name' style={{border:"none", background:"transparent",outline:"None", width:"80%",color:"#333"}}/>
            <Add style={{fontSize:"18px",cursor:"pointer"}}/>
        </div>
      </div>
     </div>
     <br/>
      <div className="bottom">
        <ul>
            <li>
              <Logout className="icon"/>
                <span>
                    Sign out
                </span>
            </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
