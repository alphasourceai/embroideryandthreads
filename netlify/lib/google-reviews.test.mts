import assert from "node:assert/strict";
import test from "node:test";
import { normalizeGoogleReviewFeed } from "./google-reviews.ts";

test("normalizes public Google review data", () => {
  const feed = normalizeGoogleReviewFeed({
    googleMapsUri: "https://www.google.com/maps/place/example",
    rating: 4.9,
    userRatingCount: 12,
    reviews: [
      {
        name: "places/example/reviews/one",
        rating: 5,
        publishTime: "2026-07-15T12:00:00Z",
        text: { text: "Beautiful work and thoughtful service." },
        authorAttribution: {
          displayName: "Local Customer",
          uri: "https://www.google.com/maps/contrib/example",
        },
      },
    ],
  });

  assert.equal(feed.rating, 4.9);
  assert.equal(feed.reviewCount, 12);
  assert.deepEqual(feed.reviews, [
    {
      id: "places/example/reviews/one",
      reviewer: "Local Customer",
      quote: "Beautiful work and thoughtful service.",
      rating: 5,
      dateLabel: "July 2026",
      sourceUrl: "https://www.google.com/maps/contrib/example",
    },
  ]);
});

test("omits rating-only and unsafe review records", () => {
  const feed = normalizeGoogleReviewFeed({
    googleMapsUri: "https://malicious.example/reviews",
    reviews: [
      { rating: 5 },
      {
        rating: 7,
        text: { text: "Invalid rating" },
      },
    ],
  });

  assert.deepEqual(feed.reviews, []);
  assert.equal(feed.googleMapsUri, "");
});
