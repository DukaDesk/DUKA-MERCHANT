/* Broad industry desk categories.
   Signup / Profile / Onboarding dropdowns offer these 11.
   Legacy keys (Ecommerce, Church, Booking, ...) from earlier releases
   still resolve via CATEGORY_ALIASES so existing users keep their preset.
*/

export const DESK_CATEGORIES = [
  { key: "Business", label: "Business", icon: "🏢", desc: "Shops, retail & general trade", kycType: "Retail" },
  { key: "Corporate", label: "Corporate", icon: "🏙️", desc: "Companies, enterprises & B2B", kycType: "Corporate" },
  { key: "Legal", label: "Legal", icon: "⚖️", desc: "Law firms & legal services", kycType: "Legal" },
  { key: "Religion", label: "Religion", icon: "⛪", desc: "Churches, mosques & ministries", kycType: "Religion" },
  { key: "Education", label: "Education", icon: "🏫", desc: "Schools, training & lessons", kycType: "Education" },
  { key: "Healthcare", label: "Healthcare", icon: "🩺", desc: "Clinics, pharmacies & care", kycType: "Healthcare" },
  { key: "Food & Hospitality", label: "Food & Hospitality", icon: "🍽️", desc: "Restaurants, food vendors & groceries", kycType: "Hospitality" },
  { key: "Services", label: "Services", icon: "📅", desc: "Salons, repairs & appointments", kycType: "Service" },
  { key: "Events", label: "Events", icon: "🎪", desc: "Tickets, RSVPs & event media", kycType: "Events" },
  { key: "Nonprofit", label: "Nonprofit", icon: "🤝", desc: "NGOs, causes & campaigns", kycType: "Nonprofit" },
  { key: "Personal", label: "Personal", icon: "🌟", desc: "Portfolio, landing page & contact", kycType: "Personal" },
];

/* Back-compat alias: BUSINESS_CATEGORIES keeps its name so existing
   imports (Auth signup, Profile, Compliance) pick up the broad list. */
export const BUSINESS_CATEGORIES = DESK_CATEGORIES;

/* Commerce-only subset (product decision 2026-10-10, tightened 2026-10-21): while the
   platform faces business dashboards, only buying/selling categories are selectable
   during signup/signin onboarding and profile edits. Healthcare (clinic/pharmacy)
   joins Religion/Education/Legal and the rest on the not-selectable list; existing
   users on those categories keep their data; pickers grandfather the current value. */
export const COMMERCE_CATEGORY_KEYS = ["Business", "Food & Hospitality", "Services"];

export const COMMERCE_CATEGORIES = DESK_CATEGORIES.filter(c => COMMERCE_CATEGORY_KEYS.includes(c.key));

/* Legacy → canonical mapping for users registered before the broad
   taxonomy (e.g. Church → Religion, Booking → Services). */
export const CATEGORY_ALIASES = {
  Ecommerce: "Business",
  Retail: "Business",
  Restaurant: "Food & Hospitality",
  "Food Vendor": "Food & Hospitality",
  Grocery: "Food & Hospitality",
  Cafe: "Food & Hospitality",
  Bar: "Food & Hospitality",
  "Bar & Lounge": "Food & Hospitality",
  Church: "Religion",
  School: "Education",
  Education2: "Education",
  Tutoring: "Education",
  Training: "Education",
  Daycare: "Education",
  Booking: "Services",
  Consulting: "Corporate",
  "Law Firm": "Legal",
  Accounting: "Corporate",
  "Accounting & Tax": "Corporate",
  Finance: "Corporate",
  "Finance & Advisory": "Corporate",
  Beauty: "Services",
  "Beauty & Salon": "Services",
  Spa: "Services",
  "Spa & Wellness": "Services",
  Fitness: "Services",
  "Fitness & Gym": "Services",
  Barbershop: "Services",
  Tailor: "Services",
  "Tailor & Alterations": "Services",
  Laundry: "Services",
  Cleaning: "Services",
  "Pet Care": "Services",
  Photography: "Services",
  Videography: "Services",
  "Tech Repair": "Services",
  "Real Estate": "Services",
  Travel: "Services",
  "Travel & Tours": "Services",
  Logistics: "Services",
  "Logistics & Delivery": "Services",
  "Car Wash": "Services",
  "Auto Repair": "Services",
  Taxi: "Services",
  "Transport & Taxi": "Services",
  Construction: "Services",
  Wedding: "Events",
  "Wedding Planning": "Events",
  Entertainment: "Events",
  Creative: "Services",
  "Creative Studio": "Services",
  Pharmacy: "Healthcare",
  Clinic: "Healthcare",
  "Clinic & Healthcare": "Healthcare",
  Dental: "Healthcare",
  Optical: "Healthcare",
  Farm: "Business",
  "Farm & Produce": "Business",
  Factory: "Corporate",
  Manufacturing: "Corporate",
  Wholesale: "Business",
  "Wholesale & Supply": "Business",
  Marketplace: "Business",
  "Online Course": "Education",
  "Online Courses": "Education",
  Subscription: "Services",
  Subscriptions: "Services",
  Content: "Personal",
  "Content Creator": "Personal",
  Journalist: "Nonprofit",
  "Media & News": "Nonprofit",
  Newsletter: "Personal",
};

export function resolveCanonicalCategory(key) {
  if (!key) return null;
  if (DESK_CATEGORIES.some(c => c.key === key)) return key;
  return CATEGORY_ALIASES[key] || null;
}

export const ONBOARDING_CATEGORIES = [
  ...DESK_CATEGORIES,
  { key: "Cafe", label: "Cafe", icon: "☕", desc: "Coffee, pastries & quick bites", kycType: "Hospitality", preset: "Food & Hospitality" },
  { key: "Pharmacy", label: "Pharmacy", icon: "💊", desc: "Medicines, health & wellness products", kycType: "Healthcare", preset: "Healthcare" },
  { key: "Beauty & Salon", label: "Beauty & Salon", icon: "💇‍♀️", desc: "Hair, nails & esthetics", kycType: "Service", preset: "Services" },
  { key: "Clinic & Healthcare", label: "Clinic & Healthcare", icon: "🩺", desc: "Appointments, records & care", kycType: "Healthcare", preset: "Healthcare" },
  { key: "Law Firm", label: "Law Firm", icon: "⚖️", desc: "Legal services & retainers", kycType: "Legal", preset: "Legal" },
  { key: "Logistics & Delivery", label: "Logistics & Delivery", icon: "📦", desc: "Courier, dispatch & moving", kycType: "Service", preset: "Services" },
  { key: "Real Estate", label: "Real Estate", icon: "🏠", desc: "Sales, rentals & property", kycType: "Service", preset: "Services" },
  { key: "Training & Bootcamps", label: "Training & Bootcamps", icon: "🎓", desc: "Courses, skills & certification", kycType: "Education", preset: "Education" },
];

export const CATEGORY_KEYS = DESK_CATEGORIES.map(c => c.key);

export const ONBOARDING_COMMERCE_CATEGORIES = ONBOARDING_CATEGORIES.filter(c =>
  COMMERCE_CATEGORY_KEYS.includes(c.key) || COMMERCE_CATEGORY_KEYS.includes(c.preset)
);

export function getCategoryByKey(key) {
  return DESK_CATEGORIES.find(c => c.key === key) || null;
}
