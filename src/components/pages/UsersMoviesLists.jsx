import React, { useState } from 'react';
import MoviesList from './MoviesList';
import AddListModal from './AddListModal';
import { Link, useNavigate } from 'react-router-dom';
import nolistsimage from './../../Assests/nolistsimage.jpg'


export default function UsersMoviesLists({ userLists, removeMovieFromList, addList, addMovieToList, deleteList, isFavoritesPage }) {
  const [showModal, setShowModal] = useState(false);
  const [visibilityFilter, setVisibilityFilter] = useState('public'); // 'public' or 'private'
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listIdToDelete, setListIdToDelete] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [isModalOpenformovie, setIsModalOpenformovie] = useState(false);
  const [modalMovie, setModalMovie] = useState(null);
  const navigate = useNavigate();



  const fetchMovieDetails = async (title) => {
    const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=6a7eb2c1`);
    const data = await response.json();
    setMovieDetails(data);
  };




  const handleInfoButtonClick = (movie) => {
    setModalMovie(movie);
    fetchMovieDetails(movie.Title);
    setIsModalOpenformovie(true);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleVisibility = (filter) => {
    setVisibilityFilter(filter);
    // Log the filtered lists to the console
    const filteredLists = userLists.filter(list => list.isPublic === (filter === 'public'));
    console.log(`${filter} lists:`, filteredLists);
  };

  const handleDeleteButtonClick = (listId) => {
    setListIdToDelete(listId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteList = async () => {
    try {
      await deleteList(listIdToDelete);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const getShareableLink = (listId) => {
    return `${window.location.origin}/list/${listId}`;
  };

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Could not copy text: ', err));
  };


  const [movieToRemove, setMovieToRemove] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

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

  const handleCloseModal = () => {
    setIsModalOpenformovie(false);
    setModalMovie(null);
  };


  const listToDelete = userLists.find(list => list.id === listIdToDelete);
  const listNameToDelete = listToDelete ? listToDelete.name : '';

  const filteredLists = userLists.filter(list => list.isPublic === (visibilityFilter === 'public'));
  const hasLists = filteredLists.length > 0;

  return (
    <>
      <div className="totusecont">
        <div className="homecont">
          <div className="nav-barhw">
            <button onClick={() => navigate('/main')} className='back-button'>
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </button>
            <h3>Favourite Lists&nbsp;<i class="fa-solid fa-heart heart"></i></h3>
            <div className="button-group">
              <button onClick={() => toggleVisibility('public')} className='btn'>
                Public Lists
              </button>
              <button onClick={() => toggleVisibility('private')} className='btn'>
                Private Lists
              </button>
            </div>
            <button
              onClick={openModal}
              className='addinglist'
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
        {hasLists ? (
          filteredLists
            .filter(list => list.movies.length > 0)
            .map((list, index) => (
              <div key={index} className="list-container">
                <div className="list-header">
                  <div className="list-name-buttons">
                    <h3 className="list-name">
                      {index + 1}. {list.name}
                    </h3>
                    &nbsp;
                    <button onClick={() => handleDeleteButtonClick(list.id)} className='tbtn tbtn-danger tbtn-icon-only'>
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>&nbsp;
                    {list.isPublic && (
                      <button onClick={() => copyToClipboard(getShareableLink(list.id))} className='ibtn ibtn-danger ibtn-icon-only'>
                        <i className="fa fa-clone" aria-hidden="true"></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="movie-grid">
                  {list.movies.map((movie, index) => (
                    <div key={index} className='movie-card'>
                      <img src={movie.Poster} alt={movie.Title} className='movie-image' />
                      <div className='card-body'>
                        <div className='button-container'>
                          <button onClick={() => handleRemoveButtonClick(movie)} className='remove-button'>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                          <button className='info-button' onClick={() => handleInfoButtonClick(movie)}>
                            <i className="fa-solid fa-info-circle"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="no-lists">
            <img src={nolistsimage} alt="No Lists Available" />
            <p>No {visibilityFilter === 'public' ? 'public' : 'private'} lists available.</p>
          </div>
        )}






        <AddListModal
          isOpen={showModal}
          onClose={closeModal}
          addList={addList}
        />

        {isDeleteModalOpen && listIdToDelete && (
          <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content glass-effect">
                <div className="modal-header">
                  <h5 className="modal-title">Delete "{listNameToDelete}" list?</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setIsDeleteModalOpen(false)}>
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-footer">
                  {/* <button type="button" className="btn btn-danger" onClick={handleDeleteList}>
                  Remove
                </button> */}
                  <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleDeleteList}>
                    <i class="fa-solid fa-trash"></i>&nbsp;Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isRemoveModalOpen && movieToRemove && (
          <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content glass-effect">
                <div className="modal-header">
                  <h5 className="modal-title">Remove "{movieToRemove.Title}" from the list?</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setIsRemoveModalOpen(false)}>
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleConfirmRemove}>
                    <i class="fa-solid fa-trash"></i>&nbsp;Remove
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
                  {movieDetails ? (
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
                    <p>Loading...</p>
                  )}
                </div>
                {/* <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
              </div> */}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
