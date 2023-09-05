import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {movieDetail, submitResponse, submitReviewEndpoint} from "./moviesService";

interface reviewFormProps {
    selectedMovie?: movieDetail,
    setSelectedMovie: Dispatch<SetStateAction<movieDetail | undefined>>,
}

export const ReviewForm = (props: reviewFormProps): ReactJSXElement => {
    const onReviewChange = (text: string) => {
        setReviewError(text.length > 100);
        setReview(text);
    }

    const onSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        let submitConfirmation;
        setLoading(true);

        try {
            const response = await fetch(submitReviewEndpoint, {
                method: 'POST',
                body: JSON.stringify({
                    review: e.target.value,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            submitConfirmation = await response.json() as submitResponse;
        } catch (error) {
            console.error("Error posting review:", error);
        }

        if(submitConfirmation) {
            setSubmitMessage(submitConfirmation.message);
            setLoading(false);
            setReview('');
        }
    };

    const [review, setReview] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [reviewError, setReviewError] = useState<boolean>(false);
    const [submitMessage, setSubmitMessage] = useState<string>('');
    const closeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSubmitMessage('');
    }, [props.selectedMovie])

    const getMovieChoice = (movie: movieDetail): ReactJSXElement => {
        return (
            <div>
                You have selected: <span className={'green movie-choice'}>'{movie.title}'</span>
            </div>
        );
    }

    const closeModal = ():void => {
        const btn = closeRef.current;
        btn && btn.classList.add('hide');
        setSubmitMessage('');
        props.setSelectedMovie(undefined);
    }

    return (
        <>
            <div className={`movie-text review-prompt ${!props.selectedMovie && !submitMessage ? 'show' : 'hide'}`}>Click on a movie to review</div>
            <div ref={closeRef} className={`review-container ${props.selectedMovie ? 'show' : 'hide'}`}>
                <div className={`review-form-wrapper`}>
                    <div className={`review-form-content`}>
                        <button onClick={() => closeModal()} className="movie-btn close">close</button>
                        <div className={`${submitMessage ? 'hide' : 'show'}`}>
                            <div className={`pad-left`}>{!props.selectedMovie ? `No Movie Selected` : getMovieChoice(props.selectedMovie)}</div>
                            {props.selectedMovie && <p className={`pad-left`}>Please leave a review below</p> }
                            {props.selectedMovie &&
                                <form className={`pad-left`} onSubmit={onSubmit}>
                                    <label>
                                        <textarea
                                            className={'movie-btn text-area pad-left'}
                                            name="reviewContent"
                                            value={review}
                                            onChange={(e) => onReviewChange(e.target.value)} />
                                    </label>
                                    <div className={`pad-left review-error ${reviewError ? 'show' : 'hide'}`}>Please enter max 100 characters</div>
                                    <button type="submit" className={'pad-left movie-btn submit-btn'} disabled={loading || reviewError}>{!loading ? `submit` : `loading`}</button>
                                </form>}
                            </div>
                        <div className={`pad-left movie-text submit-message ${submitMessage ? 'show' : 'hide'}`}>{submitMessage}</div>
                    </div>
                </div>
            </div>
        </>
    )
}