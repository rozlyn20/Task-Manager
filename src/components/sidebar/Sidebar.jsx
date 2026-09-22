import React from 'react'
import "./sidebar.scss";
import { useNavigate, NavLink } from 'react-router-dom';
import {CalendarMonthOutlined, Checklist, Logout, SpaceDashboardOutlined, SearchOutlined, StickyNote2, TaskAlt, ViewKanbanOutlined, InsightsOutlined} from '@mui/icons-material';

const Sidebar = () => {
 const navigate =useNavigate();
  const handleLogOut=()=>{
    navigate('/login')

  }
  return (
    <div className="sidebar">
      <div className="top">
        <div className="brand">
            <span className="brand-icon">
                <TaskAlt />
            </span>
            <span className="brand-name">TaskFlow</span>
        </div>
        <div className="search">
            <SearchOutlined className="search-icon" />
            <input type="text" placeholder='Search'/>
        </div>
      </div>
      <div className="center">
      <ul>
        <p className='title'>Menu</p>
        <NavLink to="/home" className={({isActive}) => isActive ? "active" : ""}>
          <li>
            <SpaceDashboardOutlined className="icon"/>
            <span>Home</span>
          </li>
        </NavLink>
        <NavLink to="/day" className={({isActive}) => isActive ? "active" : ""}>
          <li>
            <Checklist className="icon"/>
            <span>Today</span>
          </li>
        </NavLink>
        <NavLink to="/tomDay" className={({isActive}) => isActive ? "active" : ""}>
          <li>
            <Checklist className="icon"/>
            <span>Tomorrow</span>
          </li>
        </NavLink>
        <NavLink to="/kanban" className={({isActive}) => isActive ? "active" : ""}>
          <li>
            <ViewKanbanOutlined className="icon"/>
            <span>Board</span>
          </li>
        </NavLink>
        <NavLink to="/analytics" className={({isActive}) => isActive ? "active" : ""}>
          <li>
            <InsightsOutlined className="icon"/>
            <span>Analytics</span>
          </li>
        </NavLink>
        <NavLink to="/calendar" className={({isActive}) => isActive ? "active" : ""}>
          <li>
            <CalendarMonthOutlined className='icon'/>
            <span>Calendar</span>
          </li>
        </NavLink>
        <NavLink to="/sticky" className={({isActive}) => isActive ? "active" : ""}>
          <li>
            <StickyNote2 className="icon"/>
            <span>Sticky wall</span>
          </li>
        </NavLink>
      </ul>

      {/* <p className="title">
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
       */}

      {/* <p className="title">Tags</p>
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
      </div> */}
     </div>
      <div className="bottom">
        <ul>
            <li onClick={handleLogOut}>
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
