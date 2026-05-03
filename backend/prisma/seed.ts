import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const serviceTypes = [
  { id: "workshops", labelKey: "services.workshops", descriptionKey: "services.workshopsDesc", beta: false, accent: "bg-blue-50 text-blue-700" },
  { id: "carwash", labelKey: "services.carwash", descriptionKey: "services.carwashDesc", beta: false, accent: "bg-cyan-50 text-cyan-700" },
  { id: "rentals", labelKey: "services.rentals", descriptionKey: "services.rentalsDesc", beta: true, accent: "bg-violet-50 text-violet-700" },
  { id: "imports", labelKey: "services.imports", descriptionKey: "services.importsDesc", beta: true, accent: "bg-orange-50 text-orange-700" },
  { id: "financing", labelKey: "services.financing", descriptionKey: "services.financingDesc", beta: true, accent: "bg-emerald-50 text-emerald-700" },
];

const providers = [
  {
    id: "w-1",
    typeId: "workshops",
    name: "Prime Auto Workshop",
    location: "Downtown",
    rating: 4.8,
    reviewCount: 182,
    distanceKm: 2.1,
    priceFrom: 45,
    availableToday: true,
    hero: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80",
    description: "Certified mechanics for diagnostics, oil service, brakes, batteries, and inspection prep with transparent estimates.",
    services: ["Diagnostics", "Oil service", "Brake repair", "Battery check"],
    timeSlots: ["09:00", "11:30", "14:00", "17:00"],
    reviews: [
      { author: "Sarah K.", text: "Clear estimate and fast brake service.", rating: 5 },
      { author: "Omar A.", text: "Professional team and easy booking.", rating: 4.7 },
    ],
  },
  {
    id: "w-2",
    typeId: "workshops",
    name: "GermanTech Garage",
    location: "Westside",
    rating: 4.6,
    reviewCount: 96,
    distanceKm: 4.8,
    priceFrom: 60,
    availableToday: false,
    hero: "https://images.unsplash.com/photo-1632823469850-1b7b1e8b7e1e?auto=format&fit=crop&w=1200&q=80",
    description: "Specialist workshop for European cars, computer diagnostics, scheduled maintenance, and suspension work.",
    services: ["Computer scan", "Suspension", "Engine service", "Inspection"],
    timeSlots: ["10:00", "13:30", "16:30"],
    reviews: [
      { author: "Jonas M.", text: "Great for my VW service.", rating: 4.8 },
      { author: "Lina P.", text: "Accurate diagnosis and fair pricing.", rating: 4.5 },
    ],
  },
  {
    id: "w-3",
    typeId: "workshops",
    name: "QuickFix Auto Care",
    location: "North Park",
    rating: 4.4,
    reviewCount: 73,
    distanceKm: 6.2,
    priceFrom: 35,
    availableToday: true,
    hero: "https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80",
    description: "Fast maintenance and repair lane for everyday service needs, minor repairs, and seasonal checks.",
    services: ["Minor repair", "Tire check", "AC service", "Fluids"],
    timeSlots: ["08:30", "12:00", "15:30"],
    reviews: [
      { author: "Maya R.", text: "Affordable and convenient.", rating: 4.4 },
      { author: "David H.", text: "Good same-day availability.", rating: 4.3 },
    ],
  },
  {
    id: "c-1",
    typeId: "carwash",
    name: "Aqua Shine Car Wash",
    location: "Downtown",
    rating: 4.7,
    reviewCount: 214,
    distanceKm: 1.4,
    priceFrom: 18,
    availableToday: true,
    hero: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80",
    description: "Premium exterior wash, interior vacuum, wax, and express detailing with eco-conscious water use.",
    services: ["Exterior wash", "Interior vacuum", "Wax", "Express detail"],
    timeSlots: ["09:15", "10:45", "13:00", "18:00"],
    reviews: [
      { author: "Nadia S.", text: "The detailing package was excellent.", rating: 4.8 },
      { author: "Ben T.", text: "Fast, clean, and friendly.", rating: 4.6 },
    ],
  },
  {
    id: "c-2",
    typeId: "carwash",
    name: "EcoBubble Wash",
    location: "East Market",
    rating: 4.5,
    reviewCount: 121,
    distanceKm: 3.5,
    priceFrom: 14,
    availableToday: true,
    hero: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80",
    description: "Efficient wash packages, water-saving equipment, and gentle products for daily drivers.",
    services: ["Basic wash", "Tire shine", "Interior wipe", "Eco foam"],
    timeSlots: ["08:45", "11:00", "16:00"],
    reviews: [
      { author: "Ali N.", text: "Good price and reliable result.", rating: 4.5 },
      { author: "Emma W.", text: "Easy slot booking.", rating: 4.4 },
    ],
  },
  {
    id: "c-3",
    typeId: "carwash",
    name: "Detail Lab Studio",
    location: "Westside",
    rating: 4.9,
    reviewCount: 88,
    distanceKm: 5.7,
    priceFrom: 32,
    availableToday: false,
    hero: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=1200&q=80",
    description: "Specialist detailing studio for ceramic-safe cleaning, polish, and interior restoration.",
    services: ["Premium detail", "Polish", "Leather care", "Ceramic-safe wash"],
    timeSlots: ["12:30", "15:00", "17:30"],
    reviews: [
      { author: "Chris B.", text: "High-end finish and careful team.", rating: 5 },
      { author: "Farah D.", text: "Worth it for deep cleaning.", rating: 4.8 },
    ],
  },
];

const rentals = [
  { id: "rent-1", model: "BMW X5 xDrive", type: "SUV", location: "Downtown", pricePerDay: 95, rating: 4.8, available: true, seats: 5, transmission: "Automatic", fuel: "Hybrid", deposit: 450, images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"] },
  { id: "rent-2", model: "Mercedes C-Class", type: "Sedan", location: "Airport", pricePerDay: 72, rating: 4.6, available: true, seats: 5, transmission: "Automatic", fuel: "Petrol", deposit: 350, images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80"] },
  { id: "rent-3", model: "Range Rover Velar", type: "Luxury", location: "Westside", pricePerDay: 145, rating: 4.9, available: false, seats: 5, transmission: "Automatic", fuel: "Diesel", deposit: 700, images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80"] },
  { id: "rent-4", model: "Toyota Camry", type: "Sedan", location: "East Market", pricePerDay: 48, rating: 4.4, available: true, seats: 5, transmission: "Automatic", fuel: "Hybrid", deposit: 250, images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80"] },
];

async function main() {
  const passwordHash = await bcrypt.hash("password", 12);
  await prisma.bookingEvent.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.providerService.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.rentalBooking.deleteMany();
  await prisma.rentalCar.deleteMany();
  await prisma.importTrackingEvent.deleteMany();
  await prisma.importRequest.deleteMany();
  await prisma.importCar.deleteMany();
  await prisma.importRegion.deleteMany();
  await prisma.financeApplicationEvent.deleteMany();
  await prisma.financeApplication.deleteMany();
  await prisma.financeOffer.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.user.deleteMany();
  await prisma.serviceType.deleteMany();

  const customer = await prisma.user.create({
    data: { name: "Alex Driver", email: "alex@autoone.app", phone: "+49 170 555 0123", passwordHash, role: UserRole.CUSTOMER },
  });
  const partnerUser = await prisma.user.create({
    data: { name: "Prime Auto Partner", email: "partner@autoone.app", phone: "+49 170 555 0144", passwordHash, role: UserRole.PARTNER },
  });
  const partner = await prisma.partner.create({
    data: { userId: partnerUser.id, businessName: "Prime Auto Partner", status: "ACTIVE", verificationStatus: "verified", address: "Downtown" },
  });

  for (const serviceType of serviceTypes) {
    await prisma.serviceType.create({ data: { ...serviceType, enabled: true } });
  }

  for (const provider of providers) {
    await prisma.provider.create({
      data: {
        id: provider.id,
        partnerId: provider.id === "w-1" ? partner.id : undefined,
        typeId: provider.typeId,
        name: provider.name,
        location: provider.location,
        rating: provider.rating,
        reviewCount: provider.reviewCount,
        distanceKm: provider.distanceKm,
        priceFrom: provider.priceFrom,
        availableToday: provider.availableToday,
        hero: provider.hero,
        description: provider.description,
        services: { create: provider.services.map((name) => ({ name, price: provider.priceFrom, durationMinutes: 60 })) },
        availability: { create: provider.timeSlots.map((startTime) => ({ startTime, capacity: 1 })) },
        reviews: {
          create: provider.reviews.map((review) => ({
            userId: customer.id,
            text: review.text,
            rating: review.rating,
          })),
        },
      },
    });
  }

  await prisma.booking.create({
    data: {
      id: "bk-1001",
      customerId: customer.id,
      providerId: "w-1",
      serviceType: "workshops",
      date: new Date("2026-05-04"),
      time: "09:00",
      customerName: "Alex Driver",
      customerPhone: "+49 170 555 0123",
      vehicleLabel: "BMW 3 Series",
      status: "CONFIRMED",
      price: 45,
    },
  });

  for (const rental of rentals) {
    await prisma.rentalCar.create({ data: rental });
  }

  await prisma.importRegion.createMany({
    data: [
      { id: "US", label: "United States", shipping: 2400, customsRate: 0.18, eta: "8-10 weeks" },
      { id: "EU", label: "European Union", shipping: 1100, customsRate: 0.12, eta: "3-5 weeks" },
      { id: "China", label: "China", shipping: 2800, customsRate: 0.2, eta: "10-12 weeks" },
    ],
  });
  await prisma.importCar.createMany({
    data: [
      { id: "imp-1", model: "Tesla Model Y Long Range", regionId: "US", price: 42800, image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80", specs: ["EV", "Long Range", "AWD"] },
      { id: "imp-2", model: "Audi A6 Avant", regionId: "EU", price: 38900, image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80", specs: ["Diesel", "Premium", "Wagon"] },
      { id: "imp-3", model: "BYD Seal", regionId: "China", price: 31900, image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80", specs: ["EV", "Sedan", "Extended battery"] },
      { id: "imp-4", model: "Ford Mustang GT", regionId: "US", price: 45200, image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80", specs: ["V8", "Coupe", "Performance"] },
    ],
  });

  await prisma.financeOffer.createMany({
    data: [
      { id: "bank-1", name: "AutoOne Capital", interestRate: 5.4, approvalSpeed: "Instant pre-approval", minDownPaymentPercent: 10, features: ["Flexible early payoff", "Digital documents", "No setup fee"] },
      { id: "bank-2", name: "EuroDrive Bank", interestRate: 5.9, approvalSpeed: "Same day", minDownPaymentPercent: 15, features: ["Fixed rates", "Partner workshops", "Payment holiday option"] },
      { id: "bank-3", name: "Mobility Finance", interestRate: 6.3, approvalSpeed: "24-48 hours", minDownPaymentPercent: 20, features: ["Used car support", "Co-applicant option", "Fast ID check"] },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { userId: customer.id, type: "confirmed", title: "Booking confirmed", message: "Prime Auto Workshop confirmed your service for May 4." },
      { userId: customer.id, type: "reminder", title: "Service reminder", message: "Your car wash appointment is tomorrow at 13:00." },
    ],
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
