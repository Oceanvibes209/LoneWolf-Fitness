// import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Home() {
    const handleSignOut = () =>{
        signOut(auth).then(()=> console.log('Sign Out')).catch((error)=> console.log(error))
    };


    return(
        <div>
            <h1>Home page</h1>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    )
}

export default Home;