import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { dbService } from "../fbase";

const Nweet = ({nweetObj, isOwner}) => {
  
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);


  const NweetTextRef =doc(dbService, "nweets", `${nweetObj.id}`);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure?");  
    if (ok){
      await deleteDoc(NweetTextRef );
        } else {

    }
  }
  
  const toggleEditing = () => setEditing((prev)=> !prev)

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(nweetObj, newNweet);
    await updateDoc(NweetTextRef,{
      text: newNweet,
    });
    setEditing(false);
  }

  const onChange = (e) => {
    const {target:{value}} = e;
    setNewNweet(value);
  } 
  return(

    <div>

    {editing ? 
    <>
    <form onSubmit={onSubmit}>
      <input onChange={onChange} type="text" placeholder="edit your nweet" value={newNweet}required/>
      <input type="submit" value="updated"></input>
      </form>
      
    <button onClick={toggleEditing}>Change</button>
    </> 
    : <h4>{nweetObj.text}</h4>}

      {isOwner &&  (
      <>
      <button onClick={onDeleteClick}>Delete Nweet</button>
      <button onClick={toggleEditing}>Edit Nweet</button>
      </>
      )}
    </div>

)}

export default Nweet;

