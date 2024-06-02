import { list } from 'firebase/storage';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader';

export default function MoviesList({ movies, addMovieToList, userLists, isUserList, removeMovieFromList, isFavoritesPage, publicLists }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedListId, setSelectedListId] = useState('');
  const [movieToRemove, setMovieToRemove] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [modalMovie, setModalMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [isModalOpenformovie, setIsModalOpenformovie] = useState(false);
  const [isLoading, setIsLoading] = useState(false);





  const handleInfoButtonClick = (movie) => {
    setModalMovie(movie);
    fetchMovieDetails(movie.Title);
    setIsModalOpenformovie(true);
  };

  const handleCloseModal = () => {
    setIsModalOpenformovie(false);
    setModalMovie(null);
  };
  const fetchMovieDetails = async (title) => {
    setIsLoading(true); // Set loading to true before fetching
    const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=6a7eb2c1`);
    const data = await response.json();
    setMovieDetails(data);
    setIsLoading(false); // Set loading to false after fetching
  };



  const handleAddButtonClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };



  const handleDropdownChange = (e) => {
    setSelectedListId(e.target.value);
  };

  const handleSave = async () => {
    if (selectedListId) {
      await addMovieToList(selectedListId, selectedMovie);
    }
    setIsModalOpen(false);
  };

  const [listIdToRemoveFrom, setListIdToRemoveFrom] = useState(null);

  const handleRemoveButtonClick = (movie) => {

    // Find the list ID of the movie from the userLists
    const list = userLists.find(list => list.movies.some(m => m.imdbID === movie.imdbID));
    console.log(list)
    if (list) {
      setMovieToRemove(movie);
      setListIdToRemoveFrom(list.id);
      setIsRemoveModalOpen(true);
      // console.log(listIdToRemoveFrom)
    } else {
      console.error('List ID not found for the movie.');
    }
  };

  const handleConfirmRemove = async () => {
    if (movieToRemove && listIdToRemoveFrom) {
      await removeMovieFromList(listIdToRemoveFrom, movieToRemove.imdbID);
      setMovieToRemove(null);
      setListIdToRemoveFrom(null);
    }
  };



  return (
    <>

      {movies.map((movie, index) => (
        <div key={index} className='col-md-4 mb-3 movielistcard'>
          <div className='card'>
            <img src={movie.Poster} alt={movie.Title} className='card-img-top' />
            <div className='card-body'>
              {!isFavoritesPage && (
                <div className='button-container'>
                  <button
                    className='add-button'
                    onClick={() => handleAddButtonClick(movie)}
                  >
                    <i className="fa-regular fa-heart"></i>
                  </button>
                  <button
                    className='info-button'
                    onClick={() => handleInfoButtonClick(movie)}
                  >
                    <i className="fa-solid fa-info-circle"></i>
                  </button>
                </div>
              )}
              {isUserList && (
                <button
                  onClick={() => handleRemoveButtonClick(movie)} // Assuming each movie has a listId property
                  className='btn btn-danger mt-2'
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {isModalOpen && selectedMovie && (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content glass-effect">
              <div className="modal-header">
                <h5 className="modal-title">Add "{selectedMovie.Title}" to a list</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setIsModalOpen(false)}>
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                {userLists.length > 0 ? (
                  <div>
                    <select
                      onChange={handleDropdownChange}
                      defaultValue=""
                      className='form-select mt-2 styled-select'
                    >
                      <option value="" disabled>Select a list</option>
                      {userLists.map((list, idx) => (
                        <option key={idx} value={list.id}>{list.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className='nolistsava'>
                    <p>No lists available. Please create a list first.</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {selectedListId && (
                  <button type="button" className="btn btn-primary" onClick={handleSave}>
                    <i class="fa-solid fa-check"></i>&nbsp;Save
                  </button>
                )}
                <button type="button" className="btn-secondary " data-dismiss="modal" onClick={() => setIsModalOpen(false)}>
                  <i class="fa-solid fa-circle-xmark"></i>&nbsp;Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isRemoveModalOpen && movieToRemove && (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Remove "{movieToRemove.Title}" from the list?</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setIsRemoveModalOpen(false)}>
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={handleConfirmRemove}>
                  Remove
                </button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setIsRemoveModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {isModalOpenformovie && modalMovie && (
        <div id="bdetails" className='modal show hide-scrollbar moviemodal moviedisplay' style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <div className="modals">
              <div className="modal-image">
                <img src={modalMovie.Poster} alt="{modalMovie.Title}" />
              </div>
              <div className="modal-body">
                {isLoading ? (
                  <Loader/> // Render loader component while fetching data
                ) : (
                  movieDetails ? (
                    <>
                      <div className="modal-matter">
                        <h2>{movieDetails.Title} <a className='titlesuper'>{movieDetails.Country}</a></h2>
                        <p className='plot'>
                          {movieDetails.Plot}
                        </p>
                        <div className='act_dir'>
                          <div className='act_dir_1'>
                            <h4>Genre</h4>
                            <h6 className='button_act_dir'>{movieDetails.Genre}</h6>
                          </div>
                          <div className='act_dir_1'>
                            <h4>Language</h4>
                            <h6 className='button_act_dir'>{movieDetails.Language}</h6>
                          </div>
                        </div>
                        <div className='act_dir'>
                          <h4>Released: {movieDetails.Released}</h4>
                          <h4>Runtime: {movieDetails.Runtime}</h4>
                        </div>
                        <div className='act_dir'>
                          <div className='act_dir_1'>
                            <h4>Actors</h4>
                            <h6 className='button_act_dir'>{movieDetails.Actors}</h6>
                          </div>
                          <div className='act_dir_1'>
                            <h4>Writers</h4>
                            <h6 className='button_act_dir'>{movieDetails.Writer}</h6>
                          </div>
                        </div>
                        <div className="blink-container">
                          <Link className='blink' to={`https://www.imdb.com/title/${movieDetails.imdbID}`} target="_blank" rel="noopener noreferrer">IMDB Stats</Link>
                        </div>
                        <ul>
                          <li className='bshow'>IMDB Rating: {movieDetails.imdbRating}</li>
                          <li className='bshow'>IMDB Votes: {movieDetails.imdbVotes}</li>
                          <li className='bshow'>Collection: {movieDetails.BoxOffice}</li>
                        </ul>

                        <h4>Awards: {movieDetails.Awards}</h4>
                      </div>
                    </>
                  ) : (
                    <p>No data available.</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}



    </>
  );
}
