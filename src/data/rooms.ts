import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";
import room4 from "@/assets/room-4.jpg";
import room5 from "@/assets/room-5.jpg";
import room6 from "@/assets/room-6.jpg";
import saiPg1 from "@/assets/sai-pg-1.jpg";
import saiPg2 from "@/assets/sai-pg-2.jpg";
import saiPg3 from "@/assets/sai-pg-3.jpg";
import saiPg4 from "@/assets/sai-pg-4.jpg";
import saiPg5 from "@/assets/sai-pg-5.jpg";
import saiPg6 from "@/assets/sai-pg-6.jpg";
import saiPg7 from "@/assets/sai-pg-7.jpg";
import saiPg8 from "@/assets/sai-pg-8.jpg";

export interface Room {
  id: string;
  name: string;
  city: string;
  area: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  description: string;
  facilities: string[];
  gender: "boys" | "girls" | "unisex";
  type: "PG" | "Room" | "Flat";
  ownerPhone: string;
}

export const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Noida", "Gurgaon", "Ghaziabad", "Chandigarh", "Indore", "Bhopal",
];

export const facilities = [
  "WiFi", "AC", "Food", "Laundry", "Power Backup",
  "Parking", "CCTV", "Gym", "TV", "Attached Bathroom",
];

export const rooms: Room[] = [
  {
    id: "1",
    name: "Sunrise PG for Boys",
    city: "Mumbai",
    area: "Andheri West",
    price: 8500,
    rating: 4.3,
    reviews: 47,
    image: room1,
    images: [room1, room2, room3],
    description: "A well-maintained PG in the heart of Andheri West. Walking distance to metro station and local markets. Clean rooms with daily housekeeping and home-cooked meals included.",
    facilities: ["WiFi", "AC", "Food", "Laundry", "CCTV"],
    gender: "boys",
    type: "PG",
    ownerPhone: "919876543210",
  },
  {
    id: "2",
    name: "Comfort Stay PG",
    city: "Delhi",
    area: "Rajouri Garden",
    price: 7000,
    rating: 4.1,
    reviews: 32,
    image: room2,
    images: [room2, room4, room6],
    description: "Affordable PG near Rajouri Garden metro. Spacious rooms with attached bathrooms. Ideal for working professionals and students.",
    facilities: ["WiFi", "Food", "Power Backup", "Parking"],
    gender: "unisex",
    type: "PG",
    ownerPhone: "919876543211",
  },
  {
    id: "3",
    name: "Green Valley Room",
    city: "Bangalore",
    area: "Koramangala",
    price: 12000,
    rating: 4.6,
    reviews: 89,
    image: room3,
    images: [room3, room5, room1],
    description: "Premium furnished room in Koramangala 5th Block. Close to all major tech parks. Modern amenities with 24/7 security.",
    facilities: ["WiFi", "AC", "Gym", "CCTV", "Attached Bathroom", "Power Backup"],
    gender: "unisex",
    type: "Room",
    ownerPhone: "919876543212",
  },
  {
    id: "4",
    name: "Budget Beds Hostel",
    city: "Pune",
    area: "Hinjewadi",
    price: 5500,
    rating: 3.9,
    reviews: 21,
    image: room4,
    images: [room4, room6, room2],
    description: "Budget-friendly shared accommodation near Hinjewadi IT Park. Perfect for freshers and interns. Clean and safe environment.",
    facilities: ["WiFi", "Food", "Laundry"],
    gender: "boys",
    type: "PG",
    ownerPhone: "919876543213",
  },
  {
    id: "5",
    name: "Royal Residency",
    city: "Hyderabad",
    area: "Gachibowli",
    price: 15000,
    rating: 4.8,
    reviews: 112,
    image: room5,
    images: [room5, room3, room1],
    description: "Luxury furnished room near Financial District. Premium amenities with attached bathroom, daily housekeeping, and meals.",
    facilities: ["WiFi", "AC", "Food", "Gym", "TV", "Attached Bathroom", "CCTV", "Parking"],
    gender: "unisex",
    type: "Room",
    ownerPhone: "919876543214",
  },
  {
    id: "6",
    name: "Sisters PG",
    city: "Mumbai",
    area: "Powai",
    price: 9000,
    rating: 4.4,
    reviews: 56,
    image: room6,
    images: [room6, room4, room2],
    description: "Safe and comfortable girls PG in Powai, near IIT campus. Warden-managed with strict security and curfew. Home-style food included.",
    facilities: ["WiFi", "Food", "CCTV", "Power Backup", "Laundry"],
    gender: "girls",
    type: "PG",
    ownerPhone: "919876543215",
  },
  {
    id: "7",
    name: "Metro View Rooms",
    city: "Delhi",
    area: "Karol Bagh",
    price: 6500,
    rating: 4.0,
    reviews: 38,
    image: room1,
    images: [room1, room3, room5],
    description: "Clean and affordable rooms in Karol Bagh. Close to metro, markets and hospitals. Suitable for students and working professionals.",
    facilities: ["WiFi", "Power Backup", "Parking"],
    gender: "boys",
    type: "Room",
    ownerPhone: "919876543216",
  },
  {
    id: "8",
    name: "TechPark PG",
    city: "Bangalore",
    area: "Whitefield",
    price: 10000,
    rating: 4.5,
    reviews: 74,
    image: room2,
    images: [room2, room1, room5],
    description: "Modern PG near ITPL and major tech companies. Fully furnished with all modern amenities. Great community of working professionals.",
    facilities: ["WiFi", "AC", "Food", "Gym", "Laundry", "CCTV"],
    gender: "unisex",
    type: "PG",
    ownerPhone: "919876543217",
  },
  {
    id: "9",
    name: "SAI PG",
    city: "Ghaziabad",
    area: "Chipiyana, Near ABES Green Park Colony",
    price: 3500,
    rating: 4.2,
    reviews: 0,
    image: saiPg1,
    images: [saiPg1, saiPg2, saiPg3, saiPg4, saiPg5, saiPg6, saiPg7, saiPg8],
    description: "Comfortable and affordable PG near ABES Green Park Colony, Chipiyana, Ghaziabad (PIN 201009). Clean rooms with essential amenities. Ideal for students and working professionals.",
    facilities: ["WiFi", "Laundry", "Power Backup", "Attached Bathroom"],
    gender: "boys",
    type: "PG",
    ownerPhone: "919335580253",
  },
];

export const areas = [...new Set(rooms.map((r) => r.area))];

export const locations = [
  ...cities.map((c) => ({ label: c, type: "city" as const })),
  ...rooms.map((r) => ({ label: `${r.area}, ${r.city}`, type: "area" as const, area: r.area, city: r.city })),
  ...rooms.map((r) => ({ label: r.name, type: "pg" as const })),
].filter((v, i, a) => a.findIndex((t) => t.label === v.label) === i);

export const testimonials = [
  {
    name: "Rahul Sharma",
    city: "Mumbai",
    text: "Found my perfect PG within 2 days of searching on ROOM HAI. The filters made it super easy to find exactly what I needed.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    city: "Bangalore",
    text: "As a girl moving to a new city, safety was my top concern. ROOM HAI helped me find a verified and secure PG near my office.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    city: "Pune",
    text: "Affordable options with real photos and honest reviews. Saved me from broker hassles. Highly recommended!",
    rating: 4,
  },
];
