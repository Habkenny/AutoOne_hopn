import { toBookingStatus, toFinanceOffer, toRentalCar } from "../src/common/serializers";
import { calculateRentalTotal, getRentalDays } from "../src/rentals/rentals.service";

describe("API serializers", () => {
  it("normalizes booking status strings for Prisma", () => {
    expect(toBookingStatus("confirmed")).toBe("CONFIRMED");
    expect(toBookingStatus("cancelled")).toBe("CANCELLED");
  });

  it("returns frontend-compatible rental car shapes", () => {
    expect(
      toRentalCar({
        id: "rent-1",
        partnerId: null,
        model: "BMW X5 xDrive",
        type: "SUV",
        location: "Downtown",
        pricePerDay: 95,
        rating: 4.8,
        available: true,
        seats: 5,
        transmission: "Automatic",
        fuel: "Hybrid",
        deposit: 450,
        images: ["car.jpg"],
      } as never),
    ).toEqual({
      id: "rent-1",
      model: "BMW X5 xDrive",
      type: "SUV",
      location: "Downtown",
      pricePerDay: 95,
      rating: 4.8,
      available: true,
      seats: 5,
      transmission: "Automatic",
      fuel: "Hybrid",
      deposit: 450,
      images: ["car.jpg"],
    });
  });

  it("maps finance offer fields used by the frontend", () => {
    expect(
      toFinanceOffer({
        id: "bank-1",
        name: "AutoOne Capital",
        interestRate: 5.4,
        approvalSpeed: "Instant pre-approval",
        minDownPaymentPercent: 10,
        features: ["Digital documents"],
      } as never),
    ).toMatchObject({
      id: "bank-1",
      minDownPayment: 10,
      features: ["Digital documents"],
    });
  });

  it("computes rental totals on the server from authoritative prices", () => {
    const days = getRentalDays(new Date("2026-05-01"), new Date("2026-05-04"));

    expect(days).toBe(3);
    expect(calculateRentalTotal(95, 450, days, ["insurance", "gps"])).toBe(810);
  });

  it("rejects unsupported rental extras", () => {
    expect(() => calculateRentalTotal(95, 450, 1, ["unknown-extra"])).toThrow("Unsupported rental extra");
  });
});
