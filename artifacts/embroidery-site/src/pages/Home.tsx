import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Instagram, MapPin, Mail, Phone, ChevronRight, X } from "lucide-react";
import InstagramFeed from "@/components/InstagramFeed";
import { Link } from "wouter";

const GALLERY_IMAGES = [
  { src: "/gallery-1.png", alt: "Castle Rock Christmas sweatshirts — custom embroidered holiday collection" },
  { src: "/gallery-2.png", alt: "Merry & Bright Christmas trees sweatshirt and beanie set" },
  { src: "/gallery-3.png", alt: "Merry & Bright holiday embroidery on cream sweatshirt" },
  { src: "/gallery-4.png", alt: "MAMA lavender floral applique sweatshirt with custom name tag" },
  { src: "/gallery-5.png", alt: "Faith-based and patriotic embroidered pieces — God Bless the USA" },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col overflow-x-hidden selection:bg-primary selection:text-primary-foreground">

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          data-testid="lightbox-overlay"
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setLightbox(null)}
            data-testid="lightbox-close"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="mt-3 text-center text-white/60 text-sm font-light">{lightbox.alt}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-background/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" data-testid="nav-logo">
            <div className="w-10 h-10 rounded-full bg-[#E5B5C4] flex items-center justify-center text-white font-serif italic text-xl shadow-sm">
              B
            </div>
            <span className={`font-serif tracking-wide transition-opacity duration-300 ${isScrolled ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
              Embroidery & Threads
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#about" className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block" data-testid="nav-link-about">Story</a>
            <a href="#gallery" className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block" data-testid="nav-link-gallery">Gallery</a>
            <Link href="/reviews" className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block" data-testid="nav-link-reviews">Reviews</Link>
            <a href="#contact" className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block" data-testid="nav-link-contact">Contact</a>
            <Button
              variant="outline"
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-none px-6"
              onClick={() => window.open("https://www.instagram.com/embroideryandthreads/", "_blank")}
              data-testid="nav-button-order"
            >
              Order via DM
            </Button>
          </div>
        </div>
      </nav>

      {/* Local Orders Banner */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="mt-[72px] mx-auto max-w-fit">
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-12 px-6 md:px-12">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 animate-in fade-in duration-1000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] -z-10 animate-in fade-in duration-1000 delay-500"></div>

        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <div className="flex-1 space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-both delay-100">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 text-secondary-foreground text-xs font-medium tracking-widest uppercase">
                <MapPin className="w-3 h-3" />
                <span>Castle Rock, Colorado</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl text-foreground leading-[1.1] tracking-tight">
                Stitched <br />
                <span className="italic text-primary font-light">with intention.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed font-light">
                A small, faith-based embroidery shop specializing in personalized pieces.
                From cozy Mama & Mini sets to custom holiday stockings, everything is made by hand with care.
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                Currently serving Castle Rock &amp; surrounding areas — local orders only, no shipping at this time
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  onClick={() => window.open("https://www.instagram.com/embroideryandthreads/", "_blank")}
                  data-testid="hero-button-instagram"
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  DM to Order
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-medium hover:bg-transparent hover:text-primary transition-colors group"
                  onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
                  data-testid="hero-button-explore"
                >
                  Explore the Work
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Hero image with B logo overlay */}
            <div className="flex-1 relative w-full max-w-md mx-auto aspect-[4/5] animate-in slide-in-from-right-12 fade-in duration-1000 fill-mode-both delay-300">
              <div className="absolute inset-0 bg-[#E5B5C4]/20 rounded-t-full transform -rotate-6 scale-105 transition-transform duration-700 hover:rotate-0"></div>
              <img
                src="/ig-post-3.png"
                alt="Custom embroidery pieces from Embroidery & Threads"
                className="absolute inset-0 w-full h-full object-cover rounded-t-full shadow-lg"
              />
              {/* B logo overlay */}
              <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-[#E5B5C4] flex items-center justify-center text-white font-serif italic text-3xl shadow-lg border-2 border-white/60 z-10">
                B
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story / About Section */}
      <section id="about" className="py-24 bg-white px-6 md:px-12 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-both [animation-timeline:view()] [animation-range:entry_20%_cover_50%]">
            <h2 className="text-3xl md:text-5xl italic text-primary">The Heart Behind the Hoop</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-loose font-light max-w-3xl mx-auto">
              I started Embroidery & Threads because I believe the things we wear and carry should tell a story.
              Based in beautiful Castle Rock, Colorado, this little shop is built on faith, family, and the joy of
              creating something truly yours. Ordering from me isn't like checking out online — it's a conversation.
              We'll dream up the perfect design together, whether it's a matching sweatshirt for you and your little one,
              or a custom tote that makes the perfect gift.
            </p>
            <div className="inline-flex items-start gap-3 px-6 py-4 rounded-2xl bg-primary/8 border border-primary/15 text-left max-w-xl mx-auto">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/80 font-light leading-relaxed">
                <span className="font-medium text-primary">Local orders only.</span> I'm currently taking custom orders in the Castle Rock area. I'm not shipping at this time — reach out on Instagram and we'll work out a local pickup.
              </p>
            </div>
            <div className="w-16 h-px bg-primary/30 mx-auto mt-12"></div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-6 md:px-12 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-6xl text-foreground">Recent <span className="italic text-primary">Creations</span></h2>
              <p className="text-lg text-muted-foreground font-light">
                A selection of custom pieces — click any image to take a closer look.
                Every stitch is placed with purpose.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground hidden md:flex shadow-none"
              onClick={() => window.open("https://www.instagram.com/embroideryandthreads/", "_blank")}
              data-testid="gallery-button-instagram"
            >
              See more on Instagram
            </Button>
          </div>

          {/* 5-image masonry-style grid with click-to-enlarge */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {/* Large featured image */}
            <div
              className="col-span-2 md:col-span-2 row-span-1 relative group overflow-hidden rounded-2xl aspect-[16/9] cursor-pointer"
              onClick={() => setLightbox(GALLERY_IMAGES[0])}
              data-testid="gallery-image-0"
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 z-10 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-foreground text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full">
                  View
                </span>
              </div>
              <img src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700 ease-out" />
            </div>

            {/* Tall right image */}
            <div
              className="col-span-1 row-span-2 relative group overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
              onClick={() => setLightbox(GALLERY_IMAGES[1])}
              data-testid="gallery-image-1"
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 z-10 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-foreground text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full">
                  View
                </span>
              </div>
              <img src={GALLERY_IMAGES[1].src} alt={GALLERY_IMAGES[1].alt} className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700 ease-out" />
            </div>

            {/* Bottom-left square */}
            <div
              className="col-span-1 relative group overflow-hidden rounded-2xl aspect-square cursor-pointer"
              onClick={() => setLightbox(GALLERY_IMAGES[2])}
              data-testid="gallery-image-2"
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 z-10 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-foreground text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full">
                  View
                </span>
              </div>
              <img src={GALLERY_IMAGES[2].src} alt={GALLERY_IMAGES[2].alt} className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700 ease-out" />
            </div>

            {/* Bottom-middle square */}
            <div
              className="col-span-1 relative group overflow-hidden rounded-2xl aspect-square cursor-pointer"
              onClick={() => setLightbox(GALLERY_IMAGES[3])}
              data-testid="gallery-image-3"
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 z-10 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-foreground text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full">
                  View
                </span>
              </div>
              <img src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700 ease-out" />
            </div>

            {/* Wide bottom spanning image */}
            <div
              className="col-span-2 md:col-span-2 relative group overflow-hidden rounded-2xl aspect-[16/9] cursor-pointer"
              onClick={() => setLightbox(GALLERY_IMAGES[4])}
              data-testid="gallery-image-4"
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 z-10 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-foreground text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full">
                  View
                </span>
              </div>
              <img src={GALLERY_IMAGES[4].src} alt={GALLERY_IMAGES[4].alt} className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700 ease-out" />
            </div>
          </div>

          <div className="mt-10 flex justify-center md:hidden">
            <Button
              variant="outline"
              className="rounded-full border-primary/50 text-foreground shadow-none"
              onClick={() => window.open("https://www.instagram.com/embroideryandthreads/", "_blank")}
            >
              See more on Instagram
            </Button>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <InstagramFeed />

      {/* Process Section */}
      <section className="py-24 bg-[#B1C2B1]/10 px-6 md:px-12">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl text-foreground mb-4">How It <span className="italic text-primary">Works</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light">
              I handle all orders personally to ensure we get every detail just right.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {[
              { step: "01", title: "Say Hello", desc: "Send me a DM on Instagram or fill out the contact form below with what you're looking for — a gift, a custom piece, or something for yourself." },
              { step: "02", title: "The Details", desc: "We'll chat about colors, fonts, and sizing. I'll make sure the design is exactly what you envision before I start stitching." },
              { step: "03", title: "Local Pickup", desc: "I'll get to stitching! Once it's ready, I'll package it beautifully for local pickup in the Castle Rock area." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both [animation-timeline:view()] [animation-range:entry_10%_cover_30%]">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-sm border border-border">
                  <span className="font-serif italic text-3xl text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-medium tracking-wide">{item.title}</h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-white pt-24 pb-12 px-6 md:px-12 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">

            {/* Left — contact info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl text-foreground leading-tight">
                  Let's make <br />
                  <span className="italic text-primary">something beautiful.</span>
                </h2>
                <p className="mt-4 text-muted-foreground font-light max-w-md">
                  Whether you have a specific design in mind or just want to explore options, I'd love to hear from you. Serving Castle Rock and surrounding areas.
                </p>
              </div>

              <div className="space-y-5">
                <a href="https://www.instagram.com/embroideryandthreads/" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group" data-testid="footer-link-instagram">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors shrink-0">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Instagram</p>
                    <p className="text-sm text-muted-foreground font-light">@embroideryandthreads</p>
                  </div>
                </a>
                <a href="mailto:embroideryandthreads@gmail.com" className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group" data-testid="footer-link-email">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground font-light">embroideryandthreads@gmail.com</p>
                  </div>
                </a>
                <a href="tel:7205550199" className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group" data-testid="footer-link-phone">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground font-light">(720) 555-0199</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right — contact form */}
            {/* TODO: Wire up form submission — connect to a server POST /api/contact endpoint
                    or an email service (e.g. Resend, EmailJS, Formspree) to deliver
                    messages to embroideryandthreads@gmail.com */}
            <form
              className="p-8 bg-background rounded-3xl border border-border space-y-5"
              onSubmit={(e) => e.preventDefault()}
              data-testid="contact-form"
            >
              <div>
                <h3 className="text-2xl font-serif text-foreground">Send a Message</h3>
                <p className="text-sm text-muted-foreground font-light mt-1">I'll get back to you as soon as possible.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium tracking-widest text-foreground/70 uppercase">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/25 transition-shadow"
                    data-testid="contact-input-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium tracking-widest text-foreground/70 uppercase">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/25 transition-shadow"
                    data-testid="contact-input-email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium tracking-widest text-foreground/70 uppercase">What are you looking for?</label>
                <textarea
                  rows={4}
                  placeholder="Describe your custom order idea — item type, names, colors, occasion..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm resize-none placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/25 transition-shadow"
                  data-testid="contact-input-message"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base shadow-none font-medium"
                data-testid="contact-form-submit"
              >
                Send Message
              </Button>
            </form>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border text-sm text-muted-foreground font-light gap-4">
            <p>© {new Date().getFullYear()} Embroidery & Threads. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Castle Rock, CO
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
