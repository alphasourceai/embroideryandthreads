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

test("selects the three newest written four- and five-star reviews", () => {
  const review = (name: string, rating: number, publishTime: string) => ({
    name: `places/example/reviews/${name}`,
    rating,
    publishTime,
    text: { text: `${name} review` },
  });
  const feed = normalizeGoogleReviewFeed({
    googleMapsUri: "https://www.google.com/maps/place/example",
    reviews: [
      review("older", 5, "2026-01-01T12:00:00Z"),
      review("newest", 5, "2026-04-01T12:00:00Z"),
      review("excluded", 3, "2026-05-01T12:00:00Z"),
      review("middle", 4, "2026-03-01T12:00:00Z"),
      review("newer", 5, "2026-02-01T12:00:00Z"),
    ],
  });

  assert.deepEqual(
    feed.reviews.map(({ quote }) => quote),
    ["newest review", "middle review", "newer review"],
  );
});
