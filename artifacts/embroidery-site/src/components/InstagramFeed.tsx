import OptimizedImage from "@/components/OptimizedImage";

export interface InstagramPost {
  image: string;
  permalink: string;
  caption?: string;
}

const INSTAGRAM_URL = "https://www.instagram.com/embroideryandthreads/";

interface InstagramFeedProps {
  posts?: InstagramPost[];
}

export default function InstagramFeed({
  posts = [],
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
          {posts.map((post, index) => (
            <a
              key={`${post.image}-${index}`}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-polaroid"
              data-testid={
                index === 0
                  ? "instagram-featured"
                  : `instagram-post-${index + 1}`
              }
              aria-label={post.caption ?? "View Instagram post"}
              data-reveal
            >
              <span className="washi-tape" aria-hidden="true" />
              <OptimizedImage
                src={post.image}
                alt={post.caption ?? "Embroidery & Threads on Instagram"}
                width="1384"
                height="1249"
                loading="lazy"
                widths={[420, 720, 1000]}
                sizes="(max-width: 920px) min(460px, 100vw), 33vw"
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
