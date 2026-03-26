import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Star, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RoomCard } from "@/components/RoomCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { rooms, cities, locations, testimonials } from "@/data/rooms";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const filteredLocations = useMemo(
    () => locations.filter((l) => l.label.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const handleCitySelect = (city: string) => {
    setShowSuggestions(false);
    navigate(`/rooms?city=${encodeURIComponent(city)}`);
  };

  const handleSuggestionClick = (label: string) => {
    setSearchQuery(label);
    setShowSuggestions(false);
    navigate(`/rooms?city=${encodeURIComponent(label)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/rooms?city=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && showSuggestions && filteredLocations.length > 0) {
      e.preventDefault();
      handleSuggestionClick(filteredLocations[0].label);
    }
  };

  const featuredRooms = rooms.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="Indian cityscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 max-w-3xl mx-auto text-center section-padding pt-24">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground mb-4 animate-reveal-up"
            style={{ lineHeight: "1.1" }}
          >
            ROOM HAI
          </h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/80 font-medium mb-8 animate-reveal-up stagger-1">
            DEKHO NA......
          </p>
          <p className="text-primary-foreground/60 text-base sm:text-lg mb-10 max-w-xl mx-auto animate-reveal-up stagger-2">
            Find affordable rooms & PG accommodations across India. Your next home is just a search away.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative max-w-xl mx-auto animate-reveal-up stagger-3"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search by city, area or PG name..."
                className="w-full h-14 pl-13 pr-32 rounded-2xl bg-card text-foreground shadow-2xl border-0 focus:outline-none focus:ring-2 focus:ring-accent text-base"
                style={{ paddingLeft: "3.25rem" }}
              />
              <Button
                type="submit"
                variant="hero"
                size="default"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {showSuggestions && searchQuery && filteredLocations.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-card rounded-xl shadow-xl border border-border overflow-hidden z-20">
                {filteredLocations.slice(0, 8).map((loc, idx) => (
                  <button
                    key={loc.label}
                    type="button"
                    onClick={() => handleSuggestionClick(loc.label)}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left cursor-pointer hover:bg-accent/20 active:bg-accent/30 transition-colors ${idx === 0 ? 'bg-secondary/50' : ''}`}
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-foreground font-medium">{loc.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground capitalize">{loc.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-6 animate-reveal-up stagger-4">
            {["Mumbai", "Delhi", "Bangalore", "Pune"].map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className="px-4 py-1.5 rounded-full text-sm border border-primary-foreground/20 text-primary-foreground/70 hover:bg-primary-foreground/10 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-card">
        <div className="max-w-5xl mx-auto section-padding">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
              Finding your perfect room is easy with ROOM HAI
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Search City", desc: "Enter your city or browse our listings to find rooms near you." },
              { step: "02", title: "View Rooms", desc: "Compare rooms, check facilities, read reviews and find your match." },
              { step: "03", title: "Contact & Book", desc: "Reach out to the owner directly via call or WhatsApp and book." },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 100}>
                <div className="relative p-8 rounded-2xl bg-background border border-border/50 hover:shadow-lg transition-shadow duration-300 text-center">
                  <span className="text-5xl font-black text-primary/10 absolute top-4 right-6">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <ChevronRight className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto section-padding">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">Featured Rooms</h2>
                <p className="text-muted-foreground">Handpicked rooms with great reviews</p>
              </div>
              <Button variant="ghost" onClick={() => navigate("/rooms")} className="hidden sm:flex">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map((room, i) => (
              <ScrollReveal key={room.id} delay={i * 80}>
                <RoomCard room={room} />
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" onClick={() => navigate("/rooms")}>
              View All Rooms <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-card">
        <div className="max-w-5xl mx-auto section-padding">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              What People Say
            </h2>
            <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
              Real experiences from ROOM HAI users
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
                <div className="p-6 rounded-2xl bg-background border border-border/50">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.city}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto section-padding text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Have a Room to List?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Become a room provider and reach thousands of tenants looking for their next home.
            </p>
            <Button variant="hero" size="xl" onClick={() => navigate("/become-provider")}>
              Become a Provider
              <ArrowRight className="h-5 w-5" />
            </Button>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
