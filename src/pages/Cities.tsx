import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { cities, rooms } from "@/data/rooms";

const CitiesPage = () => {
  const navigate = useNavigate();

  const cityData = cities.map((city) => ({
    name: city,
    count: rooms.filter((r) => r.city === city).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-24 max-w-5xl mx-auto section-padding">
        <ScrollReveal>
          <h1 className="text-3xl font-bold mb-2">Browse by City</h1>
          <p className="text-muted-foreground mb-12">Select a city to explore rooms and PG options</p>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cityData.map((city, i) => (
            <ScrollReveal key={city.name} delay={i * 50}>
              <button
                onClick={() => navigate(`/rooms?city=${encodeURIComponent(city.name)}`)}
                className="w-full p-5 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 text-left group"
              >
                <MapPin className="h-5 w-5 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-sm">{city.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {city.count} {city.count === 1 ? "listing" : "listings"}
                </p>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CitiesPage;
