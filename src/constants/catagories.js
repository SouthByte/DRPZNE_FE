const catagories = [{
    "id": 1,
    "name": "Gear",
    "slug": "gear",
    "subcategories": [
      { "id": 1, "name": "Everyday Carry (EDC)", "slug": "edc" },
      { "id": 2, "name": "Tools", "slug": "tools" },
      { "id": 3, "name": "Tactical Gear", "slug": "tactical-gear" },
      { "id": 4, "name": "Knives & Blades", "slug": "knives-blades" },
      { "id": 5, "name": "Watches", "slug": "watches" },
      { "id": 6, "name": "Backpacks & Bags", "slug": "backpacks-bags" },
      { "id": 7, "name": "Wallets", "slug": "wallets" },
      { "id": 8, "name": "Flashlights", "slug": "flashlights" },
      { "id": 9, "name": "Workwear Accessories", "slug": "workwear-accessories" },
      { "id": 10, "name": "Outdoor Gear", "slug": "outdoor-gear" },
      { "id": 11, "name": "First Aid / Survival Kits", "slug": "first-aid-survival-kits" }
    ]
  },
  {
    "id": 2,
    "name": "Style",
    "slug": "style",
    "subcategories": [
      { "id": 12, "name": "Clothing", "slug": "clothing" },
      { "id": 13, "name": "Footwear", "slug": "footwear" },
      { "id": 14, "name": "Outerwear", "slug": "outerwear" },
      { "id": 15, "name": "Hats & Accessories", "slug": "hats-accessories" },
      { "id": 16, "name": "Sunglasses", "slug": "sunglasses" },
      { "id": 17, "name": "Grooming", "slug": "grooming" },
      { "id": 18, "name": "Apparel Brands", "slug": "apparel-brands" },
      { "id": 19, "name": "Tactical Fashion", "slug": "tactical-fashion" }
    ]
  },
  {
    "id": 3,
    "name": "Fitness",
    "slug": "fitness",
    "subcategories": [
      { "id": 20, "name": "Supplements", "slug": "supplements" },
      { "id": 21, "name": "Workout Gear", "slug": "workout-gear" },
      { "id": 22, "name": "Home Gym Equipment", "slug": "home-gym-equipment" },
      { "id": 23, "name": "Recovery Tools", "slug": "recovery-tools" },
      { "id": 24, "name": "Running", "slug": "running" },
      { "id": 25, "name": "CrossFit / Functional", "slug": "crossfit-functional" },
      { "id": 26, "name": "Martial Arts", "slug": "martial-arts" },
      { "id": 27, "name": "Apparel (shorts, shirts, etc.)", "slug": "fitness-apparel" }
    ]
  },
  {
    "id": 4,
    "name": "Vehicles",
    "slug": "vehicles",
    "subcategories": [
      { "id": 28, "name": "Cars", "slug": "cars" },
      { "id": 29, "name": "Trucks", "slug": "trucks" },
      { "id": 30, "name": "SUVs", "slug": "suvs" },
      { "id": 31, "name": "Motorcycles", "slug": "motorcycles" },
      { "id": 32, "name": "Off-Road / Overland", "slug": "off-road-overland" },
      { "id": 33, "name": "ATVs / UTVs", "slug": "atvs-utvs" },
      { "id": 34, "name": "Boats", "slug": "boats" },
      { "id": 35, "name": "Planes / Drones", "slug": "planes-drones" },
      { "id": 36, "name": "EVs", "slug": "evs" },
      { "id": 37, "name": "Mods & Parts", "slug": "mods-parts" }
    ]
  },
  {
    "id": 5,
    "name": "Property",
    "slug": "property",
    "subcategories": [
      { "id": 38, "name": "Cabins", "slug": "cabins" },
      { "id": 39, "name": "Land", "slug": "land" },
      { "id": 40, "name": "Tiny Homes", "slug": "tiny-homes" },
      { "id": 41, "name": "Luxury Homes", "slug": "luxury-homes" },
      { "id": 42, "name": "Ranches / Farms", "slug": "ranches-farms" },
      { "id": 43, "name": "Rentals", "slug": "rentals" },
      { "id": 44, "name": "Investment Properties", "slug": "investment-properties" },
      { "id": 45, "name": "Bunkers / Preppers", "slug": "bunkers-preppers" },
      { "id": 46, "name": "Commercial Spots", "slug": "commercial-spots" }
    ]
  },
  {
    "id": 6,
    "name": "Tech",
    "slug": "tech",
    "subcategories": [
      { "id": 47, "name": "Computers", "slug": "computers" },
      { "id": 48, "name": "Phones", "slug": "phones" },
      { "id": 49, "name": "Smart Home", "slug": "smart-home" },
      { "id": 50, "name": "Audio", "slug": "audio" },
      { "id": 51, "name": "Cameras", "slug": "cameras" },
      { "id": 52, "name": "Military Tech", "slug": "military-tech" },
      { "id": 53, "name": "Drones", "slug": "drones" },
      { "id": 54, "name": "Gaming", "slug": "gaming" },
      { "id": 55, "name": "Software Tools", "slug": "software-tools" }
    ]
  },
  {
    "id": 7,
    "name": "Vices",
    "slug": "vices",
    "subcategories": [
      { "id": 56, "name": "Whiskey", "slug": "whiskey" },
      { "id": 57, "name": "Bourbon", "slug": "bourbon" },
      { "id": 58, "name": "Beer", "slug": "beer" },
      { "id": 59, "name": "Cocktails", "slug": "cocktails" },
      { "id": 60, "name": "Bar Tools", "slug": "bar-tools" },
      { "id": 61, "name": "Cigars", "slug": "cigars" },
      { "id": 62, "name": "Pipes", "slug": "pipes" },
      { "id": 63, "name": "Humidors", "slug": "humidors" },
      { "id": 64, "name": "Cannabis Accessories", "slug": "cannabis-accessories" },
      { "id": 65, "name": "THC/CBD Products", "slug": "thc-cbd-products" }
    ]
  },
  {
    "id": 8,
    "name": "Outdoors",
    "slug": "outdoors",
    "subcategories": [
      { "id": 66, "name": "Camping", "slug": "camping" },
      { "id": 67, "name": "Hiking", "slug": "hiking" },
      { "id": 68, "name": "Fishing", "slug": "fishing" },
      { "id": 69, "name": "Hunting", "slug": "hunting" },
      { "id": 70, "name": "Survival", "slug": "survival" },
      { "id": 71, "name": "Overlanding", "slug": "overlanding" },
      { "id": 72, "name": "Water Sports", "slug": "water-sports" },
      { "id": 73, "name": "Winter Sports", "slug": "winter-sports" }
    ]
  },
  {
    "id": 9,
    "name": "Home",
    "slug": "home",
    "subcategories": [
      { "id": 74, "name": "Kitchen Gear", "slug": "kitchen-gear" },
      { "id": 75, "name": "Furniture", "slug": "furniture" },
      { "id": 76, "name": "Workspace", "slug": "workspace" },
      { "id": 77, "name": "Workshop Tools", "slug": "workshop-tools" },
      { "id": 78, "name": "Lighting", "slug": "lighting" },
      { "id": 79, "name": "Art & Decor", "slug": "art-decor" },
      { "id": 80, "name": "Home Goods", "slug": "home-goods" }
    ]
  },
  {
    "id": 10,
    "name": "Drops",
    "slug": "drops",
    "subcategories": [
      { "id": 81, "name": "Gear Drops", "slug": "gear-drops" },
      { "id": 82, "name": "Limited Editions", "slug": "limited-editions" },
      { "id": 83, "name": "Collabs", "slug": "collabs" },
      { "id": 84, "name": "Flash Sales", "slug": "flash-sales" },
      { "id": 85, "name": "Preorders", "slug": "preorders" },
      { "id": 86, "name": "Seasonal Drops", "slug": "seasonal-drops" }
    ]
  }];


  const CATEGORY_TREE = {
  1: {
    id: 1,
    name: "Gear",
    subcategories: [
      "Everyday Carry (EDC)",
      "Tools",
      "Tactical Gear",
      "Knives & Blades",
      "Watches",
      "Backpacks & Bags",
      "Wallets",
      "Flashlights",
      "Workwear Accessories",
      "Outdoor Gear",
      "First Aid / Survival Kits"
    ]
  },
  2: {
    id: 2,
    name: "Style",
    subcategories: [
      "Clothing",
      "Footwear",
      "Outerwear",
      "Hats & Accessories",
      "Sunglasses",
      "Grooming",
      "Apparel Brands",
      "Tactical Fashion"
    ]
  },
  3: {
    id: 3,
    name: "Fitness",
    subcategories: [
      "Supplements",
      "Workout Gear",
      "Home Gym Equipment",
      "Recovery Tools",
      "Running",
      "CrossFit / Functional",
      "Martial Arts",
      "Apparel (shorts, shirts, etc.)"
    ]
  },
  4: {
    id: 4,
    name: "Vehicles",
    subcategories: [
      "Cars",
      "Trucks",
      "SUVs",
      "Motorcycles",
      "Off-Road / Overland",
      "ATVs / UTVs",
      "Boats",
      "Planes / Drones",
      "EVs",
      "Mods & Parts"
    ]
  },
  5: {
    id: 5,
    name: "Property",
    subcategories: [
      "Cabins",
      "Land",
      "Tiny Homes",
      "Luxury Homes",
      "Ranches / Farms",
      "Rentals",
      "Investment Properties",
      "Bunkers / Preppers",
      "Commercial Spots"
    ]
  },
  6: {
    id: 6,
    name: "Tech",
    subcategories: [
      "Computers",
      "Phones",
      "Smart Home",
      "Audio",
      "Cameras",
      "Military Tech",
      "Drones",
      "Gaming",
      "Software Tools"
    ]
  },
  7: {
    id: 7,
    name: "Vices",
    subcategories: [
      "Whiskey",
      "Bourbon",
      "Beer",
      "Cocktails",
      "Bar Tools",
      "Cigars",
      "Pipes",
      "Humidors",
      "Cannabis Accessories",
      "THC/CBD Products"
    ]
  },
  8: {
    id: 8,
    name: "Outdoors",
    subcategories: [
      "Camping",
      "Hiking",
      "Fishing",
      "Hunting",
      "Survival",
      "Overlanding",
      "Water Sports",
      "Winter Sports"
    ]
  },
  9: {
    id: 9,
    name: "Home",
    subcategories: [
      "Kitchen Gear",
      "Furniture",
      "Workspace",
      "Workshop Tools",
      "Lighting",
      "Art & Decor",
      "Home Goods"
    ]
  },
  10: {
    id: 10,
    name: "Drops",
    subcategories: [
      "Gear Drops",
      "Limited Editions",
      "Collabs",
      "Flash Sales",
      "Preorders",
      "Seasonal Drops"
    ]
  }
};

