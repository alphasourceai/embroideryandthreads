export type PublicGoogleReview = {
  id: string;
  reviewer: string;
  quote: string;
  rating: number;
  dateLabel: string;
  sourceUrl: string;
};

type GooglePlacesReview = {
  name?: unknown;
  rating?: unknown;
  publishTime?: unknown;
  relativePublishTimeDescription?: unknown;
  googleMapsUri?: unknown;
  text?: { text?: unknown };
  originalText?: { text?: unknown };
  authorAttribution?: {
    displayName?: unknown;
    uri?: unknown;
  };
};

type GooglePlacesPayload = {
  googleMapsUri?: unknown;
  rating?: unknown;
  userRatingCount?: unknown;
  reviews?: unknown;
};

export type GoogleReviewFeed = {
  reviews: PublicGoogleReview[];
  googleMapsUri: string;
  rating?: number;
  reviewCount?: number;
};

export function normalizeGoogleReviewFeed(value: unknown): GoogleReviewFeed {
  const payload = isRecord(value) ? (value as GooglePlacesPayload) : {};
  const placeUrl = safeGoogleUrl(payload.googleMapsUri);
  const rawReviews = Array.isArray(payload.reviews)
    ? (payload.reviews as GooglePlacesReview[])
    : [];
  const reviews = rawReviews
    .flatMap((review, index) => {
      const quote = cleanText(
        review?.text?.text ?? review?.originalText?.text,
        1_500,
      );
      const rating = Number(review?.rating);
      if (!quote || !Number.isInteger(rating) || rating < 4 || rating > 5) {
        return [];
      }

      const reviewer =
        cleanText(review?.authorAttribution?.displayName, 120) ||
        "Google customer";
      const sourceUrl =
        safeGoogleUrl(review?.googleMapsUri) ||
        safeGoogleUrl(review?.authorAttribution?.uri) ||
        placeUrl;
      const id =
        cleanText(review?.name, 180) ||
        `google-${reviewer.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`;
      const publishTime = Date.parse(cleanText(review?.publishTime, 60));

      return [
        {
          review: {
            id,
            reviewer,
            quote,
            rating,
            dateLabel: reviewDateLabel(review),
            sourceUrl,
          },
          publishTime: Number.isNaN(publishTime) ? 0 : publishTime,
        },
      ];
    })
    .sort((left, right) => right.publishTime - left.publishTime)
    .slice(0, 3)
    .map(({ review }) => review);

  const rating = Number(payload.rating);
  const reviewCount = Number(payload.userRatingCount);
  return {
    reviews,
    googleMapsUri: placeUrl,
    ...(Number.isFinite(rating) ? { rating } : {}),
    ...(Number.isInteger(reviewCount) && reviewCount >= 0
      ? { reviewCount }
      : {}),
  };
}

export async function fetchGoogleReviewFeed({
  apiKey,
  placeId,
}: {
  apiKey: string;
  placeId: string;
}) {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "googleMapsUri,rating,userRatingCount,reviews.name,reviews.rating,reviews.publishTime,reviews.relativePublishTimeDescription,reviews.googleMapsUri,reviews.text,reviews.originalText,reviews.authorAttribution",
      },
      signal: AbortSignal.timeout(8_000),
    },
  );

  if (!response.ok) {
    throw new Error(`Google Places returned ${response.status}.`);
  }
  return normalizeGoogleReviewFeed(await response.json());
}

function reviewDateLabel(review: GooglePlacesReview) {
  const published = cleanText(review.publishTime, 60);
  if (published) {
    const date = new Date(published);
    if (!Number.isNaN(date.valueOf())) {
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);
    }
  }

  return (
    cleanText(review.relativePublishTimeDescription, 80) || "Google review"
  );
}

function safeGoogleUrl(value: unknown) {
  const text = cleanText(value, 500);
  if (!text) return "";
  try {
    const url = new URL(text);
    return url.protocol === "https:" &&
      (url.hostname === "google.com" ||
        url.hostname.endsWith(".google.com") ||
        url.hostname === "goo.gl")
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

function cleanText(value: unknown, limit: number) {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, limit)
    : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
