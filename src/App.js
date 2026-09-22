import React from 'react'
import { BrowserRouter as Router ,Routes,Route} from "react-router-dom";
import Home from './pages/homepage/Home'
import Day from './pages/day/Day'
import TomDay from './pages/tomDay/TomDay'
import Sticky from './pages/sticky/Sticky'
import Welcome from './pages/welcome/Welcome'
import Register from './pages/register/Register'
import Login from './pages/login/Login'
import MyCalendar from './pages/calendar/MyCalendar';
import Kanban from './pages/kanban/Kanban';
import Analytics from './pages/analytics/Analytics';
const App = () => {
  return (
    <Router>
    <div style={{backgroundColor:"#f6f7fb", minHeight:"100vh"}}>
    <Routes>
      <Route path="*" element={<Welcome/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/day" element={<Day/>}/>
      <Route path="/tomDay" element={<TomDay/>}/>
      <Route path="/kanban" element={<Kanban/>}/>
      <Route path="/analytics" element={<Analytics/>}/>

      <Route path="/calendar" element={<MyCalendar/>}/>
      <Route path="/sticky" element={<Sticky/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
    </div>
    </Router>
  )
}

export default App
