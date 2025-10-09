// HOLIBAYT/src/contexts/LanguageContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from 'react';

export type Language = 'FR' | 'EN' | 'AR';

interface LanguageContextType {
  currentLang: Language;
  setCurrentLang: (lang: Language) => void;
  t: (key: string) => string | any;
}

/* ─────────────────────────────────────────────────────────────
   FULL TRANSLATIONS (comprehensive from website). Keep as-is.
   If you later add new UI strings, add keys here in all 3 langs.
   ──────────────────────────────────────────────────────────── */
const allTranslations: Record<Language, Record<string, string>> = {
  FR: {
    // Navigation
    home: "Accueil",
    buy: "Acheter",
    rent: "Louer",
    shortStay: "Court Séjour",
    blog: "Blog",
    cities: "Villes",
    about: "À Propos",
    contact: "Contact",
    login: "Connexion",
    profile: "Profil",
    messages: "Messages",
    bookings: "Réservations",
    wishlist: "Favoris",
    logout: "Déconnexion",
    publishProperty: "Publier une Propriété",
    
    // Hero Section
    heroTitle: "Trouvez Votre Propriété de Rêve en Algérie",
    heroSubtitle: "Découvrez des maisons, appartements et villas exceptionnels dans tout le pays",
    searchPlaceholder: "Rechercher par ville, quartier ou adresse...",
    searchButton: "Rechercher",
    findDreamProperty: 'Trouvez la Propriété de Vos Rêves',
    buyHeroDescription: 'Découvrez des propriétés exceptionnelles à vendre à travers l\'Algérie avec nos conseils d\'experts.',
    findPerfectRental: 'Trouvez Votre Location Parfaite',
    rentHeroDescription: 'Explorez des propriétés locatives de qualité qui correspondent à votre style de vie et budget.',
    findPerfectStay: 'Trouvez Votre Séjour Parfait',
    shortStayHeroDescription: 'Réservez des hébergements uniques pour des séjours courts mémorables à travers l\'Algérie.',
    
    // Property Types
    apartment: "Appartement",
    villa: "Villa",
    house: "Maison",
    studio: "Studio",
    penthouse: "Penthouse",
    duplex: "Duplex",
    traditional: "Maison Traditionnelle",
    
    // Property Categories
    forSale: "À Vendre",
    forRent: "À Louer",
    shortStayRental: "Location Court Séjour",
    
    // Property Details
    bedrooms: "Chambres",
    bathrooms: "Salles de bain",
    area: "Surface",
    areaUnit: 'm²',
    price: "Prix",
    perMonth: "par mois",
    perNight: "par nuit",
    perDay: '/jour',
    perWeek: '/semaine',
    day: 'jour',
    week: 'semaine',
    month: 'mois',
    viewDetails: "Voir Détails",
    bookNow: "Réserver Maintenant",
    scheduleVisit: "Planifier une Visite",
    contactOwner: "Contacter le Propriétaire",
    
    // Features & Amenities
    features: "Caractéristiques",
    amenities: "Équipements",
    parking: "Parking",
    wifi: "Wi-Fi",
    airConditioning: "Climatisation",
    heating: "Chauffage",
    balcony: "Balcon",
    garden: "Jardin",
    pool: "Piscine",
    gym: "Salle de sport",
    elevator: "Ascenseur",
    security: "Sécurité 24/7",
    furnished: "Meublé",
    petsAllowed: "Animaux acceptés",
    privatePool: "Piscine privée",
    landscapedGarden: "Jardin paysager",
    garage2Cars: "Garage 2 voitures",
    alarmSystem: "Système d'alarme",
    equippedKitchen: "Cuisine équipée",
    
    // Cities
    algiers: "Alger",
    oran: "Oran",
    constantine: "Constantine",
    annaba: "Annaba",
    blida: "Blida",
    setif: "Sétif",
    tlemcen: "Tlemcen",
    bejaia: "Béjaïa",
    
    // City Descriptions
    algiersDescription: "La capitale et plus grande ville d'Algérie, mélange unique d'architecture moderne et de charme historique",
    oranDescription: "La perle de la Méditerranée, connue pour ses plages magnifiques et sa scène culturelle vibrante",
    constantineDescription: "La ville des ponts, perchée sur des plateaux rocheux avec une riche histoire",
    annabaDescription: "Une ville côtière dynamique offrant de superbes plages et une industrie florissante",
    
    // City Histories
    algiersHistory: "Alger, capitale de l'Algérie, est une ville millénaire dont l'histoire remonte à l'époque phénicienne. Fondée vers 944, la ville a été tour à tour berbère, romaine, arabe et ottomane. La Casbah d'Alger, classée au patrimoine mondial de l'UNESCO, témoigne de ce riche passé avec ses ruelles étroites et ses maisons blanches. Durant la période coloniale française, Alger a connu une transformation urbaine majeure avec la construction de boulevards haussmanniens. Aujourd'hui, Alger est une métropole moderne qui conserve son patrimoine historique tout en se tournant vers l'avenir.",
    
    oranHistory: "Oran, deuxième ville d'Algérie, a été fondée en 903 par des commerçants andalous. Son histoire est marquée par de multiples influences : berbères, arabes, espagnoles, ottomanes et françaises. Le Fort de Santa Cruz, perché sur les hauteurs, rappelle la période de domination espagnole (1509-1792). La ville est également célèbre pour être le berceau du raï, genre musical algérien mondialement reconnu. Oran est aujourd'hui un important port méditerranéen et un centre culturel majeur.",
    
    constantineHistory: "Constantine, l'une des plus anciennes villes du monde, était autrefois connue sous le nom de Cirta, capitale du royaume numide. Perchée à 600 mètres d'altitude sur un rocher calcaire, elle est célèbre pour ses ponts spectaculaires qui enjambent les gorges du Rhumel. Reconstruite par l'empereur romain Constantin Ier au IVe siècle, elle porte son nom depuis. La ville a joué un rôle crucial dans l'histoire de l'Afrique du Nord et conserve de nombreux monuments historiques.",
    
    annabaHistory: "Annaba, anciennement Hippone, fut une importante cité romaine où Saint Augustin fut évêque au Ve siècle. La ville conserve des vestiges romains significatifs, notamment les ruines d'Hippone. Durant l'époque ottomane, elle devint un port commercial majeur. Aujourd'hui, Annaba est une ville industrielle dynamique tout en préservant son riche patrimoine historique et ses magnifiques plages méditerranéennes.",
    
    // Footer
    footerAbout: "À Propos de Holibayt",
    footerDescription: "Votre plateforme de confiance pour trouver la propriété parfaite en Algérie",
    quickLinks: "Liens Rapides",
    support: "Support",
    legal: "Légal",
    privacyPolicy: "Politique de Confidentialité",
    termsOfService: "Conditions d'Utilisation",
    followUs: "Suivez-nous",
    
    // Filters
    filters: "Filtres",
    priceRange: "Fourchette de Prix",
    propertyType: "Type de Propriété",
    location: "Localisation",
    applyFilters: "Appliquer les Filtres",
    clearFilters: "Effacer les Filtres",
    sortBy: "Trier par",
    newest: "Plus Récent",
    priceLowToHigh: "Prix: Croissant",
    priceHighToLow: "Prix: Décroissant",
    
    // Booking
    checkIn: "Arrivée",
    checkOut: "Départ",
    guests: "Invités",
    guest: 'invité',
    adults: 'Adultes',
    children: 'Enfants',
    infants: 'Bébés',
    pets: 'Animaux',
    ages13OrAbove: '13 ans ou plus',
    ages2to12: '2 à 12 ans',
    under2: 'Moins de 2 ans',
    bringingServiceAnimal: 'Amenez-vous un animal de service ?',
    who: 'Qui',
    addGuests: 'Ajouter des invités',
    totalPrice: "Prix Total",
    bookingFee: "Frais de Réservation",
    securityDeposit: "Caution",
    confirmBooking: "Confirmer la Réservation",
    
    // Reviews
    reviews: "Avis",
    rating: "Note",
    cleanliness: "Propreté",
    accuracy: "Exactitude",
    checkInExperience: "Expérience d'Arrivée",
    communication: "Communication",
    locationRating: "Emplacement",
    value: "Rapport Qualité-Prix",
    writeReview: "Écrire un Avis",
    
    // Blog
    latestInsights: "Dernières Actualités",
    readMore: "Lire Plus",
    seeAll: "Voir Tout",
    categories: "Catégories",
    allCategories: "Toutes les Catégories",
    realEstate: "Immobilier",
    investing: "Investissement",
    renovation: "Rénovation",
    legal: "Juridique",
    
    // Blog Interactions
    shareThisArticle: "Partager cet article",
    comments: "Commentaires",
    writeComment: "Écrire un commentaire...",
    postComment: "Publier le Commentaire",
    reply: "Répondre",
    linkCopied: "Lien copié dans le presse-papiers!",
    leaveComment: "Laisser un commentaire",
    readTime: "min de lecture",
    author: "Auteur",
    publishedOn: "Publié le",
    relatedArticles: "Articles Connexes",
    backToBlog: "Retour au Blog",
    
    // Newsletter
    newsletterTitle: "Restez Informé",
    newsletterDescription: "Inscrivez-vous à notre newsletter pour recevoir les dernières actualités immobilières",
    emailPlaceholder: "Votre adresse email",
    subscribe: "S'abonner",
    
    // Contact
    contactUs: "Contactez-nous",
    fullName: "Nom Complet",
    email: "Email",
    phone: "Téléphone",
    message: "Message",
    sendMessage: "Envoyer le Message",
    
    // About
    aboutTitle: "À Propos de Holibayt",
    aboutDescription: "Holibayt est la plateforme immobilière de référence en Algérie, connectant acheteurs, locataires et propriétaires depuis 2024.",
    ourMission: "Notre Mission",
    ourVision: "Notre Vision",
    
    // Error Messages
    errorLoading: "Erreur de chargement",
    noResults: "Aucun résultat trouvé",
    tryAgain: "Réessayer",
    noPropertiesFound: 'Aucune propriété trouvée',
    
    // Success Messages
    bookingConfirmed: "Réservation confirmée!",
    messageSent: "Message envoyé avec succès!",
    profileUpdated: "Profil mis à jour!",
    
    // Dashboard
    dashboard: "Tableau de Bord",
    myProperties: "Mes Propriétés",
    myBookings: "Mes Réservations",
    myMessages: "Mes Messages",
    settings: "Paramètres",
    
    // Property Management
    addProperty: "Ajouter une Propriété",
    editProperty: "Modifier la Propriété",
    deleteProperty: "Supprimer la Propriété",
    propertyStatus: "Statut de la Propriété",
    active: "Actif",
    pending: "En Attente",
    inactive: "Inactif",
    
    // Admin
    adminPanel: "Panneau Admin",
    users: "Utilisateurs",
    properties: "Propriétés",
    bookingsAdmin: "Réservations",
    reports: "Rapports",
    
    // Trending Areas
    trendingAreas: "Zones Tendances",
    exploreArea: "Explorer la Zone",
    propertiesAvailable: "propriétés disponibles",
    
    // Common
    search: 'Rechercher',
    cancel: 'Annuler',
    save: 'Enregistrer',
    clear: 'Effacer',
    from: 'Du',
    to: 'Au',
    selectDate: 'Sélectionner une date',
    selectDates: 'Sélectionner des dates',
    browseAllProperties: 'Parcourir toutes les propriétés',
    start: 'Commencer',
    myProfile: 'Mon profil',
    myWishlist: 'Ma liste de souhaits',
    wishlistEmpty: 'Votre liste de souhaits est vide',
    startBrowsing: 'Commencez à parcourir les propriétés et ajoutez vos favoris',
    browseProperties: 'Parcourir les propriétés',
    loginToViewWishlist: 'Veuillez vous connecter pour voir votre liste de souhaits',
    buyProperty: 'Acheter un bien',
    rentProperty: 'Louer un logement',
    shortStayProperty: 'Court séjour',
    heroTitle: 'Holibayt',
    heroSubtitle: 'Achetez. Louez. Vivez l\'Algérie autrement.',
    heroDescription: 'La première plateforme immobilière digitale nouvelle génération pour l\'Algérie.',
  },
  EN: {
    // Navigation
    home: "Home",
    buy: "Buy",
    rent: "Rent",
    shortStay: "Short Stay",
    blog: "Blog",
    cities: "Cities",
    about: "About",
    contact: "Contact",
    login: "Login",
    profile: "Profile",
    messages: "Messages",
    bookings: "Bookings",
    wishlist: "Wishlist",
    logout: "Logout",
    publishProperty: "Publish Property",
    
    // Hero Section
    heroTitle: "Find Your Dream Property in Algeria",
    heroSubtitle: "Discover exceptional homes, apartments, and villas across the country",
    searchPlaceholder: "Search by city, neighborhood, or address...",
    searchButton: "Search",
    findDreamProperty: 'Find Your Dream Property',
    buyHeroDescription: 'Discover exceptional properties for sale across Algeria with expert guidance.',
    findPerfectRental: 'Find Your Perfect Rental',
    rentHeroDescription: 'Explore quality rental properties that match your lifestyle and budget.',
    findPerfectStay: 'Find Your Perfect Stay',
    shortStayHeroDescription: 'Book unique accommodations for memorable short stays across Algeria.',
    
    // Property Types
    apartment: "Apartment",
    villa: "Villa",
    house: "House",
    studio: "Studio",
    penthouse: "Penthouse",
    duplex: "Duplex",
    traditional: "Traditional House",
    
    // Property Categories
    forSale: "For Sale",
    forRent: "For Rent",
    shortStayRental: "Short Stay Rental",
    
    // Property Details
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    area: "Area",
    areaUnit: 'm²',
    price: "Price",
    perMonth: "per month",
    perNight: "per night",
    perDay: '/day',
    perWeek: '/week',
    day: 'day',
    week: 'week',
    month: 'month',
    viewDetails: "View Details",
    bookNow: "Book Now",
    scheduleVisit: "Schedule Visit",
    contactOwner: "Contact Owner",
    
    // Features & Amenities
    features: "Features",
    amenities: "Amenities",
    parking: "Parking",
    wifi: "Wi-Fi",
    airConditioning: "Air Conditioning",
    heating: "Heating",
    balcony: "Balcony",
    garden: "Garden",
    pool: "Pool",
    gym: "Gym",
    elevator: "Elevator",
    security: "24/7 Security",
    furnished: "Furnished",
    petsAllowed: "Pets Allowed",
    privatePool: "Private pool",
    landscapedGarden: "Landscaped garden",
    garage2Cars: "2-car garage",
    alarmSystem: "Alarm system",
    equippedKitchen: "Equipped kitchen",
    
    // Cities
    algiers: "Algiers",
    oran: "Oran",
    constantine: "Constantine",
    annaba: "Annaba",
    blida: "Blida",
    setif: "Setif",
    tlemcen: "Tlemcen",
    bejaia: "Bejaia",
    
    // City Descriptions
    algiersDescription: "The capital and largest city of Algeria, a unique blend of modern architecture and historic charm",
    oranDescription: "The pearl of the Mediterranean, known for its beautiful beaches and vibrant cultural scene",
    constantineDescription: "The city of bridges, perched on rocky plateaus with a rich history",
    annabaDescription: "A dynamic coastal city offering stunning beaches and a thriving industry",
    
    // City Histories
    algiersHistory: "Algiers, the capital of Algeria, is a thousand-year-old city whose history dates back to Phoenician times. Founded around 944, the city has been successively Berber, Roman, Arab, and Ottoman. The Casbah of Algiers, a UNESCO World Heritage Site, bears witness to this rich past with its narrow streets and white houses. During the French colonial period, Algiers underwent major urban transformation with the construction of Haussmann-style boulevards. Today, Algiers is a modern metropolis that preserves its historical heritage while looking toward the future.",
    
    oranHistory: "Oran, Algeria's second-largest city, was founded in 903 by Andalusian merchants. Its history is marked by multiple influences: Berber, Arab, Spanish, Ottoman, and French. The Fort of Santa Cruz, perched on the heights, recalls the period of Spanish domination (1509-1792). The city is also famous for being the birthplace of raï, a globally recognized Algerian musical genre. Oran is now an important Mediterranean port and a major cultural center.",
    
    constantineHistory: "Constantine, one of the oldest cities in the world, was once known as Cirta, capital of the Numidian kingdom. Perched at 600 meters altitude on limestone rock, it is famous for its spectacular bridges spanning the Rhumel gorges. Rebuilt by Roman Emperor Constantine I in the 4th century, it has borne his name ever since. The city played a crucial role in North African history and retains numerous historical monuments.",
    
    annabaHistory: "Annaba, formerly Hippo, was an important Roman city where Saint Augustine was bishop in the 5th century. The city preserves significant Roman remains, notably the ruins of Hippo. During the Ottoman era, it became a major commercial port. Today, Annaba is a dynamic industrial city while preserving its rich historical heritage and magnificent Mediterranean beaches.",
    
    // Footer
    footerAbout: "About Holibayt",
    footerDescription: "Your trusted platform for finding the perfect property in Algeria",
    quickLinks: "Quick Links",
    support: "Support",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    followUs: "Follow Us",
    
    // Filters
    filters: "Filters",
    priceRange: "Price Range",
    propertyType: "Property Type",
    location: "Location",
    applyFilters: "Apply Filters",
    clearFilters: "Clear Filters",
    sortBy: "Sort By",
    newest: "Newest",
    priceLowToHigh: "Price: Low to High",
    priceHighToLow: "Price: High to Low",
    
    // Booking
    checkIn: "Check In",
    checkOut: "Check Out",
    guests: "Guests",
    guest: 'guest',
    adults: 'Adults',
    children: 'Children',
    infants: 'Infants',
    pets: 'Pets',
    ages13OrAbove: '13 years or above',
    ages2to12: '2 to 12 years',
    under2: 'Under 2',
    bringingServiceAnimal: 'Bringing a service animal?',
    who: 'Who',
    addGuests: 'Add guests',
    totalPrice: "Total Price",
    bookingFee: "Booking Fee",
    securityDeposit: "Security Deposit",
    confirmBooking: "Confirm Booking",
    
    // Reviews
    reviews: "Reviews",
    rating: "Rating",
    cleanliness: "Cleanliness",
    accuracy: "Accuracy",
    checkInExperience: "Check-in Experience",
    communication: "Communication",
    locationRating: "Location",
    value: "Value for Money",
    writeReview: "Write a Review",
    
    // Blog
    latestInsights: "Latest Insights",
    readMore: "Read More",
    seeAll: "See All",
    categories: "Categories",
    allCategories: "All Categories",
    realEstate: "Real Estate",
    investing: "Investing",
    renovation: "Renovation",
    legal: "Legal",
    
    // Blog Interactions
    shareThisArticle: "Share this article",
    comments: "Comments",
    writeComment: "Write a comment...",
    postComment: "Post Comment",
    reply: "Reply",
    linkCopied: "Link copied to clipboard!",
    leaveComment: "Leave a comment",
    readTime: "min read",
    author: "Author",
    publishedOn: "Published on",
    relatedArticles: "Related Articles",
    backToBlog: "Back to Blog",
    
    // Newsletter
    newsletterTitle: "Stay Informed",
    newsletterDescription: "Subscribe to our newsletter to receive the latest real estate news",
    emailPlaceholder: "Your email address",
    subscribe: "Subscribe",
    
    // Contact
    contactUs: "Contact Us",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    sendMessage: "Send Message",
    
    // About
    aboutTitle: "About Holibayt",
    aboutDescription: "Holibayt is Algeria's leading real estate platform, connecting buyers, renters, and property owners since 2024.",
    ourMission: "Our Mission",
    ourVision: "Our Vision",
    
    // Error Messages
    errorLoading: "Error loading",
    noResults: "No results found",
    tryAgain: "Try Again",
    noPropertiesFound: 'No properties found',
    
    // Success Messages
    bookingConfirmed: "Booking confirmed!",
    messageSent: "Message sent successfully!",
    profileUpdated: "Profile updated!",
    
    // Dashboard
    dashboard: "Dashboard",
    myProperties: "My Properties",
    myBookings: "My Bookings",
    myMessages: "My Messages",
    settings: "Settings",
    
    // Property Management
    addProperty: "Add Property",
    editProperty: "Edit Property",
    deleteProperty: "Delete Property",
    propertyStatus: "Property Status",
    active: "Active",
    pending: "Pending",
    inactive: "Inactive",
    
    // Admin
    adminPanel: "Admin Panel",
    users: "Users",
    properties: "Properties",
    bookingsAdmin: "Bookings",
    reports: "Reports",
    
    // Trending Areas
    trendingAreas: "Trending Areas",
    exploreArea: "Explore Area",
    propertiesAvailable: "properties available",
    
    // Common
    search: 'Search',
    cancel: 'Cancel',
    save: 'Save',
    clear: 'Clear',
    from: 'From',
    to: 'To',
    selectDate: 'Select date',
    selectDates: 'Select dates',
    browseAllProperties: 'Browse all properties',
    start: 'Start',
    myProfile: 'My profile',
    myWishlist: 'My wishlist',
    wishlistEmpty: 'Your wishlist is empty',
    startBrowsing: 'Start browsing properties and add your favorites',
    browseProperties: 'Browse properties',
    loginToViewWishlist: 'Please login to view your wishlist',
    buyProperty: 'Buy property',
    rentProperty: 'Rent property',
    shortStayProperty: 'Short stay',
    heroTitle: 'Holibayt',
    heroSubtitle: 'Buy. Rent. Live Algeria differently.',
    heroDescription: 'The first next-generation digital real estate platform for Algeria.',
  },
  AR: {
    // Navigation
    home: "الرئيسية",
    buy: "شراء",
    rent: "إيجار",
    shortStay: "إقامة قصيرة",
    blog: "المدونة",
    cities: "المدن",
    about: "من نحن",
    contact: "اتصل بنا",
    login: "تسجيل الدخول",
    profile: "الملف الشخصي",
    messages: "الرسائل",
    bookings: "الحجوزات",
    wishlist: "المفضلة",
    logout: "تسجيل الخروج",
    publishProperty: "نشر عقار",
    
    // Hero Section
    heroTitle: "اعثر على عقارك المثالي في الجزائر",
    heroSubtitle: "اكتشف منازل وشقق وفلل استثنائية في جميع أنحاء البلاد",
    searchPlaceholder: "ابحث حسب المدينة أو الحي أو العنوان...",
    searchButton: "بحث",
    findDreamProperty: 'اعثر على عقار أحلامك',
    buyHeroDescription: 'اكتشف عقارات استثنائية للبيع في جميع أنحاء الجزائر مع إرشادات الخبراء.',
    findPerfectRental: 'اعثر على إيجارك المثالي',
    rentHeroDescription: 'اكتشف عقارات إيجار عالية الجودة تتناسب مع نمط حياتك وميزانيتك.',
    findPerfectStay: 'اعثر على إقامتك المثالية',
    shortStayHeroDescription: 'احجز أماكن إقامة فريدة لإقامات قصيرة لا تُنسى في جميع أنحاء الجزائر.',
    
    // Property Types
    apartment: "شقة",
    villa: "فيلا",
    house: "منزل",
    studio: "استوديو",
    penthouse: "بنتهاوس",
    duplex: "دوبلكس",
    traditional: "منزل تقليدي",
    
    // Property Categories
    forSale: "للبيع",
    forRent: "للإيجار",
    shortStayRental: "إيجار قصير الأجل",
    
    // Property Details
    bedrooms: "غرف النوم",
    bathrooms: "الحمامات",
    area: "المساحة",
    areaUnit: 'م²',
    price: "السعر",
    perMonth: "شهرياً",
    perNight: "لليلة",
    perDay: '/يوم',
    perWeek: '/أسبوع',
    day: 'يوم',
    week: 'أسبوع',
    month: 'شهر',
    viewDetails: "عرض التفاصيل",
    bookNow: "احجز الآن",
    scheduleVisit: "جدولة زيارة",
    contactOwner: "اتصل بالمالك",
    
    // Features & Amenities
    features: "المميزات",
    amenities: "وسائل الراحة",
    parking: "موقف سيارات",
    wifi: "واي فاي",
    airConditioning: "تكييف",
    heating: "تدفئة",
    balcony: "شرفة",
    garden: "حديقة",
    pool: "مسبح",
    gym: "صالة رياضية",
    elevator: "مصعد",
    security: "حراسة 24/7",
    furnished: "مفروش",
    petsAllowed: "يسمح بالحيوانات الأليفة",
    privatePool: "مسبح خاص",
    landscapedGarden: "حديقة منسقة",
    garage2Cars: "مرآب لسيارتين",
    alarmSystem: "نظام إنذار",
    equippedKitchen: "مطبخ مجهز",
    
    // Cities
    algiers: "الجزائر",
    oran: "وهران",
    constantine: "قسنطينة",
    annaba: "عنابة",
    blida: "البليدة",
    setif: "سطيف",
    tlemcen: "تلمسان",
    bejaia: "بجاية",
    
    // City Descriptions
    algiersDescription: "العاصمة وأكبر مدينة في الجزائر، مزيج فريد من العمارة الحديثة والسحر التاريخي",
    oranDescription: "لؤلؤة البحر الأبيض المتوسط، معروفة بشواطئها الجميلة ومشهدها الثقافي النابض بالحياة",
    constantineDescription: "مدينة الجسور، جاثمة على الهضاب الصخرية بتاريخ غني",
    annabaDescription: "مدينة ساحلية ديناميكية تقدم شواطئ مذهلة وصناعة مزدهرة",
    
    // City Histories
    algiersHistory: "الجزائر، عاصمة الجزائر، مدينة عمرها ألف عام يعود تاريخها إلى العصر الفينيقي. تأسست حوالي عام 944، وكانت المدينة على التوالي بربرية ورومانية وعربية وعثمانية. قصبة الجزائر، المدرجة في قائمة التراث العالمي لليونسكو، تشهد على هذا الماضي الغني بشوارعها الضيقة ومنازلها البيضاء. خلال الفترة الاستعمارية الفرنسية، شهدت الجزائر تحولاً حضرياً كبيراً مع بناء الجادات على طراز هوسمان. اليوم، الجزائر مدينة حديثة تحافظ على تراثها التاريخي بينما تتطلع نحو المستقبل.",
    
    oranHistory: "وهران، ثاني أكبر مدينة في الجزائر، تأسست عام 903 من قبل التجار الأندلسيين. يتميز تاريخها بتأثيرات متعددة: بربرية وعربية وإسبانية وعثمانية وفرنسية. يذكّر حصن سانتا كروز، الواقع على المرتفعات، بفترة الهيمنة الإسبانية (1509-1792). المدينة مشهورة أيضاً بكونها مسقط رأس الراي، النوع الموسيقي الجزائري المعترف به عالمياً. وهران الآن ميناء مهم على البحر الأبيض المتوسط ​​ومركز ثقافي رئيسي.",
    
    constantineHistory: "قسنطينة، واحدة من أقدم المدن في العالم، كانت تُعرف سابقاً باسم سيرتا، عاصمة المملكة النوميدية. جاثمة على ارتفاع 600 متر على صخرة كلسية، تشتهر بجسورها المذهلة التي تمتد على مضايق الرمال. أعاد بناؤها الإمبراطور الروماني قسطنطين الأول في القرن الرابع، وحملت اسمه منذ ذلك الحين. لعبت المدينة دوراً حاسماً في تاريخ شمال إفريقيا وتحتفظ بالعديد من المعالم التاريخية.",
    
    annabaHistory: "عنابة، المعروفة سابقاً باسم هيبو، كانت مدينة رومانية مهمة حيث كان القديس أوغسطين أسقفاً في القرن الخامس. تحافظ المدينة على بقايا رومانية مهمة، لا سيما أنقاض هيبو. خلال العصر العثماني، أصبحت ميناء تجارياً رئيسياً. اليوم، عنابة مدينة صناعية ديناميكية مع الحفاظ على تراثها التاريخي الغني وشواطئها المتوسطية الرائعة.",
    
    // Footer
    footerAbout: "عن هوليبايت",
    footerDescription: "منصتك الموثوقة للعثور على العقار المثالي في الجزائر",
    quickLinks: "روابط سريعة",
    support: "الدعم",
    legal: "قانوني",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    followUs: "تابعنا",
    
    // Filters
    filters: "التصفية",
    priceRange: "نطاق السعر",
    propertyType: "نوع العقار",
    location: "الموقع",
    applyFilters: "تطبيق التصفية",
    clearFilters: "مسح التصفية",
    sortBy: "ترتيب حسب",
    newest: "الأحدث",
    priceLowToHigh: "السعر: من الأقل للأعلى",
    priceHighToLow: "السعر: من الأعلى للأقل",
    
    // Booking
    checkIn: "تسجيل الوصول",
    checkOut: "تسجيل المغادرة",
    guests: "الضيوف",
    guest: 'ضيف',
    adults: 'البالغون',
    children: 'الأطفال',
    infants: 'الرضع',
    pets: 'الحيوانات الأليفة',
    ages13OrAbove: '13 سنة أو أكثر',
    ages2to12: '2 إلى 12 سنة',
    under2: 'أقل من سنتين',
    bringingServiceAnimal: 'هل تحضر حيواناً خدمياً؟',
    who: 'من',
    addGuests: 'إضافة ضيوف',
    totalPrice: "السعر الإجمالي",
    bookingFee: "رسوم الحجز",
    securityDeposit: "التأمين",
    confirmBooking: "تأكيد الحجز",
    
    // Reviews
    reviews: "التقييمات",
    rating: "التقييم",
    cleanliness: "النظافة",
    accuracy: "الدقة",
    checkInExperience: "تجربة تسجيل الوصول",
    communication: "التواصل",
    locationRating: "الموقع",
    value: "القيمة مقابل المال",
    writeReview: "اكتب تقييماً",
    
    // Blog
    latestInsights: "آخر الأخبار",
    readMore: "اقرأ المزيد",
    seeAll: "عرض الكل",
    categories: "الفئات",
    allCategories: "جميع الفئات",
    realEstate: "العقارات",
    investing: "الاستثمار",
    renovation: "التجديد",
    legal: "قانوني",
    
    // Blog Interactions
    shareThisArticle: "شارك هذا المقال",
    comments: "التعليقات",
    writeComment: "اكتب تعليقاً...",
    postComment: "نشر التعليق",
    reply: "رد",
    linkCopied: "تم نسخ الرابط إلى الحافظة!",
    leaveComment: "اترك تعليقاً",
    readTime: "دقيقة قراءة",
    author: "الكاتب",
    publishedOn: "نُشر في",
    relatedArticles: "مقالات ذات صلة",
    backToBlog: "العودة إلى المدونة",
    
    // Newsletter
    newsletterTitle: "ابق على اطلاع",
    newsletterDescription: "اشترك في نشرتنا الإخبارية لتلقي آخر أخبار العقارات",
    emailPlaceholder: "عنوان بريدك الإلكتروني",
    subscribe: "اشترك",
    
    // Contact
    contactUs: "اتصل بنا",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    message: "الرسالة",
    sendMessage: "إرسال الرسالة",
    
    // About
    aboutTitle: "عن هوليبايت",
    aboutDescription: "هوليبايت هي منصة العقارات الرائدة في الجزائر، تربط المشترين والمستأجرين وأصحاب العقارات منذ عام 2024.",
    ourMission: "مهمتنا",
    ourVision: "رؤيتنا",
    
    // Error Messages
    errorLoading: "خطأ في التحميل",
    noResults: "لم يتم العثور على نتائج",
    tryAgain: "حاول مرة أخرى",
    noPropertiesFound: 'لم يتم العثور على عقارات',
    
    // Success Messages
    bookingConfirmed: "تم تأكيد الحجز!",
    messageSent: "تم إرسال الرسالة بنجاح!",
    profileUpdated: "تم تحديث الملف الشخصي!",
    
    // Dashboard
    dashboard: "لوحة التحكم",
    myProperties: "عقاراتي",
    myBookings: "حجوزاتي",
    myMessages: "رسائلي",
    settings: "الإعدادات",
    
    // Property Management
    addProperty: "إضافة عقار",
    editProperty: "تعديل العقار",
    deleteProperty: "حذف العقار",
    propertyStatus: "حالة العقار",
    active: "نشط",
    pending: "قيد الانتظار",
    inactive: "غير نشط",
    
    // Admin
    adminPanel: "لوحة الإدارة",
    users: "المستخدمون",
    properties: "العقارات",
    bookingsAdmin: "الحجوزات",
    reports: "التقارير",
    
    // Trending Areas
    trendingAreas: "المناطق الرائجة",
    exploreArea: "استكشف المنطقة",
    propertiesAvailable: "عقارات متاحة",
    
    // Common
    search: 'بحث',
    cancel: 'إلغاء',
    save: 'حفظ',
    clear: 'مسح',
    from: 'من',
    to: 'إلى',
    selectDate: 'اختر تاريخاً',
    selectDates: 'اختر تواريخ',
    browseAllProperties: 'تصفح جميع العقارات',
    start: 'ابدأ',
    myProfile: 'ملفي الشخصي',
    myWishlist: 'قائمة رغباتي',
    wishlistEmpty: 'قائمة رغباتك فارغة',
    startBrowsing: 'ابدأ بتصفح العقارات وأضف مفضلاتك',
    browseProperties: 'تصفح العقارات',
    loginToViewWishlist: 'يرجى تسجيل الدخول لعرض قائمة رغباتك',
    buyProperty: 'شراء عقار',
    rentProperty: 'استئجار عقار',
    shortStayProperty: 'إقامة قصيرة',
    heroTitle: 'هوليبايت',
    heroSubtitle: 'اشترِ. استأجر. عِش الجزائر بشكل مختلف.',
    heroDescription: 'أول منصة عقارية رقمية من الجيل التالي للجزائر.',
  },
};

/* ───────────────────────────────────────────────────────────── */

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const SUPPORTED: Language[] = ['FR', 'EN', 'AR'];

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

function normalizeLang(v?: string | null): Language | null {
  if (!v) return null;
  const up = v.toUpperCase();
  return (SUPPORTED as string[]).includes(up) ? (up as Language) : null;
}

function getPath(obj: any, path: string) {
  return path.split('.').reduce((acc, k) => (acc && typeof acc === 'object' ? acc[k] : undefined), obj);
}

function detectInitialLang(): Language {
  if (isBrowser()) {
    const saved = normalizeLang(localStorage.getItem('lang'));
    if (saved) return saved;

    const urlParam = normalizeLang(new URLSearchParams(window.location.search).get('lang'));
    if (urlParam) return urlParam;

    const nav = (navigator as any)?.language || (navigator as any)?.languages?.[0];
    const guess = normalizeLang(nav?.slice(0, 2));
    if (guess) return guess;
  }
  return 'EN';
}

function applyHtmlAttributes(lang: Language) {
  if (!isBrowser()) return;
  document.documentElement.lang = lang === 'AR' ? 'ar' : lang.toLowerCase();
  document.documentElement.dir = lang === 'AR' ? 'rtl' : 'ltr';
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLang, setCurrentLangState] = useState<Language>(detectInitialLang);

  // set <html> attrs on mount
  useEffect(() => {
    applyHtmlAttributes(currentLang);
  }, []); // once

  const setCurrentLang = useCallback((lang: Language) => {
    setCurrentLangState(lang);

    if (!isBrowser()) return;
    localStorage.setItem('lang', lang);

    // Update URL param
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());

    // Update HTML attrs
    applyHtmlAttributes(lang);
  }, []);

  const t = useCallback((key: string): string | any => {
    const obj = allTranslations[currentLang] || {};
    const val = getPath(obj, key);
    return val !== undefined ? val : key;
  }, [currentLang]);

  const value = useMemo<LanguageContextType>(
    () => ({ currentLang, setCurrentLang, t }),
    [currentLang, setCurrentLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
