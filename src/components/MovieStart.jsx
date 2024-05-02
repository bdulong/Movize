import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './header.jsx';
import '../App.css';

const MovieStart = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = '4dcc21464991fe06bb4ceb635c4a803b';

        // Récupérer les films populaires
        const popularResponse = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr`);
        const popularData = await popularResponse.json();
        let popularMovies = popularData.results;

        // Limiter les films populaires à 10
        popularMovies = popularMovies.slice(0, 10);

        // Récupérer les films à venir
        const upcomingResponse = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=fr`);
        const upcomingData = await upcomingResponse.json();
        let upcomingMovies = upcomingData.results;

        // Limiter les films à venir à 10
        upcomingMovies = upcomingMovies.slice(0, 10);

        setPopularMovies(popularMovies);
        setUpcomingMovies(upcomingMovies);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données : ', error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        const apiKey = '4dcc21464991fe06bb4ceb635c4a803b';
        const searchResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr-FR&query=${searchQuery}`);
        const searchData = await searchResponse.json();
        setSearchResults(searchData.results);
      } catch (error) {
        console.error('Erreur lors de la recherche de films : ', error);
      }
    };

    searchMovies();
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

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
        <div>
          <div className='searchbar'>
            <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder='Trouvez un film'/>
          </div>
          <div className="movies-list">
            {searchResults.slice(0, 5).map(movie => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <div className="movie-item">{movie.poster_path && (<img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Affiche de ${movie.title}`}/>)}</div>
            </Link>
            ))}
          </div>
        </div>
        <div>
          <h4>Films populaires cette semaine</h4>
          <div className="separator"></div>
          <div className="movies-list">
            {popularMovies.map(movie => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <div className="movie-item">{movie.poster_path && (<img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Affiche de ${movie.title}`}/>)}</div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4>Films à venir</h4>
          <div className="separator"></div>
          <div className="movies-list">
            {upcomingMovies.map(movie => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <div className="movie-item">{movie.poster_path && (<img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Affiche de ${movie.title}`}/>)}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )};

export default MovieStart;