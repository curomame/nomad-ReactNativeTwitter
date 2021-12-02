import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { deleteObject,ref } from "firebase/storage"
import { dbService, storageService } from "../fbase";

const Nweet = ({nweetObj, isOwner}) => {
  
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);


  const NweetTextRef =doc(dbService, "nweets", `${nweetObj.id}`);
  const urlRef = ref(storageService, nweetObj.attachmentUrl);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure?");  
    if (ok){
      await deleteDoc(NweetTextRef );
      await deleteObject(urlRef)
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
      { isOwner &&
      <>
      <form onSubmit={onSubmit}>
      <input onChange={onChange} type="text" placeholder="edit your nweet" value={newNweet}required/>
      <input type="submit" value="updated"></input>
      </form>
      
    <button onClick={toggleEditing}>Change</button>
    </>}
    </> 
    : <h4>{nweetObj.text}</h4>}
    {nweetObj.attachmentUrl && (<img src={nweetObj.attachmentUrl} width="50px" height="50px" alt="alt"/> )}

      {isOwner &&  (
      <>
      <button onClick={onDeleteClick}>Delete Nweet</button>
      <button onClick={toggleEditing}>Edit Nweet</button>
      </>
      )}
    </div>

)}

export default Nweet;

