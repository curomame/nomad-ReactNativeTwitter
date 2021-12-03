import React, { useState, useEffect } from "react"
import { authService, dbService } from "../fbase"
import {useNavigate} from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Profile = ({refreshUser, userObj}) => {
  const navigate = useNavigate();
  
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/")
  }

const getMyNweets = async() => {
  const q = query(collection(dbService, "nweets"),orderBy("createdAt", "asc") ,where("creatorId", "==", userObj.uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
})

}

  useEffect(()=>{
    getMyNweets();
  },[])

const onSubmit = async (e) => {
  e.preventDefault();
  if(userObj.displayName !== newDisplayName){
    await updateProfile(userObj, {displayName :newDisplayName});
    refreshUser();
  }
}

const onChange = (e) => {
  const {
    target : {value} 
  } = e;
  setNewDisplayName(value);
}

return <>
<form onSubmit={onSubmit}>
  <input onChange ={onChange} type="text" placeholder="Display name" value={newDisplayName}/>
  <input type="submit" value="Update Profile"/>
</form>
<button onClick={onLogOutClick}>Log Out</button>
</>
}

export default Profile;