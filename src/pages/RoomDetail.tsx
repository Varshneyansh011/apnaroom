import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Phone, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ReviewSection } from "@/components/ReviewSection";
import { rooms } from "@/data/rooms";
import { useState } from "react";

const RoomDetail = () => {
  const { id } = useParams();
  const room = rooms.find((r) => r.id === id);
  const [activeImage, setActiveImage] = useState(0);

  if (!room) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center section-padding">
          <h1 className="text-2xl font-bold mb-4">Room not found</h1>
          <Link to="/rooms">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" /> Back to Rooms
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const contactPhone = "919335580253";

  const whatsappUrl = `https://wa.me/${contactPhone}?text=${encodeURIComponent(
    `Hi, I'm interested in "${room.name}" listed on ROOM HAI. Is it still available?`
  )}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-24 max-w-6xl mx-auto section-padding">
        {/* Back */}
        <ScrollReveal>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </Link>
        </ScrollReveal>

        {/* Image Gallery */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-3 mb-8">
            <div className="rounded-2xl overflow-hidden aspect-[16/10]">
              <img
                src={room.images[activeImage]}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex md:flex-col gap-3">
              {room.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`rounded-xl overflow-hidden flex-1 border-2 transition-colors ${
                    activeImage === i ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover aspect-[4/3]" />
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Details */}
          <div>
            <ScrollReveal>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary text-primary-foreground">
                    {room.type}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                    {room.gender}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ lineHeight: "1.2" }}>
                  {room.name}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {room.area}, {room.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" /> {room.rating} ({room.reviews} reviews)
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{room.description}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room.facilities.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Reviews */}
            <ReviewSection roomId={room.id} />
          </div>

          {/* Sidebar */}
          <ScrollReveal delay={150}>
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 h-fit">
              <div className="mb-6">
                <span className="text-3xl font-bold">₹{room.price.toLocaleString("en-IN")}</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <div className="flex flex-col gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="hero" size="lg" className="w-full">
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp Owner
                  </Button>
                </a>
                <a href={`tel:+${contactPhone}`}>
                  <Button variant="outline" size="lg" className="w-full">
                    <Phone className="h-5 w-5" />
                    Call Owner
                  </Button>
                </a>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Contact the owner directly — no middlemen
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RoomDetail;
