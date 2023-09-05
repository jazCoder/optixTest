import {useState, useEffect} from 'react';
import {
    getAverageReview,
    movieCompanyDetail,
    movieCompanyEndpoint,
    movieDetail,
    moviesEndpoint
} from "./moviesService";
import {Movies} from "./Movies";
import {Loading} from "./Loading";

// TODO: use https://comforting-starlight-f3456a.netlify.app/.netlify/functions/movieCompanies
const mockMovieCompanyData: movieCompanyDetail[] = [
    {id: "1", name: "Test Productions"},
];

// TODO: use https://comforting-starlight-f3456a.netlify.app/.netlify/functions/movies
const mockMovieData: movieDetail[] = [
    {id: "1", reviews: [6,8,3,9,8,7,8], title: "A Testing Film", filmCompanyId: "1", cost : 534, releaseYear: 2005},
    {id: "2", reviews: [5,7,3,4,1,6,3], title: "Mock Test Film", filmCompanyId: "1", cost : 6234, releaseYear: 2006},
];

export const App = () =>  {
    const fetchMovieData = async (endPoint: string): Promise<void> => {
        setIsLoading(true);
        if (moviesFromApi.length === 0 || refresh) {
            try {
                const response = await fetch(endPoint);
                const result = await response.json();

                setMoviesFromApi(result);
                setIsLoading(false);

            } catch (error) {
                console.error("Error fetching movies JSON:", error);
            }
        }
        setIsLoading(false);
    };

    const fetchMovieCompanyData = async (endPoint: string): Promise<void> => {
        setIsLoading(true);
        if (movieCompanyDataFromApi.length === 0 || refresh) {
            try {
                const response = await fetch(endPoint);
                const result = await response.json();

                setMovieCompanyDataFromApi(result);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching companies JSON:", error);
            }
        }
        setIsLoading(false);
    };

    const loadData = (): void => {
        void fetchMovieData(moviesEndpoint);
        void fetchMovieCompanyData(movieCompanyEndpoint);
    }

    const sortMovies = (): void => {
        const moviesByAverageReview = [...moviesFromApi]
            .map((movie) => {
                const averageReview = movie.averageReview = getAverageReview(movie.reviews);

                return {
                    ...movie,
                    averageReview,
                }
            })
            .sort((movieA, movieB) => movieB.averageReview - movieA.averageReview);

        setMoviesFromApi(moviesByAverageReview);
    }

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [moviesFromApi, setMoviesFromApi] = useState<movieDetail[]>([]);
    const [movieCompanyDataFromApi, setMovieCompanyDataFromApi] = useState<movieCompanyDetail[]>([]);
    let refresh = false;

    const refreshButton = (): void => {
        refresh = true;
        void fetchMovieData(moviesEndpoint);
        void fetchMovieCompanyData(movieCompanyEndpoint);
    }

    useEffect(() => {
        loadData();
    }, []);

    const dataFetchError = moviesFromApi.length === 0 || movieCompanyDataFromApi.length === 0;

    if (!isLoading && !dataFetchError) {
        return <Movies
            refreshButton={refreshButton}
            sortMovies = {sortMovies}
            moviesFromApi={moviesFromApi}
            movieCompanyDataFromApi={movieCompanyDataFromApi}
        />
    } else {
        return <Loading/>
    }
}