import React,{useState} from "react"
import { authService } from "../fbase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const Auth = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAcount] =useState(true);

  const onChange = (e) => {
    const {target : {name, value}} = e;
    if(name === "email"){
      setEmail(value)
    } else if(name === "password"){
      setPassword(value)
    }
  }
  const onSubmit = async(e) => {
    e.preventDefault();
    //기본행위가 실행되는것을 막는다 (새로고침 진행안되도록)
    try{
      let data;
      if(newAccount) {
        data = await createUserWithEmailAndPassword(authService, email, password);
        } else {
        data = await signInWithEmailAndPassword(authService, email, password);
        }
        console.log(data);
    } catch (error) {
      console.log(error);
    }
    
  }
return(
<div>
  <form onSubmit={onSubmit}>
    <input onChange={onChange} name="email" type="email" placeholder="email" required value={email}/>
    <input onChange={onChange} name="password" type="password" placeholder="password" required value={password}/>
    <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
  </form>
  <div>
    <button>Continue with Google</button>
    <button>Continue with Github</button>
  </div>
</div>
)
}

export default Auth;