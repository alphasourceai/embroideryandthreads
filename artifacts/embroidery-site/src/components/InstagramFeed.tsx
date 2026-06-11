// TODO: Instagram Integration
// Replace STATIC_POSTS below with live posts from the Instagram Basic Display API.
// API endpoint: https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=YOUR_ACCESS_TOKEN
// Steps to connect:
//   1. Register an app at https://developers.facebook.com/
//   2. Add the "Instagram Basic Display" product to your app
//   3. Generate a long-lived access token for @embroideryandthreads
//   4. Store the token as an environment variable (INSTAGRAM_ACCESS_TOKEN) in the API server
//   5. Add a proxy endpoint to the API server (e.g. GET /api/instagram/feed) that fetches
//      and caches the response — keep the token server-side, never expose it to the browser
//   6. Replace STATIC_POSTS with the result of fetching that endpoint
//   Each post object should have: id, mediaUrl, permalink, caption (optional)

export interface InstagramPost {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
}

// Static placeholder posts — swap out for API results when connected
const STATIC_POSTS: InstagramPost[] = [
  { id: "1", mediaUrl: "/ig-post-1.png", permalink: "https://www.instagram.com/embroideryandthreads/", caption: "Our Instagram" },
  { id: "2", mediaUrl: "/ig-post-2.png", permalink: "https://www.instagram.com/embroideryandthreads/", caption: "Recent work" },
  { id: "3", mediaUrl: "/ig-post-3.png", permalink: "https://www.instagram.com/embroideryandthreads/", caption: "Custom pieces" },
];

interface InstagramFeedProps {
  posts?: InstagramPost[];
}

export default function InstagramFeed({ posts = STATIC_POSTS }: InstagramFeedProps) {
  // Use the first post as the featured "homepage" screenshot, the rest as supplementary
  const [featured, ...supplementary] = posts;

  return (
    <section id="instagram" className="py-24 px-6 md:px-12 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs tracking-widest uppercase text-muted-foreground font-medium">Follow Along</p>
          <h2 className="text-3xl md:text-5xl text-foreground">
            On <span className="italic text-primary">Instagram</span>
          </h2>
          <p className="text-muted-foreground font-light max-w-sm mx-auto text-sm">
            See the latest custom pieces and new collections as they happen.
          </p>
        </div>

        {/* Asymmetric layout: featured large left, supplementary stacked right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
          {/* Featured — Instagram profile/homepage screenshot, shown large */}
          <a
            href={featured.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="md:col-span-2 relative group block overflow-hidden rounded-2xl aspect-[4/3]"
            data-testid="instagram-featured"
            aria-label="View on Instagram"
          >
            <img
              src={featured.mediaUrl}
              alt={featured.caption ?? "Embroidery & Threads on Instagram"}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-400 flex items-end p-5">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 bg-white/90 text-foreground text-xs font-medium tracking-wide px-3 py-1.5 rounded-full">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                @embroideryandthreads
              </span>
            </div>
          </a>

          {/* Supplementary — stacked smaller grid screenshots */}
          <div className="flex flex-col gap-3">
            {supplementary.map((post, i) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group block overflow-hidden rounded-2xl flex-1 min-h-0"
                style={{ aspectRatio: "4/3" }}
                data-testid={`instagram-post-${post.id}`}
                aria-label={post.caption ?? "View Instagram post"}
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption ?? "Instagram post"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-400" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <a
            href="https://www.instagram.com/embroideryandthreads/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium text-sm tracking-wide"
            data-testid="instagram-follow-button"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Follow @embroideryandthreads
          </a>
        </div>
      </div>
    </section>
  );
}
