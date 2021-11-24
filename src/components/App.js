import React,{useState}from "react"
import AppRouter from "./Router";
import {authService} from "../fbase"

function App() {
  console.log();
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn}/>
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
