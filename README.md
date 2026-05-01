# AutoOne Frontend

Production-ready frontend system for AutoOne, focused on the core customer flow and real-world account/vendor UX:

Find -> Compare -> Book -> Manage.

## Stack

- React + Vite
- Tailwind CSS
- React Router
- TanStack Query
- react-i18next with English, Arabic RTL, and German
- Mock API layer only

## File Structure

```text
src/
  app/
    App.jsx
    ProtectedRoute.jsx
    providers.jsx
  components/
    common/
      FavoriteButton.jsx
      NotificationBell.jsx
      ThemeToggle.jsx
    ui/
      Badge.jsx
      Button.jsx
      Card.jsx
      Input.jsx
      Loader.jsx
      Modal.jsx
      ToastHost.jsx
    AIAssistant.jsx
    Button.jsx
    LanguageSwitcher.jsx
    PageLoader.jsx
    Rating.jsx
    SearchBar.jsx
    ServiceCard.jsx
    Skeleton.jsx
    StepIndicator.jsx
  features/
    auth/
      index.js
    bookings/
      index.js
    carwash/
      index.js
    dashboard/
      index.js
    financing/
      financeData.js
      index.js
    imports/
      importsData.js
      index.js
    notifications/
      index.js
    partner/
      index.js
    rentals/
      RentalCard.jsx
      index.js
      rentalsData.js
    shared/
      MarketplaceContext.jsx
    workshops/
      index.js
  context/
    index.js
  hooks/
    useServiceFeature.js
  i18n/
    index.js
  layouts/
    MainLayout.jsx
  pages/
    Booking.jsx
    Bookings.jsx
    Dashboard.jsx
    Home.jsx
    Listing.jsx
    Login.jsx
    NotFound.jsx
    Partner.jsx
    Profile.jsx
    Financing.jsx
    Imports.jsx
    RentalBooking.jsx
    RentalDetail.jsx
    Rentals.jsx
    ServiceDetail.jsx
    Services.jsx
    Signup.jsx
  services/
    mockApi.js
  store/
    AppStateContext.jsx
  utils/
    storage.js
  index.css
  main.jsx
```

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Implemented Scope

- Workshops and Car Wash booking
- Car Rentals beta: search, filters, listings, detail, availability UI, extras, booking simulation
- Car Imports beta: region/catalog wizard, shipping details, cost calculator, tracking timeline
- Car Financing beta: loan calculator, bank comparison, application modal
- User dashboard with bookings, details, profile settings, cancellation UI, and saved services
- Partner dashboard with stats, booking accept/reject UI, service management, availability calendar, and simple charts
- Frontend-only login/signup with protected routes
- Notification dropdown with unread state and mark-as-read
- Favorites persisted in localStorage
- Search suggestions and recent searches
- Persistent dark mode
- Persistent language preference with English, Arabic RTL, and German
- Persistent currency preference with USD, EUR, AED, and SAR display conversion
- Mobile preferences drawer for language, currency, theme, and account actions
- Semantic design utility classes for future token-based UI cleanup
- Toast notifications, skeleton loaders, and mock error states
- Four-step booking form with validation and success state
- Mobile-first responsive UI
- Floating AI assistant UI with predefined prompts
