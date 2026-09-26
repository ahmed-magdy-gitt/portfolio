import type {
  Profile,
  Project,
  SkillCategory,
  Stat,
  TimelineItem,
} from "./types";

export const profile: Profile = {
  name: "Ahmed Magdy",
  title: "Mobile Applications Engineer | Flutter & Native Android",
  bio: "I build mobile experiences that look sharp, run smoothly, and solve real problems. My sweet spot is crafting cross-platform apps with Flutter and high-performance native Android with Kotlin—backed by solid full-stack experience so everything connects seamlessly.",
  email: "ahmedmagdy707007@gmail.com",
  phone: "+201143196324",
  whatsapp:
    "https://wa.me/201143196324?text=Hi%20Ahmed,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect.",
  github: "https://github.com/ahmed-magdy-gitt",
  linkedin: "https://www.linkedin.com/in/ahmed-magdy-798370344",
  resume:
    "https://drive.google.com/file/d/1YSOBjlt2TJOuNMdh5UaDwIXMECAthm8x/view?usp=drivesdk",
};

export const stats: Stat[] = [
  {
    id: "programs",
    value: 4,
    suffix: "+",
    label: "National Programs",
    description:
      "Graduated with honors across top Egyptian software initiatives (DEPI, NTI, ITI).",
  },
  {
    id: "products",
    value: 9,
    label: "Shipped Products",
    description:
      "Production-ready mobile applications and full-stack enterprise systems.",
  },
  {
    id: "coverage",
    value: 100,
    suffix: "%",
    label: "Test Coverage",
    description:
      "Clean, bug-free codebase with complete automated unit test suites.",
  },
  {
    id: "enterprise",
    value: 0,
    displayValue: "Enterprise",
    label: "Ready",
    description:
      "Microservices, Clean Architecture, and real-time backend integrations.",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    id: "flutter",
    name: "Cross-Platform Mobile (Flutter)",
    skills: [
      { name: "Flutter", level: 95 },
      { name: "Dart", level: 92 },
      { name: "BLoC / Cubit State Management", level: 88 },
      { name: "Clean Architecture", level: 85 },
      { name: "Equatable", level: 78 },
      { name: "Firebase Ecosystem (Auth & Firestore)", level: 82 },
      { name: "Push Notifications", level: 75 },
      { name: "RTL Design", level: 80 },
      { name: "Deep Linking", level: 74 },
      { name: "Animations", level: 85 },
    ],
  },
  {
    id: "android",
    name: "Native Android Engineering",
    skills: [
      { name: "Kotlin", level: 92 },
      { name: "Java", level: 88 },
      { name: "Jetpack Compose", level: 85 },
      { name: "XML / ViewBinding", level: 80 },
      { name: "Android SensorManager", level: 78 },
      { name: "FusedLocation API", level: 76 },
      { name: "Retrofit 2", level: 84 },
      { name: "Navigation Component", level: 80 },
      { name: "Room DB", level: 82 },
      { name: "Material Design 3", level: 83 },
    ],
  },
  {
    id: "backend",
    name: "Backend & Distributed Systems",
    skills: [
      { name: "Java", level: 88 },
      { name: "Spring Boot", level: 90 },
      { name: "Spring Cloud Eureka & Gateway", level: 82 },
      { name: "ASP.NET Core (.NET 8)", level: 80 },
      { name: "Clean / Onion Architecture", level: 85 },
      { name: "Docker & Docker Compose", level: 83 },
      { name: "SignalR", level: 74 },
      { name: "JWT & RBAC", level: 86 },
    ],
  },
  {
    id: "web",
    name: "Web Frontend & UI",
    skills: [
      { name: "React", level: 85 },
      { name: "TypeScript", level: 88 },
      { name: "Vite", level: 78 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Bootstrap 5", level: 75 },
      { name: "Responsive Design", level: 88 },
    ],
  },
  {
    id: "data",
    name: "Databases & ORMs",
    skills: [
      { name: "SQL Server", level: 84 },
      { name: "MySQL", level: 80 },
      { name: "MongoDB", level: 78 },
      { name: "Entity Framework Core", level: 82 },
      { name: "Spring Data JPA", level: 80 },
    ],
  },
  {
    id: "quality",
    name: "Quality, Testing & Tooling",
    skills: [
      { name: "JUnit", level: 78 },
      { name: "Mockito", level: 75 },
      { name: "StateFlow Testing", level: 72 },
      { name: "Git & GitHub", level: 92 },
      { name: "Docker", level: 83 },
      { name: "Postman", level: 85 },
      { name: "Android Studio", level: 90 },
      { name: "VS Code", level: 90 },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "desert-maps",
    title: "Desert Maps & Offline GPS",
    titleAr: "خرائط الصحراء الدليلة",
    category: "Mobile Apps (Android & Flutter)",
    role: "Lead Android Engineer",
    summary:
      "An offline GPS and compass app for desert navigation, using onboard sensors alone to find direction and position with zero network coverage.",
    techStack: [
      "Kotlin",
      "Android Location API",
      "Magnetometer",
      "Orientation Sensors",
      "Gradle (Kotlin DSL)",
    ],
    links: {
      github: "https://github.com/ahmed-magdy-gitt/Maps-GPS-App",
      store: "#",
    },
    highlights: [
      "Built a fully offline GPS land-navigation system for desert exploration without cellular coverage",
      "Integrated hardware magnetometer and orientation sensors for compass navigation and Qibla direction",
      "Implemented coordinate parsing, distance and altitude calculations, and offline waypoint categorization",
    ],
    images: [
      "/projects/desert-maps-1.png",
      "/projects/desert-maps-2.png",
      "/projects/desert-maps-3.png",
      "/projects/desert-maps-4.png",
      "/projects/desert-maps-5.png",
      "/projects/desert-maps-6.png",
    ],
    caseStudy: {
      problem:
        "Desert navigation happens exactly where cellular coverage and pre-downloaded map tiles don't reach, so the app has to find direction and position using only onboard hardware.",
      architecture: [
        "Native Android app in Kotlin, built with Gradle Kotlin DSL",
        "Hardware magnetometer and orientation sensors feed a compass and Qibla-direction layer",
        "Android Location API handles offline waypoint storage, categorization and distance/altitude math",
      ],
      challenges: [
        "Fusing raw sensor input into a stable compass heading without visible jitter",
        "Getting accurate positioning and navigation math with zero network connectivity",
      ],
    },
  },
  {
    id: "online-xo",
    title: "Online XO",
    category: "Mobile Apps (Android & Flutter)",
    role: "Mobile Architect & Flutter Engineer",
    summary:
      "A real-time multiplayer tic-tac-toe game with zero-latency board sync and atomic score updates across public and private lobbies.",
    techStack: [
      "Flutter",
      "Dart",
      "flutter_bloc / Cubit",
      "Equatable",
      "Firebase Auth",
      "Cloud Firestore",
    ],
    links: {
      github: "https://github.com/ahmed-magdy-gitt/online-XO-App",
    },
    highlights: [
      "Delivered zero-latency remote board updates for a real-time multiplayer game using Firestore stream listeners",
      "Separated presentation, Cubit state machines, domain models and infrastructure under strict clean architecture",
      "Built public/private matchmaking lobbies with 30-second turn timers and atomic score updates via Firestore transactions",
    ],
    images: [
      "/projects/online-xo-1.png",
      "/projects/online-xo-2.png",
      "/projects/online-xo-3.png",
      "/projects/online-xo-4.png",
    ],
    caseStudy: {
      problem:
        "A real-time multiplayer game needs every move to appear on the opponent's board instantly, with no way for two players to ever legitimately disagree on the board state.",
      architecture: [
        "Flutter client with feature-driven clean architecture separating presentation, Cubit state machines, domain models and infrastructure",
        "Cloud Firestore as the real-time source of truth, consumed via stream listeners",
        "Firebase Auth for player identity across public and private lobbies",
      ],
      challenges: [
        "Keeping board updates at zero perceptible latency across both players' devices",
        "Making score updates atomic under Firestore transactions so simultaneous writes can't corrupt game state",
      ],
    },
  },
  {
    id: "movie-discovery",
    title: "Movie Discovery App",
    category: "Mobile Apps (Android & Flutter)",
    role: "Android Engineer — Architecture, Networking & Testing",
    summary:
      "A movie-browsing app built with Jetpack Compose, backed by a fully tested Retrofit networking layer with a 100% unit-test pass rate.",
    techStack: [
      "Kotlin",
      "Jetpack Compose",
      "Material Design 3",
      "Retrofit",
      "Navigation Component",
      "JUnit",
    ],
    links: {
      github: "https://github.com/ahmed-magdy-gitt/movie-discovery-app",
    },
    highlights: [
      "Built with reactive, declarative UI in Jetpack Compose as part of the DEPI Android track",
      "Architected the Retrofit networking layer with credentials secured via a Gradle secrets plugin",
      "Authored a unit test suite with a 100% pass rate across mapper, view-model and repository tests",
    ],
    images: [
      "/projects/movie-discovery-1.png",
      "/projects/movie-discovery-2.png",
      "/projects/movie-discovery-3.png",
      "/projects/movie-discovery-4.png",
      "/projects/movie-discovery-5.png",
      "/projects/movie-discovery-6.png",
      "/projects/movie-discovery-7.png",
    ],
    caseStudy: {
      problem:
        "A movie-browsing app needs a networking and state layer that's reliable enough to trust with an automated test suite, not just a UI that looks right.",
      architecture: [
        "Jetpack Compose for a fully declarative, reactive UI",
        "Retrofit networking layer with credentials secured behind a Gradle secrets plugin",
        "Navigation Component wiring screens together within a Material Design 3 shell",
      ],
      challenges: [
        "Keeping API credentials out of source control while still building locally via the DEPI Android track setup",
        "Writing mapper, view-model and repository tests thorough enough to hold a 100% pass rate",
      ],
    },
  },
  {
    id: "pattern-sign-language",
    title: "Pattern & Sign Language",
    titleAr: "باترون وإشارة",
    category: "Mobile Apps (Android & Flutter)",
    role: "Flutter Engineer — EdTech & Accessibility",
    summary:
      "An accessibility-first learning platform that teaches garment drafting to deaf and hard-of-hearing learners through captioned video and interactive evaluations.",
    techStack: ["Flutter", "Dart", "Firebase", "YouTube Embedded API", "RTL UI"],
    links: {
      github: "https://github.com/ahmed-magdy-gitt/pattern-and-sign-language-app",
    },
    highlights: [
      "Built an accessibility-focused platform for the deaf and hard-of-hearing community to learn garment drafting",
      "Designed an interactive evaluation engine with pre- and post-tests to measure skill retention",
      "Shipped responsive RTL layouts with a community feedback board backed by Firebase",
    ],
    images: [
      "/projects/pattern-sign-language-1.png",
      "/projects/pattern-sign-language-2.png",
      "/projects/pattern-sign-language-3.png",
      "/projects/pattern-sign-language-4.png",
      "/projects/pattern-sign-language-5.png",
      "/projects/pattern-sign-language-6.png",
    ],
    caseStudy: {
      problem:
        "Garment-drafting instruction is almost entirely spoken and visual, which shuts out deaf and hard-of-hearing learners unless the material is redesigned around that constraint from the start.",
      architecture: [
        "Flutter app with RTL-first layouts throughout",
        "YouTube Embedded API for visual, captioned instructional content",
        "Firebase backing a community feedback board and content delivery",
      ],
      challenges: [
        "Designing an interactive pre-/post-test evaluation engine that actually measures skill retention",
        "Building responsive RTL UI that holds up across the accessibility-focused content types",
      ],
    },
  },
  {
    id: "healthyme",
    title: "HealthyMe",
    category: "Mobile Apps (Android & Flutter)",
    role: "Mobile Developer",
    summary:
      "A BMI tool with dynamic, category-driven theming that turns a raw number into an instantly understandable result.",
    techStack: ["Kotlin", "Android SDK", "ViewBinding", "DecelerateInterpolator", "GradientDrawable"],
    links: {
      github: "https://github.com/ahmed-magdy-gitt/MobileApp_HealthyMe_BMI",
    },
    highlights: [
      "Built dynamic theming keyed to BMI categories: underweight, normal, overweight, obese",
      "Designed entrance transitions with custom interpolators and programmatic gradient styling",
    ],
    images: [
      "/projects/healthyme-1.png",
      "/projects/healthyme-2.png",
      "/projects/healthyme-3.png",
      "/projects/healthyme-4.png",
      "/projects/healthyme-5.png",
    ],
    caseStudy: {
      problem:
        "A BMI tool is only useful if people understand what their number means at a glance, not just the raw figure.",
      architecture: [
        "Native Android in Kotlin with ViewBinding",
        "Dynamic theming keyed to BMI category: underweight, normal, overweight, obese",
        "GradientDrawable-based programmatic styling driven by the calculated category",
      ],
      challenges: [
        "Designing entrance transitions with custom DecelerateInterpolator timing that feel intentional rather than generic",
        "Keeping the gradient theming logic in sync with the calculated BMI category in real time",
      ],
    },
  },
  {
    id: "prayer-app",
    title: "Prayer App (Athan & Qibla)",
    category: "Mobile Apps (Android & Flutter)",
    role: "Mobile Engineer — Sensors & Networking",
    summary:
      "A prayer-times and Qibla-direction companion that fuses live sensor data with precise geospatial math for a smooth, accurate compass.",
    techStack: ["Kotlin", "Retrofit 2", "Gson", "SensorManager", "FusedLocationProviderClient"],
    links: {
      github: "https://github.com/ahmed-magdy-gitt/MobileApp_Prayer",
    },
    highlights: [
      "Calculated precise Kaaba bearing using Haversine and great-circle formulas via atan2, sin and cos",
      "Fused magnetometer and accelerometer input for a smooth, jitter-free rotating compass",
      "Integrated the Aladhan REST API for dynamic prayer times with async parsing and Azkar state cycling",
    ],
    images: [
      "/projects/prayer-app-1.png",
      "/projects/prayer-app-2.png",
      "/projects/prayer-app-3.png",
    ],
    caseStudy: {
      problem:
        "Finding the Qibla direction and accurate prayer times needs both precise geospatial math and a compass that stays smooth as the phone moves — get either wrong and the app is unusable.",
      architecture: [
        "Native Android in Kotlin, using SensorManager and FusedLocationProviderClient",
        "Retrofit 2 + Gson client for the Aladhan REST API",
        "Haversine / great-circle math (atan2, sin, cos) driving the Kaaba-bearing calculation",
      ],
      challenges: [
        "Fusing magnetometer and accelerometer data into a jitter-free rotating compass",
        "Keeping prayer-time parsing and Azkar state cycling correct across async API calls",
      ],
    },
  },
  {
    id: "gym-xfit",
    title: "Gym-XFIT",
    category: "Web & E-Commerce Platforms",
    role: "Front-End & Web Developer",
    summary:
      "A gym storefront and scheduling site combining gear sales, membership management, and class bookings behind a persistent client-side cart.",
    techStack: ["JavaScript (ES6+)", "HTML5", "CSS3", "Bootstrap 5", "Animate.css", "LocalStorage"],
    links: {
      demo: "https://ahmed-magdy-gitt.github.io/Gym-XFIT/store.html",
      github: "https://github.com/ahmed-magdy-gitt/Gym-XFIT-Full-Stack-Implementation",
    },
    highlights: [
      "Combined a commercial gear and supplement store with membership and class-scheduling workflows",
      "Built a persistent client-side cart using LocalStorage for seamless session retention",
      "Shipped dynamic class schedules, trainer rosters and an embedded real-time BMI calculator",
    ],
    images: [
      "/projects/gym-xfit-1.png",
      "/projects/gym-xfit-2.png",
      "/projects/gym-xfit-3.png",
      "/projects/gym-xfit-4.png",
      "/projects/gym-xfit-5.png",
    ],
    caseStudy: {
      problem:
        "A gym needs one site that sells gear and supplements, manages memberships, and publishes a class schedule — without the cost of separate systems for each.",
      architecture: [
        "Static, dependency-light front end built with vanilla JavaScript (ES6+), HTML5 and CSS3",
        "Bootstrap 5 grid and components for the store and scheduling layouts",
        "LocalStorage used as a lightweight client-side cart and session store",
      ],
      challenges: [
        "Keeping the cart consistent across page loads and sessions with only client-side storage",
        "Building a real-time BMI calculator and trainer roster without a backend to lean on",
      ],
    },
  },
  {
    id: "driveshare",
    title: "DriveShare",
    category: "Backend & Distributed Systems",
    role: "Full-Stack Architect & Backend Lead",
    summary:
      "A peer-to-peer car rental marketplace built on strict Clean Architecture, with real-time approvals over SignalR and role-based access for renters, owners, and admins.",
    techStack: [
      "ASP.NET Core (.NET 8)",
      "Clean / Onion Architecture",
      "React (TypeScript + Vite)",
      "Entity Framework Core",
      "SQL Server",
      "SignalR",
      "JWT & RBAC",
    ],
    links: {
      github: "https://github.com/ahmed-magdy-gitt/DriveShare-CarRental-Platform",
    },
    highlights: [
      "Engineered a P2P car rental platform on strict Clean/Onion architecture across domain, application, infrastructure, API and SPA client layers",
      "Built an end-to-end booking engine with schedule-overlap prevention, automated status transitions and license verification",
      "Pushed real-time approvals and listing decisions over SignalR hubs",
      "Secured multi-tenant access with JWT and role-based access for admin, owner and renter roles",
    ],
    images: [
      "/projects/driveshare-1.png",
      "/projects/driveshare-2.png",
      "/projects/driveshare-3.png",
      "/projects/driveshare-4.png",
      "/projects/driveshare-5.png",
    ],
    caseStudy: {
      problem:
        "A peer-to-peer car rental marketplace needs strict separation between renters, owners and admins, plus booking logic that can't double-book a car or leave listings in an inconsistent state.",
      architecture: [
        "Clean/Onion architecture: domain and application layers stay framework-free, with infrastructure and API layers depending inward",
        "ASP.NET Core (.NET 8) Web API backed by Entity Framework Core and SQL Server",
        "React (TypeScript + Vite) SPA client consuming the API and SignalR hubs",
        "SignalR hubs push real-time booking approvals and listing updates without polling",
      ],
      challenges: [
        "Preventing schedule overlaps and enforcing automated status transitions across the booking lifecycle",
        "Modeling license verification and multi-tenant JWT/RBAC so admin, owner and renter roles see only what they should",
      ],
    },
  },
  {
    id: "coworking-hub",
    title: "Coworking Hub",
    category: "Backend & Distributed Systems",
    role: "Backend & Systems Engineer",
    summary:
      "A booking platform decomposed into independent microservices, with automatic service discovery, dynamic routing, and one-command Docker orchestration.",
    techStack: [
      "Java",
      "Spring Boot",
      "Spring Cloud Eureka",
      "Spring Cloud Gateway",
      "Spring Data JPA",
      "MySQL",
      "Docker Compose",
      "Maven",
    ],
    links: {
      github: "https://github.com/ahmed-magdy-gitt/Coworking-Space-Booking-System",
    },
    highlights: [
      "Decomposed an enterprise booking platform into autonomous microservices: API gateway (8080), Eureka discovery (8761), user service (8081), booking service (8082)",
      "Built dynamic service registration, health monitoring and request routing with Spring Cloud Gateway",
      "Containerized the full ecosystem with Docker Compose for automated multi-container orchestration",
    ],
    images: [
      "/projects/coworking-hub-1.png",
      "/projects/coworking-hub-2.png",
      "/projects/coworking-hub-3.png",
      "/projects/coworking-hub-4.png",
    ],
    caseStudy: {
      problem:
        "A single monolithic booking service becomes a bottleneck and a single point of failure once user management, booking logic and routing all have to scale independently.",
      architecture: [
        "API gateway (port 8080) fronts every client request and routes it to the correct downstream service",
        "Eureka discovery server (port 8761) tracks live service instances so the gateway never routes to a dead node",
        "User service (8081) and booking service (8082) run as independent, horizontally-scalable Spring Boot applications",
        "MySQL persistence per service, orchestrated together with Docker Compose for one-command startup",
      ],
      challenges: [
        "Keeping service discovery and health checks accurate enough for the gateway to safely route production traffic",
        "Designing request routing rules in Spring Cloud Gateway without hardcoding service locations",
      ],
    },
  },
];

export const timeline: TimelineItem[] = [
  {
    id: "helwan",
    title: "B.Sc. in Information Systems",
    org: "Faculty of Computers and Artificial Intelligence, Helwan University",
    orgUrl: "https://fci.capu.edu.eg/index.php/en/",
    type: "degree",
    description:
      "Foundation in systems design, databases and software engineering principles.",
  },
  {
    id: "depi-flutter",
    title: "Digital Egypt Pioneers Initiative — Flutter Track",
    org: "DEPI",
    orgUrl: "https://depi.gov.eg/",
    certificateUrl: "/certificates/depi.jpg",
    type: "training",
    description:
      "Advanced cross-platform application design, state management and clean architecture.",
  },
  {
    id: "nti",
    title: "MEAN Stack Program",
    org: "National Telecommunication Institute (NTI)",
    orgUrl: "https://www.nti.sci.eg/",
    certificateUrl: "/certificates/nti.jpg",
    type: "training",
    description:
      "Full-stack web engineering across MongoDB, Express, Angular and Node.js — graduated with 95% excellence.",
  },
  {
    id: "iti",
    title: "Flutter Program",
    org: "Information Technology Institute (ITI)",
    orgUrl: "https://www.linkedin.com/school/information-technology-institute-iti-/",
    type: "training",
    description: "Specialized track in cross-platform mobile application development.",
  },
  {
    id: "depi-android",
    title: "Digital Egypt Pioneers Initiative — Android Track",
    org: "DEPI",
    orgUrl: "https://depi.gov.eg/",
    certificateUrl: "/certificates/depi.jpg",
    type: "training",
    description:
      "Native Android engineering with Kotlin, Jetpack Compose and modern architecture components.",
  },
];
