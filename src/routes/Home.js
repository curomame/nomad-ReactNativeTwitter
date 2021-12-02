import React, { useEffect, useState } from "react"
import { dbService, storageService } from "../fbase";
import Nweet from "../components/Nweet"
import { collection, onSnapshot, query,orderBy, addDoc } from "firebase/firestore";
import { ref, uploadString,getDownloadURL } from "firebase/storage"
import {v4 as uuidv4} from "uuid"

const Home = ({userObj}) => {
  
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState();

  useEffect( () => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt","desc")
    );
      onSnapshot(q,(snapshot) => {
      const nweetArray = snapshot.docs.map(doc => ({id : doc.id, ...doc.data(),}))
      setNweets(nweetArray);
    })
    
  },[])

  const onSubmit = async (event) => {
  event.preventDefault();

  let attachmentUrl = "";

  if(attachment !== "") {
    const attachmentRef = ref(storageService,`${userObj.uid}/${uuidv4()}`)
    const response = await uploadString(attachmentRef, attachment, "data_url")
    attachmentUrl = await getDownloadURL(response.ref);
  }

  const nweetObj = {
    text : nweet,
    createdAt:Date.now(),
    creatorId : userObj.uid,
    attachmentUrl
  }

    try {
      const docRef = await addDoc(collection(dbService, "nweets"), nweetObj);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setNweet("");
    setAttachment("")

}

  const onChange = (event) => {
    const { target : {value}} = event;
    setNweet(value);
  }

  const onFileChange = (e) => {
    const {target : {files}} = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
      const {currentTarget: {result}} = finishedEvent;
      setAttachment(result)
    }
    reader.readAsDataURL(theFile);
  }

  const onClearAttachment =() => setAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
        <input type="file" accept="image/*" onChange={onFileChange}/>
        <input type="submit" value="Nweet" />
        {attachment && <div>
        <img src={attachment} width="50px" height="50px" alt=""/>
        <button onClick={onClearAttachment}>Clear Photo</button>
        </div>}
      </form>
      <div>
        {nweets.map((nweet) =>
      (<Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/> )
        )}
      </div>
    </div>
);
  }
export default Home;