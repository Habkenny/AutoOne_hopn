import { Booking, BookingStatus, FinanceOffer, ImportCar, ImportRegion, Notification, Provider, ProviderService, RentalCar, ServiceType, UserRole } from "@prisma/client";

export function toPublicUser(user: { id: string; name: string; email: string; phone: string | null; role: UserRole; language: string; currency: string }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role.toLowerCase(),
    language: user.language,
    currency: user.currency,
  };
}

export function toServiceType(type: ServiceType) {
  return {
    id: type.id,
    labelKey: type.labelKey,
    descriptionKey: type.descriptionKey,
    enabled: type.enabled,
    beta: type.beta,
    accent: type.accent,
  };
}

export function toProvider(provider: Provider & { services?: ProviderService[]; reviews?: { user?: { name: string }; text: string; rating: unknown }[]; availability?: { startTime: string }[] }) {
  return {
    id: provider.id,
    type: provider.typeId,
    name: provider.name,
    location: provider.location,
    rating: Number(provider.rating),
    reviewCount: provider.reviewCount,
    distanceKm: Number(provider.distanceKm),
    priceFrom: Number(provider.priceFrom),
    availableToday: provider.availableToday,
    hero: provider.hero,
    description: provider.description,
    services: provider.services?.map((service) => service.name) ?? [],
    timeSlots: provider.availability?.map((slot) => slot.startTime) ?? [],
    reviews: provider.reviews?.map((review) => ({
      author: review.user?.name ?? "AutoOne user",
      text: review.text,
      rating: Number(review.rating),
    })) ?? [],
  };
}

export function toBooking(booking: Booking & { provider?: Provider }) {
  return {
    id: booking.id,
    providerId: booking.providerId,
    providerName: booking.provider?.name,
    serviceType: booking.serviceType,
    date: booking.date.toISOString().slice(0, 10),
    time: booking.time,
    car: booking.vehicleLabel,
    status: booking.status.toLowerCase(),
    price: Number(booking.price),
  };
}

export function toBookingStatus(status: string): BookingStatus {
  return status.toUpperCase() as BookingStatus;
}

export function toRentalCar(car: RentalCar) {
  return {
    id: car.id,
    model: car.model,
    type: car.type,
    location: car.location,
    pricePerDay: Number(car.pricePerDay),
    rating: Number(car.rating),
    available: car.available,
    seats: car.seats,
    transmission: car.transmission,
    fuel: car.fuel,
    deposit: Number(car.deposit),
    images: car.images,
  };
}

export function toImportRegion(region: ImportRegion) {
  return {
    id: region.id,
    label: region.label,
    shipping: Number(region.shipping),
    customsRate: Number(region.customsRate),
    eta: region.eta,
  };
}

export function toImportCar(car: ImportCar) {
  return {
    id: car.id,
    model: car.model,
    region: car.regionId,
    price: Number(car.price),
    image: car.image,
    specs: car.specs,
  };
}

export function toFinanceOffer(offer: FinanceOffer) {
  return {
    id: offer.id,
    name: offer.name,
    interestRate: Number(offer.interestRate),
    approvalSpeed: offer.approvalSpeed,
    minDownPayment: offer.minDownPaymentPercent,
    features: offer.features,
  };
}

export function toNotification(notification: Notification) {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    timestamp: notification.createdAt.toISOString(),
    read: Boolean(notification.readAt),
  };
}
