import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Room } from "@/data/rooms";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Link
      to={`/room/${room.id}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary text-primary-foreground">
            {room.type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-card/90 backdrop-blur-sm text-foreground capitalize">
            {room.gender}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {room.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="text-sm font-medium">{room.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-3.5 w-3.5" />
          <span>{room.area}, {room.city}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            ₹{room.price.toLocaleString("en-IN")}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </span>
          <div className="flex gap-1">
            {room.facilities.slice(0, 3).map((f) => (
              <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
