export type ReviewSource = "instagram" | "google" | "direct";

export type CustomerReview = {
  id?: string;
  source: ReviewSource;
  reviewer: string;
  quote: string;
  reply?: string;
  image?: string;
  alt?: string;
  dateLabel: string;
  sourceUrl?: string;
  rating?: number | null;
  featured?: boolean;
};

export type GoogleReviewResponse = {
  configured: boolean;
  unavailable?: boolean;
  reviews: Array<{
    id: string;
    reviewer: string;
    quote: string;
    rating: number;
    dateLabel: string;
    sourceUrl: string;
  }>;
  googleMapsUri: string;
  rating?: number;
  reviewCount?: number;
};
