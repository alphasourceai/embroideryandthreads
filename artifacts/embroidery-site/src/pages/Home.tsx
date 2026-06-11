import { useEffect, useState } from "react";
import img1 from "@assets/Screenshot_2026-06-11_at_10.16.06_1781194733295.png";
import img2 from "@assets/Screenshot_2026-06-11_at_10.16.13_1781194733295.png";
import img3 from "@assets/Screenshot_2026-06-11_at_10.16.22_1781194733295.png";
import img4 from "@assets/Screenshot_2026-06-11_at_10.16.29_1781194733295.png";
import img5 from "@assets/Screenshot_2026-06-11_at_10.16.36_1781194733294.png";
import { Button } from "@/components/ui/button";
import { Instagram, MapPin, Mail, Phone, ChevronRight } from "lucide-react";

// TODO: Instagram Integration
// Replace the static images below with live posts from the Instagram Basic Display API.
// API endpoint: https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=YOUR_ACCESS_TOKEN
// Steps to connect:
//   1. Register app at https://developers.facebook.com/
//   2. Add Instagram Basic Display product
//   3. Get a long-lived access token for @embroideryandthreads
//   4. Replace STATIC_POSTS below with fetched posts from the API

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
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
            <a 
              href="#about" 
              className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block"
              data-testid="nav-link-about"
            >
              Story
            </a>
            <a 
              href="#gallery" 
              className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block"
              data-testid="nav-link-gallery"
            >
              Gallery
            </a>
            <a 
              href="#contact" 
              className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block"
              data-testid="nav-link-contact"
            >
              Contact
            </a>
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

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-12 px-6 md:px-12">
        {/* Soft background glow */}
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
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 group"
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
                  onClick={() => {
                    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  data-testid="hero-button-explore"
                >
                  Explore the Work
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 relative w-full max-w-md mx-auto aspect-[4/5] animate-in slide-in-from-right-12 fade-in duration-1000 fill-mode-both delay-300">
              <div className="absolute inset-0 bg-[#E5B5C4]/20 rounded-t-full transform -rotate-6 scale-105 transition-transform duration-700 hover:rotate-0"></div>
              <img 
                src={img3} 
                alt="Beautiful custom embroidery featuring a delicate floral design" 
                className="absolute inset-0 w-full h-full object-cover rounded-t-full shadow-lg"
              />
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
            <div className="w-16 h-px bg-primary/30 mx-auto mt-12"></div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-6 md:px-12 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-6xl text-foreground">Recent <span className="italic text-primary">Creations</span></h2>
              <p className="text-lg text-muted-foreground font-light">
                A selection of custom pieces, from personalized baby onesies to cozy holiday sets. 
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { src: img1, alt: "Custom embroidered sweatshirt", delay: "0", aspect: "aspect-square" },
              { src: img2, alt: "Personalized baby onesie", delay: "100", aspect: "aspect-[4/5] md:-mt-12" },
              { src: img4, alt: "Embroidered tote bag with floral design", delay: "200", aspect: "aspect-square" },
              { src: img5, alt: "Matching Mama and Mini embroidered sets", delay: "0", aspect: "aspect-[4/5] lg:-mt-24" },
              { src: img3, alt: "Custom holiday stockings", delay: "100", aspect: "aspect-square" },
            ].map((img, i) => (
              <div 
                key={i} 
                className={`relative group overflow-hidden rounded-2xl ${img.aspect} animate-in slide-in-from-bottom-12 fade-in duration-1000 fill-mode-both [animation-timeline:view()] [animation-range:entry_10%_cover_40%]`}
                style={{ animationDelay: `${img.delay}ms` }}
              >
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500 z-10"></div>
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center md:hidden">
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

      {/* Process Section */}
      <section className="py-24 bg-[#B1C2B1]/10 px-6 md:px-12">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl text-foreground mb-4">How It <span className="italic text-primary">Works</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light">
              I handle all orders personally through Instagram to ensure we get every detail right.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-primary/20 -z-10"></div>
            
            {[
              { step: "01", title: "Say Hello", desc: "Send me a DM on Instagram with what you're looking for — a gift, a custom piece, or something for yourself." },
              { step: "02", title: "The Details", desc: "We'll chat about colors, fonts, and sizing. I'll make sure the design is exactly what you envision." },
              { step: "03", title: "The Magic", desc: "I'll get to stitching! Once it's ready, I'll package it up beautifully and send it on its way from Castle Rock." }
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
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl text-foreground leading-tight">
                  Let's make <br />
                  <span className="italic text-primary">something beautiful.</span>
                </h2>
                <p className="mt-4 text-muted-foreground font-light max-w-md">
                  Whether you have a specific design in mind or just want to chat about options, I'd love to hear from you.
                </p>
              </div>
              
              <div className="space-y-6">
                <a href="https://www.instagram.com/embroideryandthreads/" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group" data-testid="footer-link-instagram">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Instagram</p>
                    <p className="text-sm text-muted-foreground font-light">@embroideryandthreads</p>
                  </div>
                </a>
                
                <a href="mailto:embroideryandthreads@gmail.com" className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group" data-testid="footer-link-email">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground font-light">embroideryandthreads@gmail.com</p>
                  </div>
                </a>
                
                <a href="tel:7205550199" className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group" data-testid="footer-link-phone">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground font-light">(720) 555-0199</p>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-12 bg-background rounded-3xl border border-border text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#E5B5C4] flex items-center justify-center text-white font-serif italic text-4xl shadow-sm mb-4">
                B
              </div>
              <p className="text-lg font-light text-muted-foreground max-w-sm">
                "Thank you for supporting my small business and trusting me with your special pieces."
              </p>
              <Button 
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base shadow-none mt-4"
                onClick={() => window.open("https://www.instagram.com/embroideryandthreads/", "_blank")}
                data-testid="footer-button-dm"
              >
                Send a Message
              </Button>
            </div>
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
