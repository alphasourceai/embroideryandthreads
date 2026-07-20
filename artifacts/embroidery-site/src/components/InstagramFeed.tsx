export interface InstagramPost {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
}

const INSTAGRAM_URL = "https://www.instagram.com/embroideryandthreads/";

const STATIC_POSTS: InstagramPost[] = [
  {
    id: "1",
    mediaUrl: "/ig-post-1.png",
    permalink: INSTAGRAM_URL,
    caption: "Our Instagram",
  },
  {
    id: "2",
    mediaUrl: "/ig-post-2.png",
    permalink: INSTAGRAM_URL,
    caption: "Recent work",
  },
  {
    id: "3",
    mediaUrl: "/ig-post-3.png",
    permalink: INSTAGRAM_URL,
    caption: "Recent custom embroidery",
  },
];

interface InstagramFeedProps {
  posts?: InstagramPost[];
}

export default function InstagramFeed({
  posts = STATIC_POSTS,
}: InstagramFeedProps) {
  return (
    <section id="instagram" className="storybook-section instagram-section">
      <div className="content-wrap">
        <div className="section-heading" data-reveal>
          <span className="script-accent">follow along</span>
          <h2>On Instagram</h2>
          <div className="stitch-horizontal" aria-hidden="true" />
        </div>
        <p className="section-intro" data-reveal>
          See the latest custom pieces and new collections as they happen.
        </p>

        <div className="instagram-polaroid-grid">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-polaroid"
              data-testid={
                post.id === "1" ? "instagram-featured" : `instagram-post-${post.id}`
              }
              aria-label={post.caption ?? "View Instagram post"}
              data-reveal
            >
              <span className="washi-tape" aria-hidden="true" />
              <img
                src={post.mediaUrl}
                alt={post.caption ?? "Embroidery & Threads on Instagram"}
                width="1384"
                height="1249"
                loading="lazy"
              />
              <span className="instagram-caption">
                {post.caption ?? "View on Instagram"}
              </span>
            </a>
          ))}
        </div>

        <div className="centered-action" data-reveal>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="stitched-button stitched-button-ghost"
            data-testid="instagram-follow-button"
          >
            See more on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
