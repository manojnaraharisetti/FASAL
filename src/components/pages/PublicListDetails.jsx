import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase'; // Ensure you have the correct path to your firebase config
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Loader from './Loader';

export default function PublicListDetails() {
  const { listId } = useParams();
  const [listDetails, setListDetails] = useState(null);
  const [modalMovie, setModalMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [isModalOpenformovie, setIsModalOpenformovie] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  const fetchMovieDetails = async (title) => {
    setIsLoading(true); // Set loading to true before fetching
    const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=6a7eb2c1`);
    const data = await response.json();
    setMovieDetails(data);
    setIsLoading(false); // Set loading to false after fetching
  };

  const handleInfoButtonClick = (movie) => {
    setModalMovie(movie);
    fetchMovieDetails(movie.Title);
    setIsModalOpenformovie(true);
  };

  const handleCloseModal = () => {
    setIsModalOpenformovie(false);
    setModalMovie(null);
  };

  useEffect(() => {
    const fetchListDetails = async () => {
      const docRef = doc(db, 'publicLists', listId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListDetails({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log('No such document or the list is not public!');
      }
    };

    fetchListDetails();
  }, [listId]);

  if (!listDetails) {
    return <p>List not found or it is not public.</p>;
  }

  return (
    <div className='totusecontpub'>
      <h2>List name : {listDetails.name}</h2>
      <p>Created by: {listDetails.username}</p>
      <div className="movie-grid">
        {listDetails.movies.map((movie, index) => (
          <div key={index} className="movie-card">
              <img src={movie.Poster} alt={movie.Title} className="card-img-top" />
            <div className="card-body">
            <div className='button-container'>
              <button
                    className='info-button'
                    onClick={() => handleInfoButtonClick(movie)}
                  >
                    <i className="fa-solid fa-info-circle"></i>
                  </button>
                  </div>
            </div>
          </div>
        ))}
      </div>

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
    </div>

    
  );
}
