import { MapPin, Instagram, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const REVIEWS = [
  {
    id: "1",
    reviewer: "@ambermnolan",
    quote: "had @embroideryandthreads make a sweatshirt for me",
    reply: "so glad you like it!!!",
    imageSrc: "/review-1.png",
    altText: "Aggies Texas A&M custom embroidered sweatshirt shared by @ambermnolan",
    timeAgo: "27 weeks ago",
  },
  {
    id: "2",
    reviewer: "@stewards_of_stoke",
    quote: "Custom embroidery in action — tagged @EMBROIDERYANDTHREADS",
    reply: null,
    imageSrc: "/review-2.png",
    altText: "Behind-the-scenes of the embroidery machine making a custom design for @stewards_of_stoke",
    timeAgo: "14 weeks ago",
  },
  {
    id: "3",
    reviewer: "@natasha.kenton1",
    quote: "So many beautiful gifts to give from @embroideryandthreads",
    reply: null,
    imageSrc: "/review-3.png",
    altText: "Beautifully packaged Embroidery & Threads gifts under the Christmas tree, shared by @natasha.kenton1",
    timeAgo: "24 weeks ago",
  },
];

export default function Reviews() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" data-testid="reviews-nav-home">
            <div className="w-9 h-9 rounded-full bg-[#E5B5C4] flex items-center justify-center text-white font-serif italic text-lg shadow-sm">
              B
            </div>
            <span className="font-serif tracking-wide text-foreground">Embroidery & Threads</span>
          </Link>
          <Link href="/" data-testid="reviews-nav-back">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground rounded-full">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-16 pb-10 px-6 md:px-12 text-center">
        <div className="container mx-auto max-w-2xl space-y-4">
          <p className="text-xs tracking-widest uppercase text-muted-foreground font-medium">What People Are Saying</p>
          <h1 className="text-4xl md:text-6xl text-foreground">
            Customer <span className="italic text-primary">Stories</span>
          </h1>
          <p className="text-muted-foreground font-light leading-relaxed">
            Every piece leaves here with love — and sometimes customers share it back. Here are a few favorites.
          </p>
        </div>
      </section>

      {/* Review Cards */}
      <section className="pb-20 px-6 md:px-12">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {REVIEWS.map((review, i) => (
              <article
                key={review.id}
                className={`bg-white rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col ${
                  i === 1 ? "md:mt-8" : ""
                }`}
                data-testid={`review-card-${review.id}`}
              >
                {/* Screenshot image */}
                <div className="relative aspect-[9/16] overflow-hidden bg-muted">
                  <img
                    src={review.imageSrc}
                    alt={review.altText}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Subtle gradient for readability */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Card body */}
                <div className="p-6 flex-1 flex flex-col gap-4">
                  {/* Reviewer handle */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                      <Instagram className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{review.reviewer}</span>
                    <span className="ml-auto text-xs text-muted-foreground font-light">{review.timeAgo}</span>
                  </div>

                  {/* Quote */}
                  <p className="text-foreground/80 font-light leading-relaxed text-sm flex-1">
                    "{review.quote}"
                  </p>

                  {/* Owner reply */}
                  {review.reply && (
                    <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                      <div className="w-6 h-6 rounded-full bg-[#E5B5C4] flex items-center justify-center text-white font-serif italic text-xs shrink-0">
                        B
                      </div>
                      <p className="text-xs text-muted-foreground font-light italic">
                        {review.reply}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center space-y-4">
            <p className="text-muted-foreground font-light">Love what you see? Place your own custom order.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-none"
                onClick={() => window.open("https://www.instagram.com/embroideryandthreads/", "_blank")}
                data-testid="reviews-button-instagram"
              >
                <Instagram className="w-4 h-4 mr-2" />
                DM to Order
              </Button>
              <Link href="/#contact">
                <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 shadow-none w-full sm:w-auto" data-testid="reviews-button-contact">
                  Send a Message
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground font-light flex items-center justify-center gap-1 mt-2">
              <MapPin className="w-3 h-3" />
              Local orders only — Castle Rock, CO area
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 md:px-12">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground font-light gap-3">
          <p>© {new Date().getFullYear()} Embroidery & Threads. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Castle Rock, CO
          </p>
        </div>
      </footer>
    </div>
  );
}
