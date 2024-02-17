import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
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
          <Route index element={user ? <Navigate to="/Home" /> : <Login />}/> {/*Loads a specific page as default */}
          <Route path='/Login' element={user ? <Navigate to="/Home" /> : <Login />}/> {/*The default and /Login routes now check if user is truthy (indicating an authenticated user) and redirect to /Home if so. Otherwise, they render the Login component. */}
          <Route path='/Home' element={<ProtectedRoute user={user}><Home/></ProtectedRoute> }/>{/*Private Route */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
