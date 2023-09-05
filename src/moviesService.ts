export interface movieDetail {
    id: string,
    reviews: number[],
    title: string,
    filmCompanyId: string,
    cost: number,
    releaseYear: number,
    averageReview?: number,
}

export interface movieCompanyDetail {
    id: string,
    name: string,
}

export interface submitResponse {
    message: string,
}

export const moviesEndpoint: string = 'https://comforting-starlight-f3456a.netlify.app/.netlify/functions/movies';
export const movieCompanyEndpoint: string = 'https://comforting-starlight-f3456a.netlify.app/.netlify/functions/movieCompanies';
export const submitReviewEndpoint: string = 'https://comforting-starlight-f3456a.netlify.app/.netlify/functions/submitReview';

export const getAverageReview = (reviews: number[]): number => {
    return +(reviews.reduce((acc: number, rating: number) => acc + rating, 0) / reviews.length).toFixed(1);
}


