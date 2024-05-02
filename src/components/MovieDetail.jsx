import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './header.jsx';
import '../App.css';
import defaultProfileImage from '../images/default-profile-image.jpg';
import defaultReviewImage from '../images/default-review-image.jpg';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [credits, setCredits] = useState([]);
    const [posterPath, setPosterPath] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllCredits, setShowAllCredits] = useState(false);
    const [visibleCredits, setVisibleCredits] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiKey = '4dcc21464991fe06bb4ceb635c4a803b';

                const urls = [
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fr`, // Movie details
                    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}`, // Movie reviews
                    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=fr`, // Movie credits
                    `https://api.themoviedb.org/3/movie/${id}/images?api_key=${apiKey}&language=en` // Movie images
                ];

                const allResponses = await Promise.all(urls.map(url => fetch(url)));
                const [movieData, reviewsData, creditsData, posterData] = await Promise.all(allResponses.map(response => response.json()));

                // Prends les infos de Movie details
                const { production_countries, genres, runtime } = movieData;

                setMovie({
                    ...movieData,
                    production_countries: production_countries.map(country => country.name),
                    genres: genres.map(genre => genre.name),
                    runtime: `${runtime} min`
                });

                setReviews(reviewsData.results);
                setCredits(creditsData.cast);

                const posterPath = posterData.posters.length > 0 ? posterData.posters[0].file_path : '';
                setPosterPath(posterPath);

                setIsLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des données : ', error);
                setError(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        setVisibleCredits(credits.slice(0, 4));
    }, [credits]);

    const handleShowAllCredits = () => {
        const limitedCredits = credits.slice(0, 19);
        setVisibleCredits(limitedCredits);
        setShowAllCredits(true);
    };
    

    const handleCloseAllCredits = () => {
        setVisibleCredits(credits.slice(0, 4));
        setShowAllCredits(false);
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
    <div className="movie-detail-container">
      <div className="movie-poster">
        {posterPath && <img src={`https://image.tmdb.org/t/p/w500/${posterPath}`} alt={movie.title} />}
      </div>
      <div className="movie-details">
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
        <p><strong>Pays d'origine:</strong> {movie.production_countries.join(', ')}</p>
        <p><strong>Durée:</strong> {movie.runtime}</p>
        <p><strong>Catégorie:</strong> {movie.genres.join(', ')}</p>
        {movie.release_date && (
          <p><strong>Année de sortie:</strong> {new Date(movie.release_date).getFullYear()}</p>
        )}
      </div>
    </div>
    <h2 className='reviews-h2'>Acteurs</h2>
    <div className="separator"></div>
    <div className="credits-carousel">
      {visibleCredits.map(credit => (
        <div key={credit.id}>
          <img src={credit.profile_path ? `https://image.tmdb.org/t/p/w200/${credit.profile_path}` : defaultProfileImage} alt={credit.name} />
          <p><strong>{credit.name}</strong></p>
          <p>{credit.character}</p>
        </div>
      ))}
      {!showAllCredits && <button className='button-credits' onClick={handleShowAllCredits}>Voir tous les acteurs</button>}
      {showAllCredits && <button className='button-credits' onClick={handleCloseAllCredits}>Réduire</button>}
    </div>
    <div className="reviews-container">
      <h2 className='reviews-h2'>Avis de la rédaction</h2>
      <div className="separator"></div>
      <ul>
        {reviews.map(review => (
          <div className='reviews' key={review.id}>
              <img className='review-avatar' src={review.author_details.avatar_path ? `https://image.tmdb.org/t/p/w200/${review.author_details.avatar_path}` : defaultReviewImage} alt={review.author} />
              <div className='content-review'>
                <p><strong>{review.author}</strong></p>
                <p>{review.content}</p>
              </div>
          </div>
        ))}
      </ul>
    </div>
  </div>
</div>
)};

export default MovieDetail;