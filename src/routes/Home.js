import React, { useEffect, useState } from "react"
import { dbService } from "../fbase";
import { collection, addDoc, getDocs, onSnapshot, query,orderBy } from "firebase/firestore";
const Home = ({userObj}) => {
  
  console.log(userObj);

  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);


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
    try {
      const docRef = await addDoc(collection(dbService, "nweets"), {
        text:nweet,
        createdAt:Date.now(),
        creatorId : userObj.uid
        
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setNweet("");
    }
  const onChange = (event) => {
    const { target : {value}} = event;
    setNweet(value);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet) =>
        <div key={nweet.id}>
          <h4>{nweet.text}</h4>
          </div>)}
      </div>
    </div>
);
  }
export default Home;