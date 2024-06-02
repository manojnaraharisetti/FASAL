import React, { useState, useEffect } from 'react';
import { useAuth } from './../context/AuthContext';
import Navbar from './Navbar';
import SearchBox from './SearchBox';
import MoviesList from './MoviesList';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { auth } from './../../firebase';
import Loader from './Loader';
import { toast } from 'react-toastify'; 




export default function Home({ userLists, addMovieToList, removeMovieFromList, publicLists }) {
  const { logOut, user } = useAuth();
  const navigate = useNavigate();
  const usertok = auth.currentUser;
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

   // Function to display success toast
   const notifySuccess = (message) => toast.success(message);
   // Function to display error toast
   const notifyError = (message) => toast.error(message);
 



  const handleDropdownChange = (e) => {
    setSelectedListId(e.target.value);
  };

  const handleSave = async () => {
    if (selectedListId) {
      await addMovieToList(selectedListId, selectedMovie);
      notifySuccess('Movie added to list successfully'); // Notify success
    } else {
      notifyError('Please select a list'); // Notify error if no list selected
    }
    setIsModalOpen(false);
  };

  const getMovieRequest = async (searchValue, filter) => {
    let url = `http://www.omdbapi.com/?s=${searchValue}&apikey=6a7eb2c1`;

    if (filter !== 'all') {
      url += `&type=${filter}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.Search) {
        setMovies(data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getMovieRequest(searchValue || 'Batman', filter);

  }, [searchValue, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    getMovieRequest(searchValue || 'Batman', newFilter);
  };

  const handleAddToListClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    console.log(isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    console.log(selectedMovie)
  };


  return (
    <div className='hoemcont hide-scrollbar'>
      <Navbar searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className="nav-barh">
        <div className='button-group'>
          <button onClick={() => handleFilterChange('all')} className='btn'>All</button>
          <button onClick={() => handleFilterChange('movie')} className='btn'>Movies</button>
          <button onClick={() => handleFilterChange('series')} className='btn'>Series</button>
        </div>
        <Link className="favoutite nav-link" to="/favorites">
          <i className="fa-solid fa-heart" data-title="Add to Favorites"></i>
        </Link>
      </div>

      {isLoading ? (
        <Loader /> // Render the Loader component when data is loading
      ) : (
        <div className='row'>
          <MoviesList movies={movies} onAddToListClick={handleAddToListClick} userLists={userLists} addMovieToList={addMovieToList} removeMovieFromList={removeMovieFromList} publicLists={publicLists} />
        </div>
      )}
      {isModalOpen && selectedMovie && (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add "{selectedMovie.Title}" to a list</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                {userLists.length > 0 ? (
                  <div>
                    <select
                      onChange={handleDropdownChange}
                      defaultValue=""
                      className='form-select mt-2'
                    >
                      <option value="" disabled>Select a list</option>
                      {userLists.map((list, idx) => (
                        <option key={idx} value={list.id}>{list.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <p>No lists available. Please create a list first.</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {selectedListId && (
                  <button type="button" className="btn btn-primary" onClick={handleSave}>
                    Save
                  </button>
                )}
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
