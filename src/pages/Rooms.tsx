import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RoomCard } from "@/components/RoomCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { rooms, cities, facilities as allFacilities } from "@/data/rooms";

const RoomsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const cityParam = searchParams.get("city") || "";

  const [search, setSearch] = useState(cityParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [gender, setGender] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const toggleFacility = (f: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const filtered = useMemo(() => {
    return rooms.filter((room) => {
      const q = search.toLowerCase().trim();
      const words = q.split(/[\s,]+/).filter(Boolean);
      const haystack = `${room.city} ${room.area} ${room.name}`.toLowerCase();
      const matchCity = !q || words.every((w) => haystack.includes(w));
      const matchPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
      const matchFacilities = selectedFacilities.length === 0 || selectedFacilities.every((f) => room.facilities.includes(f));
      const matchGender = !gender || room.gender === gender;
      return matchCity && matchPrice && matchFacilities && matchGender;
    });
  }, [search, priceRange, selectedFacilities, gender]);

  const clearFilters = () => {
    setSearch("");
    setPriceRange([0, 20000]);
    setSelectedFacilities([]);
    setGender("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-24 max-w-7xl mx-auto section-padding">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {cityParam ? `Rooms in ${cityParam}` : "All Rooms & PG"}
            </h1>
            <p className="text-muted-foreground">{filtered.length} rooms found</p>
          </div>
        </ScrollReveal>

        {/* Search + Filter toggle */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city or area..."
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="lg"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <ScrollReveal>
            <div className="bg-card rounded-2xl border border-border p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-primary hover:underline">Clear all</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Gender</label>
                  <div className="flex gap-2">
                    {["", "boys", "girls", "unisex"].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                          gender === g
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {g || "All"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Facilities</label>
                  <div className="flex flex-wrap gap-1.5">
                    {allFacilities.map((f) => (
                      <button
                        key={f}
                        onClick={() => toggleFacility(f)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                          selectedFacilities.includes(f)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((room, i) => (
              <ScrollReveal key={room.id} delay={i * 60}>
                <RoomCard room={room} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-lg font-medium mb-2">No rooms found</p>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search term</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default RoomsPage;
