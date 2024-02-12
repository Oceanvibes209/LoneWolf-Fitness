import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "./components/protectedRoute";
import { auth } from "./firebase";


function App() {
  const[user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user)=>{
      if (user){
        setUser(user);
        setIsFetching(false);

        return;
      }
      setUser(null);
      setIsFetching(false);
    });
    return () => unsubscribe();
  }, []);

  if (isFetching){
    return <h2>Loading...</h2>
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login/>}/> {/*Loads a specific page as default */}
          <Route path='/Login' element={<Login user={user}/>}/>
          <Route path='/Home' element={<ProtectedRoute user={user}><Home/></ProtectedRoute> }/>{/*Private Route */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
