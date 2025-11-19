import React,{useState} from 'react'
import "./week.scss";
import { Add,NavigateNext, TodayOutlined} from '@mui/icons-material'
import New from '../NewModal/New';

const tasks=[
    {
        id:"task1",
        title:"Edit video",
        date:"13-07-2025",
        Category:"Work",
    },
    {
        id:"task2",
        title:"Schedule class",
        date:"13-07-2025",
        Category:"Personal",
    },
    {
        id:"task3",
        title:"upload youtube video",
        date:"13-07-2025",
        Category:"Work",
    },
    {
        id:"task4",
        title:"Schedule appointment",
        date:"15-07-2025",
        Category:" Other",
    },
];
const Week = () => {
     const [openTask,setOpenTask]= useState(null);
      const [showEditor,setShowEditor]=useState(false);
     
     
         const handleCloseEditor= ()=>{
             setShowEditor(false)
         }
     
    
        const toggleDetails = (id)=> {
            setOpenTask(openTask=== id ? null : id);
        };
  return (
    <div className="week">
      <p className="title"> Week </p>
            <ul>
              <li  stle={{border:"1px solid #e6e6e6"}} onClick={()=>{
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
  )
}

export default Week
