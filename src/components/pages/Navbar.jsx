import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import SearchBox from './SearchBox';
import { useNavigate } from 'react-router-dom';
import { auth } from './../../firebase';
import { useAuth } from './../context/AuthContext';


export default function Navbar({ searchValue, setSearchValue }) {

    const { logOut, user } = useAuth();
    const navigate = useNavigate();
    const usertok = auth.currentUser;

    const handleSignOut = async () => {
        try {
            await logOut();
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const myFunction = async () => {
        try {
            if (!usertok) {
                console.log('User not authenticated');
                return;
            }

            const token = await usertok.getIdToken();
            console.log(token);
            // Now you can use the token for further actions
        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg  bgcolorisgf">
            <a className="navbar-brand" href="/">FLEX POP&nbsp;<i class="fa-solid fa-film"></i></a>
            {/* <li className="nav-item">
                <Link className="nav-link" to="/favorites">Favorites</Link>
            </li> */}
           
            <div className="search-box-container">
                <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
            </div>
            <div className="profcon">
                <div class="toolbardropdown">
                    <img src={user.photoURL || require("../../Assests/priofilephoto.png")} alt="User profile" class="toolbarcirclebtn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                    <div class="dropdown-menu userdropdown" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="#">Welcome, {user?.displayName}</a>
                        <a class="dropdown-item" href="#">{user.email}</a>
                        <a class="dropdown-item" onClick={handleSignOut}><i class="fa-solid fa-right-from-bracket"></i>&nbsp;Logout</a>
                    </div>
                </div>
            </div>
        </nav>
    )
}
