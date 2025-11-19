import React from 'react'
import { useState } from "react";

import './today.scss'
import { Add,NavigateNext, TodayOutlined} from '@mui/icons-material'
import New from '../NewModal/New';


const tasks =[

    {
        id: "task1",
        title:"Reaseach Content Ideas",
        date:"12-07-2025",
        Category:"Personal",
    },
     {
        id: "task2",
        title:"Create a Database of Guest authors",
        date:"14-07-2025",
        Category:" Other",
    },
     {
        id: "task3",
        title:"Renew driver's license",
        date:"12-07-2025",
        Category:"Personal",
    },
     {
        id: "task4",
        title:"Finish the backend of task management app",
        date:"12-07-2025",
        Category:"Work",
    }
];
const Today = () => {
    const [openTask,setOpenTask]= useState(null);
    const [showEditor,setShowEditor]=useState(false);


    const handleCloseEditor= ()=>{
        setShowEditor(false)
    }

    const toggleDetails = (id)=> {
        setOpenTask(openTask=== id ? null : id);
    };

  return (
    <div className='today'>
      <p className="title"> Today </p>
      <ul>
        <li  style={{border:"1px solid #e6e6e6"}} onClick={()=>{
            setShowEditor(true);
        }}>
            <Add/>
            <span style={{marginLeft:"10px"}}>Add New Task</span>

        </li>
        {tasks.map((task)=>(
            <li key={task.id}>
            <input type='checkbox' id={task.id}/>
            <label>
                {task.title}
                {openTask=== task.id && ( 
                    <div className="details">
                    <div className="left">
                        <TodayOutlined className='icon'/>
                        <p> {task.date}</p>


                    </div>
                    <div className="center">
                        <span>2</span>
                        <p>Subtasks </p>
                        </div> 
                    <div className="right">
                        <span className='color' 
                        style={{
                            backgroundColor:
                            task.Category==="Personal" 
                            ? "#e74c3c"
                            : task.Category=== "Work"
                            ? "#3498db"
                            : "#f1c40f"
                            }}> 
                            </span>
                        <p>
                            {task.Category}
                        </p>
                    </div>
               </div>)}
               
            </label>
            <NavigateNext 
            className={`icon ${openTask===task.id ? "rotate" : ""}`}  
            onClick={(e)=>{
                toggleDetails(task.id);
            
            }}
            />
            
        </li>

        ))}
       
        
        
      </ul>
      {showEditor &&(
        <New onClose={handleCloseEditor}/>
      )}
    </div> 
  );
};

export default Today
