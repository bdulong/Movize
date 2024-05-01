import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './header.jsx';
import '../App.css';

const MovieStart = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = '4dcc21464991fe06bb4ceb635c4a803b';
        // const language = 'fr';

        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
        const data = await response.json();
        setMovies(data.results);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données : ', error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Chargement des données...</div>;
  }

  if (error) {
    return <div>Une erreur s'est produite : {error.message}</div>;
  }

  return (
    <div>
      <Header />
      <div className='content'>
      <h1>Films populaires</h1>
      <div className="movies-list">
        {movies.map(movie => (
          <Link to={`/movie/${movie.id}`} key={movie.id}>
            <div className="movie-item">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`Affiche de ${movie.title}`}
                />
              )}
              <h2>{movie.title}</h2>
            </div>
          </Link>
        ))}
      </div>
      </div>
  </div>
  );
};

export default MovieStart;