import React,{useState} from "react"
import { authService } from "../fbase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GithubAuthProvider, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Auth = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAcount] =useState(true);
  const [error, setError] = useState("");
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
    } catch (error) {
      setError(error.message);
    }
    
  }

const toggleAccount = () => setNewAcount((prev) => !prev);






const onSocialClick = async (event) => {
  const {
  target: { name },
  } = event;
  let provider;
  if (name === "google") {
  provider = new GoogleAuthProvider();
  } else if (name === "github") {


  provider = new GithubAuthProvider();
  }
  await signInWithPopup(authService, provider);
  };

return(
  
<div>
  <form onSubmit={onSubmit}>
    <input onChange={onChange} name="email" type="email" placeholder="email" required value={email}/>
    <input onChange={onChange} name="password" type="password" placeholder="password" required value={password}/>
    <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
    {error}
    <span onClick={toggleAccount}>{newAccount ? "Sign in" : "Create Account"}</span>
  </form>
  <div>
    <button onClick={onSocialClick} name="google">Continue with Google</button>
    <button onClick={onSocialClick} name="github">Continue with Github</button>
  </div>
</div>
)
}

export default Auth;