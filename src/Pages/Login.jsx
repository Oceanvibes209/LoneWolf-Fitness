import { Navigate } from "react-router-dom";
import { useState } from "react";
import "../Styles/Login.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

// eslint-disable-next-line react/prop-types
function Login({ user }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  const handleSignUp = () => {
    if (!email || !password) return;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentail) => {
        const user = userCredentail.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleSignIn = () => {
    if (!email || !password) return;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentail) => {
        const user = userCredentail.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  if (user) {
    return <Navigate to="/Home"></Navigate>;
  }

  return (
    <div className="login-body">
      <h1>Lonewolf Fitness</h1>

      <div className="Login-container">
        <div className="login-img">
          <img src="/Lonewolf-Fitness.jpg"></img>
        </div>
        <div className="login-form">
          <form>
            {isSignUpActive && <legend>Sign Up</legend>}
            {!isSignUpActive && <legend>Sign In</legend>}

            <label htmlFor="Email">
              <input
                type="email"
                name="Email"
                placeholder="email"
                onChange={handleEmailChange}
                required
              ></input>
            </label>

            <label htmlFor="Password">
              <input
                type="password"
                name="Password"
                placeholder="password"
                onChange={handlePasswordChange}
                required
              ></input>
            </label>

            {isSignUpActive && (
              <button className="loginBtn" type="button" onClick={handleSignUp}>
                Sign Up
              </button>
            )}
            {!isSignUpActive && (
              <button className="loginBtn" type="button" onClick={handleSignIn}>
                Sign In
              </button>
            )}

            {isSignUpActive && (
              <p> Already have an account ?
              <a
                // type="button"
                className="login-create-acct"
                onClick={handleMethodChange}
              >
                Login
              </a></p>
            )}
            {!isSignUpActive && (
              <p> Dont have an account?
              <a
                // type="button"
                className="login-create-acct"
                onClick={handleMethodChange}
              >
                Create an account
              </a></p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
