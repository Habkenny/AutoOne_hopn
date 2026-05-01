export const importRegions = [
  { id: "US", label: "United States", shipping: 2400, customsRate: 0.18, eta: "8-10 weeks" },
  { id: "EU", label: "European Union", shipping: 1100, customsRate: 0.12, eta: "3-5 weeks" },
  { id: "China", label: "China", shipping: 2800, customsRate: 0.2, eta: "10-12 weeks" },
];

export const importsData = [
  {
    id: "imp-1",
    model: "Tesla Model Y Long Range",
    region: "US",
    price: 42800,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
    specs: ["EV", "Long Range", "AWD"],
  },
  {
    id: "imp-2",
    model: "Audi A6 Avant",
    region: "EU",
    price: 38900,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
    specs: ["Diesel", "Premium", "Wagon"],
  },
  {
    id: "imp-3",
    model: "BYD Seal",
    region: "China",
    price: 31900,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
    specs: ["EV", "Sedan", "Extended battery"],
  },
  {
    id: "imp-4",
    model: "Ford Mustang GT",
    region: "US",
    price: 45200,
    image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80",
    specs: ["V8", "Coupe", "Performance"],
  },
];

export const importTimeline = ["Ordered", "Shipped", "Customs", "Delivered"];
