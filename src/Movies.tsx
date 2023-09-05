import {
    getAverageReview,
    movieCompanyDetail,
    movieDetail,
} from "./moviesService";
import {useRef, useState} from "react";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {ReviewForm} from "./ReviewForm";

interface moviesProps {
    refreshButton: () => void,
    sortMovies: () => void,
    moviesFromApi: movieDetail[],
    movieCompanyDataFromApi: movieCompanyDetail[],
}

export const Movies = (props: moviesProps): ReactJSXElement => {
    const [selectedMovie, setSelectedMovie] = useState<movieDetail | undefined>(undefined);
    const movieLength = useRef<number>(props.moviesFromApi.length);
    const movieRowsRef = useRef<HTMLDivElement[]>([]);

    const onMovieSelect = (index: number): void => {
        document.querySelectorAll('.table-row').forEach(row => row.classList.remove('active-row'));
        const row = movieRowsRef.current[index];
        row && row.classList.add('active-row')
    }

    return (
        <>
        <div className={'main-container'}>
            <div className={'overlay'}></div>
            <h2>Welcome to the Movie database!</h2>
            <div className={'movie-buttons'}>
                <button className={'movie-btn'} onClick={props.sortMovies}>sort by review</button>
                <button className={'movie-btn'} onClick={props.refreshButton}>refresh data</button>
            </div>
            <div className={'movie-text'}>Total movies displayed: <span className={'green'}>{movieLength.current}</span></div>

            <div className={'table-container'}>
                <div className={'table-row-header'}>
                    <span>Title</span>
                    <span>Review</span>
                    <span>Film Company</span>
                </div>

                {props.moviesFromApi.map((movie: movieDetail, index) =>
                    <div
                        className={'table-row'}
                        key={movie.id}
                        ref={(row: HTMLDivElement) => movieRowsRef.current[index] = row}
                        onClick={() => {
                            setSelectedMovie(movie);
                            onMovieSelect(index);
                        }}
                    >
                        <div className={'movie-row title'}>
                            {movie.title}
                        </div>
                        <div className={'movie-row'}>
                            <span className={'mobile-title'}>Review:</span>{getAverageReview(movie.reviews)}
                        </div>
                        <div className={'movie-row company'}>
                            {props.movieCompanyDataFromApi.find((f: movieCompanyDetail) => f.id === movie.filmCompanyId)?.name}
                        </div>
                    </div>
                )}
            </div>
        </div>
        <div>
            <ReviewForm selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie}/>
        </div>
        </>
    );
}