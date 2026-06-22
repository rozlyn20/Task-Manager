import React, { useState } from 'react'
import './sticky.scss'
import Sidebar from "../../components/sidebar/Sidebar"
import StickyNote from '../../components/StickyNote/StickyNote'
import StickyModal from '../../components/StickyModal/StickyModal'
import { Add } from '@mui/icons-material'

const Sticky = () => {
    const [wall,setWall]=useState([
        {
            id:1,
            title: 'Math exam',
            content:'review chhapter 1-5',
            color:'#fce38a'
        },
        {
            id:2,
            title: 'Djanggo project',
            content:'implement payment system',
            color:'#e19aceff'
        },
        {
            id:3,
            title: 'Math exam',
            content:'ljfogjrgv teu rw ruwcr03t  80ew ecr w uw40ti k  0ruw0 tjw x 3yrwrewnr aur9 a n4m,n f9ewurorl 4r w4r 9ur292ur 9u ru93qeuhdhgckn;j resj jwhferjgk zflsjfjzjr jrrkgdorr tru lzj prs kfk rio  fisd fslpff kn ifj sfddvn gsr jp kn t ljfogjrgv teu rw ruwcr03t  80ew ecr w uw40ti k  0ruw0 tjw x 3yrwrewnr aur9 a n4m,n f9ewurorl 4r w4r 9ur292ur 9u ru93qeuhdhgckn;j resj jwhferjgk zflsjfjzjr jrrkgdorr tru lzj prs kfk rio  fisd fslpff kn ifj sfddvn gsr jp kn t',
            color:'#a773d1ff'
        },
    ]);
    const [modalOpen,setModalOpen]=useState(false);
    const [editingNote,setEditingNote]=useState(null);


    const openAddModal =()=>{
        setEditingNote(null)
        setModalOpen(true);
    };

    const openEditModal =(note)=>{
        setEditingNote(note);
        setModalOpen(true);
    };
    const closeModal=()=>{
        setModalOpen(false);
    };
    const handleSubmit= (data)=>{
        if(editingNote){
            setWall((prev)=>
                prev.map((note) => note.id === editingNote.id ? {...note,...data}:note)
               
            );
        }
        else{
            const newNote = {
                id:wall.length+1,
                ...data,
            };
        setWall((prev)=>[...prev,newNote]);
        }
        closeModal();

    };
const handleDelete=(id)=>{
    if(window.confirm("Are u sure u want todelete thhe sticky note")){
        setWall((prev)=>prev.filter((note)=>note.id !== id));
    }
};
  return (
    <div className='sticky'>
      <Sidebar/>
      <div className="stickyContainer">
        <p className="title"> Sticky Wall </p>

        <div className="row">
            {wall.map((note)=>(
                <StickyNote
                key={note.id} 
                title={note.title} 
                content={note.content} 
                color={note.color}
                onEdit= {()=>openEditModal(note)}
                onDelete={()=>handleDelete(note.id)}/>
            ))}
            <div className="stickyNote addNote" 
            onClick={openAddModal}
            style={{cursor:"pointer",backgroundColor:"lightgrey"}}>
                <Add className='icon'/>
            </div>


        </div>
        <StickyModal
        open={modalOpen} onClose={closeModal} onSubmit={handleSubmit}
        initialData= {editingNote}
        />
      </div>
    </div>
  )
}

export default Sticky
