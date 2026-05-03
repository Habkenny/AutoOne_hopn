import { apiRequest, setAccessToken, toQueryString } from "./apiClient.js";

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

export function getServiceTypes() {
  return apiRequest("/service-types");
}

export function getProviders(type, filters = {}) {
  return apiRequest(`/providers${toQueryString({ type, ...filters })}`);
}

export function getProviderById(type, id) {
  return apiRequest(`/providers/${id}${toQueryString({ type })}`);
}

export function getFeaturedProviders() {
  return apiRequest("/providers/featured");
}

export function createBooking(payload) {
  return apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAllProviders() {
  return apiRequest("/providers");
}

export function searchProviders(query = "") {
  return apiRequest(`/search/providers${toQueryString({ q: query })}`);
}

export function getPartnerDashboard() {
  return apiRequest("/partner/dashboard");
}

export function addPartnerService(payload) {
  return apiRequest("/partner/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function savePartnerService(id, payload) {
  return apiRequest(`/partner/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  const result = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAccessToken(result.accessToken);
  return result.user;
}

export async function registerUser(payload) {
  const result = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAccessToken(result.accessToken);
  return result.user;
}

export function logoutUser() {
  setAccessToken(null);
  return apiRequest("/auth/logout", { method: "POST" });
}

export function getCurrentUser() {
  return apiRequest("/me");
}

export function updateCurrentUser(payload) {
  return apiRequest("/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getMyBookings() {
  return apiRequest("/bookings/me");
}

export function updateBookingStatus(id, status) {
  return apiRequest(`/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function getNotifications() {
  return apiRequest("/notifications");
}

export function markNotificationRead(id) {
  return apiRequest(`/notifications/${id}/read`, { method: "PATCH" });
}

export function markAllNotificationsRead() {
  return apiRequest("/notifications/read-all", { method: "PATCH" });
}

export function getRentalCars(filters = {}) {
  return apiRequest(`/rentals${toQueryString(filters)}`);
}

export function getRentalCarById(id) {
  return apiRequest(`/rentals/${id}`);
}

export function createRentalBooking(payload) {
  return apiRequest(`/rentals/${payload.carId}/bookings`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getImportCatalog(region = "EU") {
  return apiRequest(`/imports/catalog${toQueryString({ region })}`);
}

export function createImportRequest(payload) {
  return apiRequest("/imports/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getFinanceOffers() {
  return apiRequest("/finance/offers");
}

export function submitFinanceApplication(payload) {
  return apiRequest("/finance/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
