import propertyLuxury from "@/assets/property-luxury-apartment.jpg";
import propertyModern from "@/assets/property-modern-apartment.jpg";
import villaMediterranean from "@/assets/property-villa-mediterranean.jpg";
import traditionalHouse from "@/assets/property-traditional-house.jpg";
import shortStay from "@/assets/property-short-stay.jpg";
import modernApartment from "@/assets/property-modern-apartment.jpg";

// Mock property data for demo purposes when database is not available
export const mockProperties: Record<string, any> = {
  "1": {
    id: "1",
    title: "Luxury Apartment in Alger Centre",
    location: "Alger Centre",
    city: "Alger",
    district: "Centre",
    full_address: "Rue Didouche Mourad, Alger Centre",
    price: "45000000",
    price_type: "sale",
    category: "sale",
    bedrooms: "3",
    bathrooms: "2",
    area: "120 m²",
    images: [propertyLuxury, propertyLuxury, propertyLuxury],
    property_type: "apartment",
    description: "Beautiful luxury apartment in the heart of Alger Centre. This stunning property features modern finishes, spacious rooms, and excellent natural lighting. Located in a prime location with easy access to shops, restaurants, and public transportation. The apartment includes a modern kitchen, elegant bathrooms, and a comfortable living area. Perfect for families or professionals looking for quality living in the capital.",
    features: {
      parking: true,
      elevator: true,
      balcony: true,
      security: true,
      heating: true,
      air_conditioning: true
    },
    contact_name: "Ahmed Benali",
    contact_phone: "+213 555 123 456",
    contact_email: "ahmed.benali@example.com",
    created_at: new Date().toISOString(),
    user_id: "mock-user-1",
    status: 'active'
  },
  "2": {
    id: "2",
    title: "Modern Penthouse in Oran",
    location: "Oran",
    city: "Oran",
    district: "Centre-Ville",
    full_address: "Boulevard de la Soummam, Oran",
    price: "65000000",
    price_type: "sale",
    category: "sale",
    bedrooms: "4",
    bathrooms: "3",
    area: "180 m²",
    images: [propertyModern, propertyModern, propertyModern],
    property_type: "penthouse",
    description: "Exclusive modern penthouse with breathtaking views of Oran. This luxurious property offers premium finishes, spacious living areas, and a private terrace. Features include a gourmet kitchen, master suite with ensuite bathroom, and floor-to-ceiling windows. Located in a prestigious building with concierge service, gym, and pool. Ideal for those seeking the ultimate in urban living.",
    features: {
      parking: true,
      elevator: true,
      balcony: true,
      terrace: true,
      security: true,
      heating: true,
      air_conditioning: true,
      pool: true,
      gym: true
    },
    contact_name: "Karim Mansouri",
    contact_phone: "+213 555 987 654",
    contact_email: "karim.mansouri@example.com",
    created_at: new Date().toISOString(),
    user_id: "mock-user-2"
  },
  "3": {
    id: "3",
    title: "Charming Studio in Constantine",
    location: "Constantine",
    city: "Constantine",
    district: "Belle Vue",
    full_address: "Rue Ben Badis, Constantine",
    price: "35000",
    price_type: "monthly",
    category: "rent",
    bedrooms: "1",
    bathrooms: "1",
    area: "45 m²",
    images: [shortStay, shortStay, shortStay],
    property_type: "studio",
    description: "Cozy studio apartment perfect for students or young professionals. Fully furnished with modern amenities including WiFi, washing machine, and equipped kitchen. Located in a quiet neighborhood with easy access to university and city center. Includes all utilities and building maintenance. Available for immediate move-in.",
    features: {
      furnished: true,
      wifi: true,
      elevator: true,
      heating: true
    },
    contact_name: "Amina Larbi",
    contact_phone: "+213 555 456 789",
    contact_email: "amina.larbi@example.com",
    created_at: new Date().toISOString(),
    user_id: "mock-user-3"
  },
  "4": {
    id: "4",
    title: "Family Villa in Annaba",
    location: "Annaba",
    city: "Annaba",
    district: "Seraidi",
    full_address: "Chemin des Pins, Seraidi, Annaba",
    price: "3200000",
    price_type: "sale",
    category: "sale",
    bedrooms: "5",
    bathrooms: "3",
    area: "350 m²",
    images: [villaMediterranean, traditionalHouse, villaMediterranean],
    property_type: "villa",
    description: "Magnificent family villa with sea views in Seraidi. This spacious property features a beautiful garden, private pool, and multiple living areas. Perfect for large families seeking comfort and tranquility. The villa includes a modern kitchen, multiple bedrooms with built-in wardrobes, and elegant reception areas. Located in a secure residential area close to beaches and amenities.",
    features: {
      parking: true,
      garden: true,
      pool: true,
      security: true,
      heating: true,
      air_conditioning: true,
      sea_view: true
    },
    contact_name: "Rachid Bouaziz",
    contact_phone: "+213 555 321 654",
    contact_email: "rachid.bouaziz@example.com",
    created_at: new Date().toISOString(),
    user_id: "mock-user-4"
  },
  "5": {
    id: "5",
    title: "Seaside Suite in Oran",
    location: "Oran",
    city: "Oran",
    district: "Ain El Turck",
    full_address: "Corniche Oranaise, Ain El Turck",
    price: "12000",
    price_type: "daily",
    category: "short-stay",
    bedrooms: "2",
    bathrooms: "1",
    area: "75 m²",
    images: [shortStay, propertyLuxury, shortStay],
    property_type: "suite",
    description: "Beautiful seaside suite perfect for short stays and vacations. Fully equipped with WiFi, modern kitchen, and stunning sea views. Located right on the beach with easy access to restaurants and entertainment. Ideal for couples or small families looking for a relaxing getaway. Includes daily housekeeping and 24/7 reception service.",
    features: {
      furnished: true,
      wifi: true,
      air_conditioning: true,
      sea_view: true,
      kitchen: true,
      balcony: true
    },
    contact_name: "Yasmine Hadj",
    contact_phone: "+213 555 789 012",
    contact_email: "yasmine.hadj@example.com",
    created_at: new Date().toISOString(),
    user_id: "mock-user-5"
  },
  "6": {
    id: "6",
    title: "Panoramic Apartment in Constantine",
    location: "Constantine",
    city: "Constantine",
    district: "Sidi Rached",
    full_address: "Avenue Aouati Mostefa, Sidi Rached",
    price: "15000",
    price_type: "daily",
    category: "short-stay",
    bedrooms: "3",
    bathrooms: "2",
    area: "95 m²",
    images: [propertyModern, modernApartment, propertyModern],
    property_type: "apartment",
    description: "Stunning apartment with panoramic views of Constantine's famous bridges. Luxuriously furnished with premium amenities and exceptional service. Perfect for business travelers and tourists. Features include a fully equipped kitchen, spacious living areas, and high-speed internet. Located in a secure building with parking and elevator.",
    features: {
      furnished: true,
      wifi: true,
      parking: true,
      elevator: true,
      air_conditioning: true,
      heating: true,
      balcony: true,
      view: true
    },
    contact_name: "Omar Benkhaled",
    contact_phone: "+213 555 234 567",
    contact_email: "omar.benkhaled@example.com",
    created_at: new Date().toISOString(),
    user_id: "mock-user-6"
  },
  "7": {
    id: "7",
    title: "Traditional House in Alger",
    location: "Alger",
    city: "Alger",
    district: "Casbah",
    full_address: "Rue de la Casbah, Alger",
    price: "3200000",
    price_type: "sale",
    category: "sale",
    bedrooms: "5",
    bathrooms: "3",
    area: "350 m²",
    images: [traditionalHouse, traditionalHouse, villaMediterranean],
    property_type: "house",
    description: "Charming traditional house with authentic Algerian architecture in the historic Casbah. Features spacious rooms, internal courtyard, and traditional tilework. Recently renovated while maintaining historical character. Perfect for large families who appreciate traditional architecture. Includes modern amenities and updates throughout.",
    features: {
      courtyard: true,
      traditional: true,
      parking: true,
      heating: true,
      renovated: true
    },
    contact_name: "Farid Meziane",
    contact_phone: "+213 555 345 678",
    contact_email: "farid.meziane@example.com",
    created_at: new Date().toISOString(),
    user_id: "mock-user-7"
  },
  "8": {
    id: "8",
    title: "Modern Apartment in Oran",
    location: "Oran",
    city: "Oran",
    district: "Les Platanes",
    full_address: "Cité Les Platanes, Oran",
    price: "2100000",
    price_type: "sale",
    category: "sale",
    bedrooms: "3",
    bathrooms: "2",
    area: "140 m²",
    images: [modernApartment, propertyModern, modernApartment],
    property_type: "apartment",
    description: "Contemporary apartment with sleek design and premium finishes in Les Platanes. Features include an open-plan kitchen, spacious bedrooms, and modern bathrooms. Located in a prime residential area with easy access to schools, shops, and transportation. Building includes parking, elevator, and 24/7 security. Move-in ready with recent renovations.",
    features: {
      parking: true,
      elevator: true,
      security: true,
      balcony: true,
      modern: true,
      air_conditioning: true,
      heating: true
    },
    contact_name: "Nadia Brahim",
    contact_phone: "+213 555 456 789",
    contact_email: "nadia.brahim@example.com",
    created_at: new Date().toISOString(),
    user_id: "mock-user-8"
  }
};

export const getMockProperty = (id: string) => {
  const property = mockProperties[id];
  if (!property) return null;
  
  // Transform to match the format expected by components
  return {
    ...property,
    image: property.images[0], // Use first image
    beds: property.bedrooms,
    baths: property.bathrooms,
  };
};
