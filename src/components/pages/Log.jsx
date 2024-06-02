import React, { useEffect } from 'react';
import { useAuth } from './../context/AuthContext';
import { useNavigate } from "react-router-dom";

const Log = () => {
  const { googleSignIn, user } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user !== null) { // Check if user is not null or undefined
      navigate("/main");
    }
  }, [user, navigate]);

  return (
    <div className="backimg">
    <div id="loginPage" className='container'>
      <h1 className='logintext'>Explore the Movie library...</h1>
      <div className='logbutton-container'>
        <button className="custom-google-button" onClick={handleGoogleSignIn}>
          <i className="fa-brands fa-google fa-bounce"></i> {/* Corrected className */}
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
    </div>
  );
};

export default Log;
