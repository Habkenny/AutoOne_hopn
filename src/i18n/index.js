import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: { home: "Home", services: "Services", bookings: "Bookings", profile: "Profile", dashboard: "Dashboard", partner: "Partner" },
      common: {
        bookNow: "Book now",
        book: "Book",
        compare: "Compare",
        comingSoon: "Coming soon",
        from: "From",
        rating: "Rating",
        distance: "Distance",
        price: "Price",
        availability: "Availability",
        location: "Location",
        preferences: "Preferences",
        theme: "Theme",
        currency: "Currency",
        language: "Language",
        reviews: "reviews",
        next: "Next",
        back: "Back",
        confirm: "Confirm booking",
        reset: "Start another booking",
        all: "All"
      },
      home: {
        eyebrow: "Workshops and car care in one place",
        title: "Find, compare, and book trusted auto services.",
        subtitle: "AutoOne connects you with verified workshops and car wash providers using clear pricing, ratings, and available time slots.",
        locationPlaceholder: "Enter your area",
        servicePlaceholder: "Choose service",
        search: "Search",
        workshopAction: "Book Workshop",
        carwashAction: "Book Car Wash",
        featured: "Featured services",
        popular: "Popular near you",
        heroRatingText: "Verified providers with transparent estimates."
      },
      services: {
        title: "Choose a service",
        subtitle: "Start with workshops or car wash. More AutoOne services are on the roadmap.",
        workshops: "Workshops",
        workshopsDesc: "Repairs, diagnostics, maintenance, and inspections.",
        carwash: "Car Wash",
        carwashDesc: "Exterior wash, detailing, and premium cleaning.",
        rentals: "Rentals",
        rentalsDesc: "Daily and long-term vehicle rentals.",
        imports: "Car Imports",
        importsDesc: "Import support and vehicle sourcing.",
        financing: "Financing",
        financingDesc: "Loan and payment options for drivers."
      },
      listing: {
        title: "{{service}} near you",
        subtitle: "Filter by location, rating, price, and availability to compare options quickly.",
        noResults: "No providers match these filters yet.",
        filters: "Filters",
        maxPrice: "Max price",
        minRating: "Min rating",
        openToday: "Open today"
      },
      detail: {
        overview: "Overview",
        reviews: "Customer reviews",
        timeSlots: "Available time slots",
        estimate: "Estimated price"
      },
      booking: {
        title: "Book your service",
        serviceStep: "Service",
        scheduleStep: "Schedule",
        detailsStep: "Details",
        confirmStep: "Confirm",
        selectService: "Select a service provider",
        chooseSchedule: "Choose date and time",
        yourDetails: "Your details",
        summary: "Review booking",
        name: "Full name",
        phone: "Phone number",
        car: "Vehicle model",
        notes: "Notes",
        date: "Date",
        time: "Time",
        selectTime: "Select time",
        successTitle: "Booking request sent",
        successBody: "Your provider will confirm shortly. This MVP uses mock APIs only.",
        required: "Please complete the required fields."
      },
      ai: {
        label: "AI assistant",
        title: "AutoOne Assistant",
        subtitle: "UI preview with predefined prompts.",
        promptCheap: "Find cheapest workshop",
        promptCarwash: "Best car wash near me",
        response: "I can help compare providers once live AI is connected. For now, try the filters on listings."
      },
      bookings: {
        empty: "Booking history will appear here when AutoOne connects to a backend. For the MVP, complete a mock booking from workshop or car wash listings."
      },
      profile: {
        title: "Profile",
        body: "Your saved vehicles, addresses, and preferences will live here in a full product build."
      },
      auth: {
        login: "Login",
        signup: "Sign up",
        logout: "Logout",
        welcome: "Welcome back",
        create: "Create your account",
        email: "Email",
        password: "Password",
        social: "Continue with Google",
        submitLogin: "Login to AutoOne",
        submitSignup: "Create account"
      },
      dashboard: {
        title: "User dashboard",
        bookings: "My bookings",
        details: "Booking details",
        profile: "Profile settings",
        saved: "Saved services",
        empty: "No bookings yet",
        cancel: "Cancel booking"
      },
      partner: {
        title: "Partner dashboard",
        overview: "Overview",
        management: "Booking management",
        services: "Service management",
        calendar: "Availability calendar",
        accept: "Accept",
        reject: "Reject",
        addService: "Add service"
      },
      notFound: {
        title: "Page not found",
        body: "The page you are looking for does not exist."
      }
    }
  },
  ar: {
    translation: {
      nav: { home: "الرئيسية", services: "الخدمات", bookings: "الحجوزات", profile: "الملف", dashboard: "لوحتي", partner: "الشريك" },
      common: {
        bookNow: "احجز الآن",
        book: "احجز",
        compare: "قارن",
        comingSoon: "قريباً",
        from: "ابتداءً من",
        rating: "التقييم",
        distance: "المسافة",
        price: "السعر",
        availability: "التوفر",
        location: "الموقع",
        preferences: "التفضيلات",
        theme: "المظهر",
        currency: "العملة",
        language: "اللغة",
        reviews: "تقييمات",
        next: "التالي",
        back: "رجوع",
        confirm: "تأكيد الحجز",
        reset: "حجز جديد",
        all: "الكل"
      },
      home: {
        eyebrow: "ورش وخدمات عناية بالسيارة في مكان واحد",
        title: "ابحث وقارن واحجز خدمات سيارات موثوقة.",
        subtitle: "يربطك AutoOne بورش ومغاسل سيارات موثوقة مع أسعار واضحة وتقييمات ومواعيد متاحة.",
        locationPlaceholder: "أدخل منطقتك",
        servicePlaceholder: "اختر الخدمة",
        search: "بحث",
        workshopAction: "احجز ورشة",
        carwashAction: "احجز مغسلة",
        featured: "الخدمات المميزة",
        popular: "الأكثر طلباً بالقرب منك",
        heroRatingText: "مزودون موثوقون مع أسعار تقديرية واضحة."
      },
      services: {
        title: "اختر خدمة",
        subtitle: "ابدأ بالورش أو مغاسل السيارات. المزيد من خدمات AutoOne قيد التخطيط.",
        workshops: "الورش",
        workshopsDesc: "صيانة وفحص وتشخيص وإصلاحات.",
        carwash: "مغاسل السيارات",
        carwashDesc: "غسيل خارجي وتلميع وتنظيف متقدم.",
        rentals: "التأجير",
        rentalsDesc: "تأجير يومي وطويل الأمد.",
        imports: "استيراد السيارات",
        importsDesc: "دعم الاستيراد وتوفير السيارات.",
        financing: "التمويل",
        financingDesc: "حلول قروض ودفع للسائقين."
      },
      listing: {
        title: "{{service}} بالقرب منك",
        subtitle: "استخدم الفلاتر حسب الموقع والتقييم والسعر والتوفر للمقارنة بسرعة.",
        noResults: "لا توجد نتائج تطابق هذه الفلاتر حالياً.",
        filters: "الفلاتر",
        maxPrice: "أعلى سعر",
        minRating: "أقل تقييم",
        openToday: "متاح اليوم"
      },
      detail: {
        overview: "نظرة عامة",
        reviews: "آراء العملاء",
        timeSlots: "المواعيد المتاحة",
        estimate: "السعر التقديري"
      },
      booking: {
        title: "احجز خدمتك",
        serviceStep: "الخدمة",
        scheduleStep: "الموعد",
        detailsStep: "البيانات",
        confirmStep: "التأكيد",
        selectService: "اختر مزود الخدمة",
        chooseSchedule: "اختر التاريخ والوقت",
        yourDetails: "بياناتك",
        summary: "راجع الحجز",
        name: "الاسم الكامل",
        phone: "رقم الهاتف",
        car: "موديل السيارة",
        notes: "ملاحظات",
        date: "التاريخ",
        time: "الوقت",
        selectTime: "اختر الوقت",
        successTitle: "تم إرسال طلب الحجز",
        successBody: "سيؤكد المزود طلبك قريباً. هذا النموذج يستخدم بيانات وهمية فقط.",
        required: "يرجى إكمال الحقول المطلوبة."
      },
      ai: {
        label: "المساعد الذكي",
        title: "مساعد AutoOne",
        subtitle: "واجهة تجريبية مع أسئلة جاهزة.",
        promptCheap: "اعثر على أرخص ورشة",
        promptCarwash: "أفضل مغسلة سيارات قريبة",
        response: "يمكنني مساعدتك في المقارنة عند ربط الذكاء الاصطناعي. حالياً جرّب فلاتر النتائج."
      },
      bookings: {
        empty: "سيظهر سجل الحجوزات هنا عند ربط AutoOne بالخادم. في هذا النموذج يمكنك إكمال حجز تجريبي من صفحات الورش أو مغاسل السيارات."
      },
      profile: {
        title: "الملف الشخصي",
        body: "ستظهر سياراتك المحفوظة وعناوينك وتفضيلاتك هنا في النسخة الكاملة."
      },
      auth: {
        login: "تسجيل الدخول",
        signup: "إنشاء حساب",
        logout: "خروج",
        welcome: "مرحباً بعودتك",
        create: "أنشئ حسابك",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        social: "المتابعة عبر Google",
        submitLogin: "الدخول إلى AutoOne",
        submitSignup: "إنشاء الحساب"
      },
      dashboard: {
        title: "لوحة المستخدم",
        bookings: "حجوزاتي",
        details: "تفاصيل الحجز",
        profile: "إعدادات الملف",
        saved: "الخدمات المحفوظة",
        empty: "لا توجد حجوزات بعد",
        cancel: "إلغاء الحجز"
      },
      partner: {
        title: "لوحة الشريك",
        overview: "نظرة عامة",
        management: "إدارة الحجوزات",
        services: "إدارة الخدمات",
        calendar: "تقويم التوفر",
        accept: "قبول",
        reject: "رفض",
        addService: "إضافة خدمة"
      },
      notFound: {
        title: "الصفحة غير موجودة",
        body: "الصفحة التي تبحث عنها غير موجودة."
      }
    }
  },
  de: {
    translation: {
      nav: { home: "Start", services: "Services", bookings: "Buchungen", profile: "Profil", dashboard: "Dashboard", partner: "Partner" },
      common: {
        bookNow: "Jetzt buchen",
        book: "Buchen",
        compare: "Vergleichen",
        comingSoon: "Demnächst",
        from: "Ab",
        rating: "Bewertung",
        distance: "Entfernung",
        price: "Preis",
        availability: "Verfügbarkeit",
        location: "Standort",
        preferences: "Einstellungen",
        theme: "Design",
        currency: "Währung",
        language: "Sprache",
        reviews: "Bewertungen",
        next: "Weiter",
        back: "Zurück",
        confirm: "Buchung bestätigen",
        reset: "Neue Buchung",
        all: "Alle"
      },
      home: {
        eyebrow: "Werkstätten und Autopflege an einem Ort",
        title: "Finde, vergleiche und buche vertrauenswürdige Autodienste.",
        subtitle: "AutoOne verbindet dich mit geprüften Werkstätten und Waschanbietern mit klaren Preisen, Bewertungen und freien Terminen.",
        locationPlaceholder: "Ort eingeben",
        servicePlaceholder: "Service wählen",
        search: "Suchen",
        workshopAction: "Werkstatt buchen",
        carwashAction: "Autowäsche buchen",
        featured: "Empfohlene Services",
        popular: "Beliebt in deiner Nähe",
        heroRatingText: "Geprüfte Anbieter mit transparenten Schätzungen."
      },
      services: {
        title: "Service auswählen",
        subtitle: "Starte mit Werkstätten oder Autowäsche. Weitere AutoOne Services sind geplant.",
        workshops: "Werkstätten",
        workshopsDesc: "Reparatur, Diagnose, Wartung und Inspektion.",
        carwash: "Autowäsche",
        carwashDesc: "Außenwäsche, Detailing und Premium-Reinigung.",
        rentals: "Mietwagen",
        rentalsDesc: "Tages- und Langzeitmiete.",
        imports: "Autoimporte",
        importsDesc: "Importberatung und Fahrzeugsuche.",
        financing: "Finanzierung",
        financingDesc: "Kredit- und Zahlungsoptionen."
      },
      listing: {
        title: "{{service}} in deiner Nähe",
        subtitle: "Filtere nach Ort, Bewertung, Preis und Verfügbarkeit.",
        noResults: "Noch keine Anbieter für diese Filter.",
        filters: "Filter",
        maxPrice: "Max. Preis",
        minRating: "Min. Bewertung",
        openToday: "Heute verfügbar"
      },
      detail: {
        overview: "Überblick",
        reviews: "Kundenbewertungen",
        timeSlots: "Freie Termine",
        estimate: "Preisvoranschlag"
      },
      booking: {
        title: "Service buchen",
        serviceStep: "Service",
        scheduleStep: "Termin",
        detailsStep: "Details",
        confirmStep: "Bestätigen",
        selectService: "Anbieter auswählen",
        chooseSchedule: "Datum und Uhrzeit wählen",
        yourDetails: "Deine Daten",
        summary: "Buchung prüfen",
        name: "Vollständiger Name",
        phone: "Telefonnummer",
        car: "Fahrzeugmodell",
        notes: "Notizen",
        date: "Datum",
        time: "Uhrzeit",
        selectTime: "Zeit auswählen",
        successTitle: "Buchungsanfrage gesendet",
        successBody: "Der Anbieter bestätigt in Kürze. Dieses MVP nutzt nur Mock-APIs.",
        required: "Bitte fülle die Pflichtfelder aus."
      },
      ai: {
        label: "KI-Assistent",
        title: "AutoOne Assistent",
        subtitle: "UI-Vorschau mit vordefinierten Prompts.",
        promptCheap: "Günstigste Werkstatt finden",
        promptCarwash: "Beste Autowäsche in meiner Nähe",
        response: "Ich kann Anbieter vergleichen, sobald Live-KI verbunden ist. Nutze aktuell die Filter."
      },
      bookings: {
        empty: "Deine Buchungshistorie erscheint hier, sobald AutoOne mit einem Backend verbunden ist. Im MVP kannst du eine Mock-Buchung über Werkstatt- oder Autowäsche-Listings abschließen."
      },
      profile: {
        title: "Profil",
        body: "Gespeicherte Fahrzeuge, Adressen und Präferenzen werden in einer vollständigen Produktversion hier verwaltet."
      },
      auth: {
        login: "Anmelden",
        signup: "Registrieren",
        logout: "Abmelden",
        welcome: "Willkommen zurück",
        create: "Konto erstellen",
        email: "E-Mail",
        password: "Passwort",
        social: "Mit Google fortfahren",
        submitLogin: "Bei AutoOne anmelden",
        submitSignup: "Konto erstellen"
      },
      dashboard: {
        title: "Nutzer-Dashboard",
        bookings: "Meine Buchungen",
        details: "Buchungsdetails",
        profile: "Profileinstellungen",
        saved: "Gespeicherte Services",
        empty: "Noch keine Buchungen",
        cancel: "Buchung stornieren"
      },
      partner: {
        title: "Partner-Dashboard",
        overview: "Übersicht",
        management: "Buchungsverwaltung",
        services: "Serviceverwaltung",
        calendar: "Verfügbarkeitskalender",
        accept: "Annehmen",
        reject: "Ablehnen",
        addService: "Service hinzufügen"
      },
      notFound: {
        title: "Seite nicht gefunden",
        body: "Die gesuchte Seite existiert nicht."
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: JSON.parse(window.localStorage.getItem("autoone.language") || "\"en\""),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
