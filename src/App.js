import './App.css';
import React, { useState, useEffect } from 'react';
import { AuthContextProvider } from './components/context/AuthContext';
import Home from './components/pages/Home';
import Log from './components/pages/Log';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Protected from './components/pages/Protected';
import Favourites from './components/pages/Favourites';
import { auth, db } from './firebase';
import { collection, addDoc, getDocs, getDoc, setDoc, query, where, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import PublicListDetails from './components/pages/PublicListDetails';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [userLists, setuserLists] = useState([]);
  const [publicLists, setPublicLists] = useState([]);

  useEffect(() => {
    const fetchuserLists = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(collection(db, 'userLists'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const lists = [];
          querySnapshot.forEach((doc) => {
            lists.push({ id: doc.id, ...doc.data() });
          });
          setuserLists(lists);
          setPublicLists(lists);
          console.log(user.email);
        } catch (error) {
          console.error('Error fetching user lists:', error);
          toast.error('Error fetching user lists');
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchuserLists();
      } else {
        setuserLists([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addList = async (listName, isPublic) => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Check if a list with the same name already exists for this user
        const q = query(collection(db, 'userLists'), where('userId', '==', user.uid), where('name', '==', listName));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          toast.error('List with this name already exists');
          return;
        }

        // Create the new list
        const newDocRef = await addDoc(collection(db, 'userLists'), {
          userId: user.uid,
          name: listName,
          movies: [],
          isPublic: isPublic
        });
        const newList = { id: newDocRef.id, name: listName, movies: [], isPublic };
        setuserLists(prevLists => [...prevLists, newList]);

        if (isPublic) {
          await setDoc(doc(db, 'publicLists', newDocRef.id), {
            name: listName,
            movies: [],
            userId: user.uid,
            username : user.displayName
          });
        }
        toast.success('List added successfully');
      } catch (error) {
        console.error('Error adding list:', error);
        toast.error('Error adding list');
      }
    } else {
      console.error('User is not logged in');
      toast.error('User is not logged in');
    }
  };


  const addMovieToList = async (listId, movie) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const listRef = doc(db, 'userLists', listId.toString());
        const listDoc = await getDoc(listRef);

        if (!listDoc.exists()) {
          console.error('List does not exist');
          toast.error('List does not exist');
        } else {
          const moviesArray = listDoc.data().movies;
          const movieExists = moviesArray.some(m => m.imdbID === movie.imdbID);
          
          if (movieExists) {
            toast.error('Movie already exists in the list');
            return;
          }

          await updateDoc(listRef, {
            movies: arrayUnion(movie),
          });

          const updatedLists = userLists.map(list => {
            if (list.id === listId.toString()) {
              return { ...list, movies: [...list.movies, movie] };
            }
            return list;
          });
          setuserLists(updatedLists);
          if (listDoc.data().isPublic) {
            const publicListRef = doc(db, 'publicLists', listId.toString());
            await updateDoc(publicListRef, {
              movies: arrayUnion(movie),
            });
          }
          toast.success('Movie added to list successfully');
        }
      } catch (error) {
        console.error('Error adding movie to list:', error);
        toast.error('Error adding movie to list');
      }
    }
  };

  const removeMovieFromList = async (listId, movieId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const listRef = doc(db, 'userLists', listId);
        const listDoc = await getDoc(listRef);
        if (!listDoc.exists()) {
          console.error('List does not exist');
          toast.error('List does not exist');
        } else {
          const moviesArray = listDoc.data().movies;
          if (Array.isArray(moviesArray)) {
            const movieToRemove = moviesArray.find(movie => movie.imdbID === movieId);
            if (movieToRemove) {
              await updateDoc(listRef, {
                movies: arrayRemove(movieToRemove),
              });
              // Remove the movie from the public list if the list is public
              if (listDoc.data().isPublic) {
                const publicListRef = doc(db, 'publicLists', listId);
                await updateDoc(publicListRef, {
                  movies: arrayRemove(movieToRemove),
                });
              }
              // Update local state
              const updatedLists = userLists.map(list => {
                if (list.id === listId) {
                  return { ...list, movies: list.movies.filter(movie => movie.imdbID !== movieId) };
                }
                return list;
              });
              setuserLists(updatedLists);
              toast.success('Movie removed from list successfully');
            } else {
              console.error('Movie not found in the list');
              toast.error('Movie not found in the list');
            }
          } else {
            console.error('moviesArray is not an array');
            toast.error('Error removing movie from list');
          }
        }
      } catch (error) {
        console.error('Error removing movie from list:', error);
        toast.error('Error removing movie from list');
      }
    } else {
      console.error('User not authenticated');
      toast.error('User not authenticated');
    }
  };

  const deleteList = async (listId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const listRef = doc(db, 'userLists', listId);
        const listDoc = await getDoc(listRef);
        if (listDoc.exists() && listDoc.data().isPublic) {
          // Delete the list from the public lists collection
          await deleteDoc(doc(db, 'publicLists', listId));
        }
        // Delete the list from the user lists collection
        await deleteDoc(listRef);
        // Update local state
        const updatedLists = userLists.filter(list => list.id !== listId);
        setuserLists(updatedLists);
        toast.success('List deleted successfully');
      } catch (error) {
        console.error('Error deleting list:', error);
        toast.error('Error deleting list');
      }
    }
  };

  return (
    <AuthContextProvider>
      <ToastContainer
        position="bottom-left"
        autoClose={3000} // Adjust autoClose time as needed
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Log />} />
        <Route path="/main" element={
          <Protected>
            <Home userLists={userLists} addMovieToList={addMovieToList} removeMovieFromList={removeMovieFromList} deleteList={deleteList} publicLists={publicLists} />
          </Protected>} />
        <Route path="/favorites" element={
          <Protected>
            <Favourites userLists={userLists} addList={addList} removeMovieFromList={removeMovieFromList} deleteList={deleteList} />
          </Protected>
        } />
        <Route path="/list/:listId" element={
          <PublicListDetails userLists={userLists} />
        } />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
