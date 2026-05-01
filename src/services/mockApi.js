import { financeData } from "../features/financing/financeData.js";
import { importRegions, importsData } from "../features/imports/importsData.js";
import { rentalsData } from "../features/rentals/rentalsData.js";

const delay = (value, timeout = 450, shouldFail = false) =>
  new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Mock request failed. Please try again."));
        return;
      }
      resolve(value);
    }, timeout);
  });

const maybeFail = (rate = 0) => Math.random() < rate;

export const serviceTypes = {
  workshops: {
    id: "workshops",
    labelKey: "services.workshops",
    descriptionKey: "services.workshopsDesc",
    enabled: true,
    accent: "bg-blue-50 text-blue-700",
  },
  carwash: {
    id: "carwash",
    labelKey: "services.carwash",
    descriptionKey: "services.carwashDesc",
    enabled: true,
    accent: "bg-cyan-50 text-cyan-700",
  },
  rentals: {
    id: "rentals",
    labelKey: "services.rentals",
    descriptionKey: "services.rentalsDesc",
    enabled: true,
    beta: true,
    accent: "bg-violet-50 text-violet-700",
  },
  imports: {
    id: "imports",
    labelKey: "services.imports",
    descriptionKey: "services.importsDesc",
    enabled: true,
    beta: true,
    accent: "bg-orange-50 text-orange-700",
  },
  financing: {
    id: "financing",
    labelKey: "services.financing",
    descriptionKey: "services.financingDesc",
    enabled: true,
    beta: true,
    accent: "bg-emerald-50 text-emerald-700",
  },
};

export const providers = [
  {
    id: "w-1",
    type: "workshops",
    name: "Prime Auto Workshop",
    location: "Downtown",
    rating: 4.8,
    reviewCount: 182,
    distanceKm: 2.1,
    priceFrom: 45,
    availableToday: true,
    hero: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80",
    description:
      "Certified mechanics for diagnostics, oil service, brakes, batteries, and inspection prep with transparent estimates.",
    services: ["Diagnostics", "Oil service", "Brake repair", "Battery check"],
    timeSlots: ["09:00", "11:30", "14:00", "17:00"],
    reviews: [
      { author: "Sarah K.", text: "Clear estimate and fast brake service.", rating: 5 },
      { author: "Omar A.", text: "Professional team and easy booking.", rating: 4.7 },
    ],
  },
  {
    id: "w-2",
    type: "workshops",
    name: "GermanTech Garage",
    location: "Westside",
    rating: 4.6,
    reviewCount: 96,
    distanceKm: 4.8,
    priceFrom: 60,
    availableToday: false,
    hero: "https://images.unsplash.com/photo-1632823469850-1b7b1e8b7e1e?auto=format&fit=crop&w=1200&q=80",
    description:
      "Specialist workshop for European cars, computer diagnostics, scheduled maintenance, and suspension work.",
    services: ["Computer scan", "Suspension", "Engine service", "Inspection"],
    timeSlots: ["10:00", "13:30", "16:30"],
    reviews: [
      { author: "Jonas M.", text: "Great for my VW service.", rating: 4.8 },
      { author: "Lina P.", text: "Accurate diagnosis and fair pricing.", rating: 4.5 },
    ],
  },
  {
    id: "w-3",
    type: "workshops",
    name: "QuickFix Auto Care",
    location: "North Park",
    rating: 4.4,
    reviewCount: 73,
    distanceKm: 6.2,
    priceFrom: 35,
    availableToday: true,
    hero: "https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80",
    description:
      "Fast maintenance and repair lane for everyday service needs, minor repairs, and seasonal checks.",
    services: ["Minor repair", "Tire check", "AC service", "Fluids"],
    timeSlots: ["08:30", "12:00", "15:30"],
    reviews: [
      { author: "Maya R.", text: "Affordable and convenient.", rating: 4.4 },
      { author: "David H.", text: "Good same-day availability.", rating: 4.3 },
    ],
  },
  {
    id: "c-1",
    type: "carwash",
    name: "Aqua Shine Car Wash",
    location: "Downtown",
    rating: 4.7,
    reviewCount: 214,
    distanceKm: 1.4,
    priceFrom: 18,
    availableToday: true,
    hero: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80",
    description:
      "Premium exterior wash, interior vacuum, wax, and express detailing with eco-conscious water use.",
    services: ["Exterior wash", "Interior vacuum", "Wax", "Express detail"],
    timeSlots: ["09:15", "10:45", "13:00", "18:00"],
    reviews: [
      { author: "Nadia S.", text: "The detailing package was excellent.", rating: 4.8 },
      { author: "Ben T.", text: "Fast, clean, and friendly.", rating: 4.6 },
    ],
  },
  {
    id: "c-2",
    type: "carwash",
    name: "EcoBubble Wash",
    location: "East Market",
    rating: 4.5,
    reviewCount: 121,
    distanceKm: 3.5,
    priceFrom: 14,
    availableToday: true,
    hero: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80",
    description:
      "Efficient wash packages, water-saving equipment, and gentle products for daily drivers.",
    services: ["Basic wash", "Tire shine", "Interior wipe", "Eco foam"],
    timeSlots: ["08:45", "11:00", "16:00"],
    reviews: [
      { author: "Ali N.", text: "Good price and reliable result.", rating: 4.5 },
      { author: "Emma W.", text: "Easy slot booking.", rating: 4.4 },
    ],
  },
  {
    id: "c-3",
    type: "carwash",
    name: "Detail Lab Studio",
    location: "Westside",
    rating: 4.9,
    reviewCount: 88,
    distanceKm: 5.7,
    priceFrom: 32,
    availableToday: false,
    hero: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=1200&q=80",
    description:
      "Specialist detailing studio for ceramic-safe cleaning, polish, and interior restoration.",
    services: ["Premium detail", "Polish", "Leather care", "Ceramic-safe wash"],
    timeSlots: ["12:30", "15:00", "17:30"],
    reviews: [
      { author: "Chris B.", text: "High-end finish and careful team.", rating: 5 },
      { author: "Farah D.", text: "Worth it for deep cleaning.", rating: 4.8 },
    ],
  },
];

export const mockUsers = [
  {
    id: "user-1",
    name: "Alex Driver",
    email: "alex@autoone.app",
    phone: "+49 170 555 0123",
    role: "customer",
  },
  {
    id: "partner-1",
    name: "Prime Auto Partner",
    email: "partner@autoone.app",
    phone: "+49 170 555 0144",
    role: "partner",
  },
];

export const partnerBookings = [
  {
    id: "pb-1",
    customer: "Alex Driver",
    service: "Diagnostics",
    providerName: "Prime Auto Workshop",
    date: "2026-05-04",
    time: "09:00",
    status: "pending",
    amount: 45,
  },
  {
    id: "pb-2",
    customer: "Maya Reed",
    service: "Brake repair",
    providerName: "Prime Auto Workshop",
    date: "2026-05-05",
    time: "11:30",
    status: "confirmed",
    amount: 120,
  },
  {
    id: "pb-3",
    customer: "Omar Ali",
    service: "Oil service",
    providerName: "Prime Auto Workshop",
    date: "2026-05-06",
    time: "14:00",
    status: "pending",
    amount: 65,
  },
];

export const partnerServices = [
  { id: "svc-1", name: "Diagnostics", price: 45, duration: "45 min", active: true },
  { id: "svc-2", name: "Brake repair", price: 120, duration: "2 hrs", active: true },
  { id: "svc-3", name: "Oil service", price: 65, duration: "40 min", active: true },
];

export function getServiceTypes() {
  return delay(Object.values(serviceTypes), 250, maybeFail(0.01));
}

export function getProviders(type, filters = {}) {
  const normalizedLocation = filters.location?.trim().toLowerCase();
  const maxPrice = Number(filters.maxPrice || 0);
  const minRating = Number(filters.minRating || 0);

  const result = providers.filter((provider) => {
    if (provider.type !== type) return false;
    if (normalizedLocation && !provider.location.toLowerCase().includes(normalizedLocation)) {
      return false;
    }
    if (maxPrice && provider.priceFrom > maxPrice) return false;
    if (minRating && provider.rating < minRating) return false;
    if (filters.availableToday && !provider.availableToday) return false;
    return true;
  });

  return delay(result, 450, maybeFail(0.01));
}

export function getProviderById(type, id) {
  const provider = providers.find((item) => item.type === type && item.id === id);
  return delay(provider ?? null, 350, maybeFail(0.01));
}

export function getFeaturedProviders() {
  return delay(providers.filter((provider) => provider.rating >= 4.7).slice(0, 3), 300, maybeFail(0.01));
}

export function createBooking(payload) {
  return delay({
    id: `booking-${Date.now()}`,
    status: "pending",
    ...payload,
  }, 500);
}

export function getAllProviders() {
  return delay(providers, 300, maybeFail(0.01));
}

export function searchProviders(query = "") {
  const normalized = query.trim().toLowerCase();
  const result = providers.filter((provider) => {
    if (!normalized) return true;
    return (
      provider.name.toLowerCase().includes(normalized) ||
      provider.location.toLowerCase().includes(normalized) ||
      provider.services.some((service) => service.toLowerCase().includes(normalized))
    );
  });
  return delay(result.slice(0, 6), 220);
}

export function getPartnerDashboard() {
  return delay({
    stats: {
      totalBookings: 128,
      revenue: 18450,
      activeRequests: partnerBookings.filter((booking) => booking.status === "pending").length,
    },
    bookings: partnerBookings,
    services: partnerServices,
    trends: [
      { label: "Mon", value: 8 },
      { label: "Tue", value: 12 },
      { label: "Wed", value: 9 },
      { label: "Thu", value: 16 },
      { label: "Fri", value: 14 },
    ],
  }, 450, maybeFail(0.01));
}

export function loginUser(payload) {
  return delay({
    ...mockUsers[0],
    name: payload.name || mockUsers[0].name,
    email: payload.email || mockUsers[0].email,
  }, 350);
}

export function getRentalCars(filters = {}) {
  const location = filters.location?.trim().toLowerCase();
  const maxPrice = Number(filters.maxPrice || 0);
  const result = rentalsData.filter((car) => {
    if (location && !car.location.toLowerCase().includes(location)) return false;
    if (filters.type && filters.type !== "all" && car.type !== filters.type) return false;
    if (maxPrice && car.pricePerDay > maxPrice) return false;
    return true;
  });
  return delay(result, 420, maybeFail(0.01));
}

export function getRentalCarById(id) {
  return delay(rentalsData.find((car) => car.id === id) ?? null, 320, maybeFail(0.01));
}

export function createRentalBooking(payload) {
  return delay({ id: `rental-${Date.now()}`, status: "pending", ...payload }, 550);
}

export function getImportCatalog(region = "EU") {
  return delay({
    regions: importRegions,
    cars: importsData.filter((car) => car.region === region),
  }, 420, maybeFail(0.01));
}

export function createImportRequest(payload) {
  return delay({ id: `import-${Date.now()}`, status: "submitted", ...payload }, 550);
}

export function getFinanceOffers() {
  return delay(financeData, 360, maybeFail(0.01));
}

export function submitFinanceApplication(payload) {
  return delay({ id: `finance-${Date.now()}`, status: "submitted", ...payload }, 650);
}
