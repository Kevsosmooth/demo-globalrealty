/* ============================================
   LISTINGS DATA - Shared fallback data and config
   Used by both listings.html and listing.html
   ============================================ */

var LISTINGS_CONFIG = {
  API_URL: 'http://localhost:8071/api/public/listings',

  PLACEHOLDER_IMAGES: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
    'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=600&q=80'
  ]
};

var FALLBACK_DATA = [
  {
    id: "prop-1",
    address: "3612 Bronx Blvd, Bronx",
    borough: "Bronx",
    property_type: "Apartment 5+",
    description: "A well-maintained pre-war apartment building in the heart of the Bronx. Features an elevator, on-site laundry, and a dedicated superintendent.",
    elevator: true,
    parking: false,
    laundry_in_building: true,
    super_on_site: true,
    pet_policy: "Cats and Dogs",
    photos: [],
    amenities: [{amenity_name: "Doorman", category: "Building"}, {amenity_name: "Gym", category: "Building"}, {amenity_name: "Package Room", category: "Building"}],
    units: [
      {id:"u1",unit_name:"2A",bedrooms:1,bathrooms:1,square_feet:650,rent_amount:2300,status:"Vacant",pet_friendly:true,renovated:false,photos:[],amenities:[{amenity_name:"Hardwood Floors",category:"Interior"}],description:"Cozy one-bedroom with natural light.",date_available:"2026-05-01"},
      {id:"u2",unit_name:"3A",bedrooms:2,bathrooms:1,square_feet:900,rent_amount:2997,status:"Vacant",pet_friendly:true,laundry_in_unit:true,photos:[],amenities:[{amenity_name:"Dishwasher",category:"Kitchen"},{amenity_name:"Washer/Dryer In-Unit",category:"Laundry"}],description:"Spacious two-bedroom corner unit with city views.",date_available:"2026-04-15"},
      {id:"u3",unit_name:"4B",bedrooms:2,bathrooms:1,square_feet:875,rent_amount:2850,status:"Vacant",renovated:true,photos:[],amenities:[{amenity_name:"Granite Countertops",category:"Kitchen"}],description:"Renovated two-bedroom. Rent-stabilized.",date_available:"2026-04-01"},
      {id:"u4",unit_name:"5A",bedrooms:3,bathrooms:2,square_feet:1200,rent_amount:4300,status:"Vacant",pet_friendly:true,laundry_in_unit:true,renovated:true,photos:[],amenities:[{amenity_name:"Central AC",category:"Climate"},{amenity_name:"Balcony",category:"Outdoor"},{amenity_name:"Walk-in Closet",category:"Interior"}],description:"Premium penthouse. Three beds, two baths, in-unit laundry.",date_available:"2026-04-01"}
    ],
    price_range: "$2,300 - $4,300",
    bed_range: "1 Bed - 3 Bed",
    available_count: 4
  },
  {
    id: "prop-2",
    address: "799 E 161st Street, Bronx",
    borough: "Bronx",
    property_type: "Two Family",
    description: "Charming two-family walkup near Yankee Stadium. Renovated units with modern finishes.",
    elevator: false,
    parking: true,
    laundry_in_building: false,
    pet_policy: "Cats Only",
    photos: [],
    amenities: [{amenity_name: "Driveway", category: "Parking"}, {amenity_name: "Backyard", category: "Outdoor"}],
    units: [
      {id:"u5",unit_name:"1F",bedrooms:1,bathrooms:1,square_feet:700,rent_amount:2150,status:"Vacant",renovated:true,photos:[],amenities:[{amenity_name:"Granite Countertops",category:"Kitchen"}],description:"Ground floor one-bedroom with private entrance.",date_available:"2026-04-15"},
      {id:"u6",unit_name:"2F",bedrooms:2,bathrooms:1,square_feet:850,rent_amount:2750,status:"Vacant",renovated:true,photos:[],amenities:[{amenity_name:"Hardwood Floors",category:"Interior"},{amenity_name:"Balcony",category:"Outdoor"}],description:"Second floor two-bedroom with balcony.",date_available:"2026-05-01"}
    ],
    price_range: "$2,150 - $2,750",
    bed_range: "1 Bed - 2 Bed",
    available_count: 2
  },
  {
    id: "prop-3",
    address: "2311 Grand Avenue, Bronx",
    borough: "Bronx",
    property_type: "Single Family",
    description: "Modern studio apartment in a quiet residential area.",
    elevator: false,
    parking: false,
    photos: [],
    amenities: [],
    units: [
      {id:"u7",unit_name:"Studio",bedrooms:0,bathrooms:1,square_feet:450,rent_amount:2604,status:"Vacant",photos:[],amenities:[],description:"Spacious studio with updated kitchen.",date_available:"2026-04-01"}
    ],
    price_range: "$2,604",
    bed_range: "Studio",
    available_count: 1
  },
  {
    id: "prop-4",
    address: "3020 Valentine Ave, Bronx",
    borough: "Bronx",
    property_type: "Apartment 5+",
    description: "Well-maintained apartment building on Valentine Avenue.",
    elevator: true,
    parking: false,
    laundry_in_building: true,
    photos: [],
    amenities: [{amenity_name: "Laundry In-Building", category: "Laundry"}],
    units: [
      {id:"u8",unit_name:"2B",bedrooms:2,bathrooms:1,square_feet:850,rent_amount:2997,status:"Vacant",photos:[],amenities:[],description:"Two-bedroom with open layout.",date_available:"2026-04-15"}
    ],
    price_range: "$2,997",
    bed_range: "2 Bed",
    available_count: 1
  },
  {
    id: "prop-5",
    address: "1845 Sedgwick Ave, Bronx",
    borough: "Bronx",
    property_type: "Apartment 5+",
    description: "Comfortable living near parks and transit.",
    elevator: false,
    parking: false,
    photos: [],
    amenities: [],
    units: [
      {id:"u9",unit_name:"1A",bedrooms:1,bathrooms:1,square_feet:600,rent_amount:2150,status:"Vacant",photos:[],amenities:[{amenity_name:"Hardwood Floors",category:"Interior"}],description:"One-bedroom with hardwood floors.",date_available:"2026-05-01"}
    ],
    price_range: "$2,150",
    bed_range: "1 Bed",
    available_count: 1
  },
  {
    id: "prop-6",
    address: "450 E 149th St, Bronx",
    borough: "Bronx",
    property_type: "Apartment 5+",
    description: "Large apartments near the Hub shopping district.",
    elevator: true,
    parking: false,
    laundry_in_building: true,
    photos: [],
    amenities: [{amenity_name: "Storage", category: "Building"}],
    units: [
      {id:"u10",unit_name:"3C",bedrooms:3,bathrooms:2,square_feet:1100,rent_amount:3200,status:"Vacant",photos:[],amenities:[],description:"Three-bedroom near transit.",date_available:"2026-04-01"}
    ],
    price_range: "$3,200",
    bed_range: "3 Bed",
    available_count: 1
  },
  {
    id: "prop-rented-1",
    address: "1920 Jerome Ave, Bronx",
    borough: "Bronx",
    property_type: "Apartment 5+",
    description: "",
    photos: [],
    amenities: [],
    units: [
      {id:"ur1",unit_name:"4A",bedrooms:1,bathrooms:1,square_feet:650,rent_amount:2350,status:"Occupied",photos:[],amenities:[]}
    ],
    price_range: "$2,350",
    bed_range: "1 Bed",
    available_count: 0
  },
  {
    id: "prop-rented-2",
    address: "785 E Tremont Ave, Bronx",
    borough: "Bronx",
    property_type: "Apartment 5+",
    description: "",
    photos: [],
    amenities: [],
    units: [
      {id:"ur2",unit_name:"2A",bedrooms:2,bathrooms:1,square_feet:800,rent_amount:3100,status:"Occupied",photos:[],amenities:[]}
    ],
    price_range: "$3,100",
    bed_range: "2 Bed",
    available_count: 0
  },
  {
    id: "prop-rented-3",
    address: "2140 Morris Ave, Bronx",
    borough: "Bronx",
    property_type: "Single Family",
    description: "",
    photos: [],
    amenities: [],
    units: [
      {id:"ur3",unit_name:"Studio",bedrooms:0,bathrooms:1,square_feet:500,rent_amount:1950,status:"Occupied",photos:[],amenities:[]}
    ],
    price_range: "$1,950",
    bed_range: "Studio",
    available_count: 0
  }
];
