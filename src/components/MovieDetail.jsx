import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';
import defaultProfileImage from '../images/default-profile-image.jpg';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [credits, setCredits] = useState([]);
    const [posterPath, setPosterPath] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllCredits, setShowAllCredits] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiKey = '4dcc21464991fe06bb4ceb635c4a803b';
                const language = 'fr';

                const urls = [
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=${language}`, // Movie details
                    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}`, // Movie reviews
                    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`, // Movie credits
                    `https://api.themoviedb.org/3/movie/${id}/images?api_key=${apiKey}` // Movie images
                ];

                const allResponses = await Promise.all(urls.map(url => fetch(url)));
                const [movieData, reviewsData, creditsData, posterData] = await Promise.all(allResponses.map(response => response.json()));

                // Extracting additional movie details
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

    const handleShowAllCredits = () => {
        setShowAllCredits(true);
    };

    const handleCloseAllCredits = () => {
        setShowAllCredits(false);
    };

    if (isLoading) {
        return <div>Chargement des données...</div>;
    }

    if (error) {
        return <div>Une erreur s'est produite : {error.message}</div>;
    }

    return (
        <div className="movie-detail-container">
            <h1>{movie.title}</h1>
            {posterPath && <img src={`https://image.tmdb.org/t/p/w500/${posterPath}`} alt={movie.title} />}
            <p><strong>Catégorie:</strong> {movie.genres.join(', ')}</p>
            <p><strong>Pays d'origine:</strong> {movie.production_countries.join(', ')}</p>
            <p><strong>Durée:</strong> {movie.runtime}</p>
            <p>{movie.overview}</p>
            <h2>Crédits</h2>
            <div className="credits-carousel">
                {showAllCredits ? (
                    credits.map(credit => (
                        <div key={credit.id}>
                            <img src={credit.profile_path ? `https://image.tmdb.org/t/p/w200/${credit.profile_path}` : defaultProfileImage} alt={credit.name} />
                            <p><strong>{credit.name}</strong> - {credit.character}</p>
                        </div>
                    ))
                ) : (
                    credits.slice(0, 5).map(credit => (
                        <div key={credit.id}>
                            <img src={credit.profile_path ? `https://image.tmdb.org/t/p/w200/${credit.profile_path}` : defaultProfileImage} alt={credit.name} />
                            <p><strong>{credit.name}</strong> - {credit.character}</p>
                        </div>
                    ))
                )}
                {showAllCredits && <button onClick={handleCloseAllCredits}>Fermer les crédits</button>}
                {!showAllCredits && <button onClick={handleShowAllCredits}>Voir tous les crédits</button>}
            </div>
            <h2>Avis</h2>
            <ul>
                {reviews.map(review => (
                    <li key={review.id}>
                        <p><strong>{review.author}</strong></p>
                        <p>{review.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieDetail;