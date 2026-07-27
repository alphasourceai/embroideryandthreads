# Google Reviews Setup

The reviews page can display up to five public Google reviews automatically
through the Google Places API (New). The integration remains inactive until the
Google Business Profile exists and these Netlify environment variables are set:

- `GOOGLE_PLACE_ID`
- `GOOGLE_PLACES_API_KEY`

## Activation

1. Create and verify the Embroidery & Threads Google Business Profile.
2. Create or select a Google Cloud project with billing enabled.
3. Enable **Places API (New)**.
4. Create an API key and restrict it to **Places API (New)**. Keep it
   server-side; do not add it to a `VITE_` variable.
5. Find the business Place ID and add both variables in Netlify.
6. Redeploy the site.
7. Open `/reviews` and confirm the Google reviews and Google attribution link.

The Places API returns at most five reviews. If the client later needs a full
review archive, replace this feed with the Google Business Profile Reviews API,
which requires the business owner's OAuth authorization.
