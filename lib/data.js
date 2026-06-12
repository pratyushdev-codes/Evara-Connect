// ---------------------------------------------------------------------------
// Golden Park Residences — demo seed data
// Everything below is demo content. Live data is persisted to localStorage.
// ---------------------------------------------------------------------------

export const RESIDENT = {
  name: "Aarav Sharma",
  firstName: "Aarav",
  initials: "AS",
  flat: "B-1204",
  tower: "Tower B",
  society: "Golden Park Residences",
  phone: "+91 98985 42210",
  role: "Owner",
  since: "2021",
  dues: 95780.18,
  duesPeriod: "Apr – Jun 2026",
};

export const DUES_BREAKUP = [
  { label: "Maintenance charges", amount: 78450 },
  { label: "Sinking fund", amount: 9200 },
  { label: "Water & common power", amount: 5630.18 },
  { label: "Late payment interest", amount: 2500 },
];

export const SERVICES = [
  { id: "electrician", label: "Electrician", desc: "Switches, wiring & fixtures", eta: "45 min" },
  { id: "plumber", label: "Plumber", desc: "Leaks, taps & fittings", eta: "40 min" },
  { id: "ac", label: "AC Technician", desc: "Service, gas top-up & repair", eta: "60 min" },
  { id: "carpenter", label: "Carpenter", desc: "Furniture, hinges & locks", eta: "60 min" },
  { id: "painter", label: "Painter", desc: "Touch-ups to full walls", eta: "Site visit" },
  { id: "pest", label: "Pest Control", desc: "Cockroach, termite & more", eta: "Site visit" },
  { id: "cleaning", label: "Deep Cleaning", desc: "Kitchen, bath & sofa", eta: "2 hrs" },
  { id: "appliance", label: "Appliance Repair", desc: "Fridge, washer & chimney", eta: "50 min" },
];

export const SERVICE_SLOTS = ["8 – 10 am", "10 – 12 pm", "12 – 3 pm", "3 – 6 pm", "6 – 9 pm"];

export const TECHNICIANS = ["Ramesh K.", "Imran S.", "Vikas T.", "Suresh P.", "Manoj D."];

export const COMPLAINT_CATEGORIES = [
  "Plumbing & leakage",
  "Electrical",
  "Lift & common area",
  "Housekeeping",
  "Security",
  "Parking",
  "Noise",
  "Other",
];

export const VISITOR_TYPES = ["Guest", "Delivery", "Cab", "Staff"];

export const PASS_VALIDITY = ["2 hours", "6 hours", "All day"];

export const ANNOUNCEMENTS = [
  {
    id: "an-1",
    tag: "Festive",
    pinned: true,
    date: "Today",
    title: "Diwali celebration at the amphitheatre",
    body: "Join us on the central lawns from 6 pm — diya lighting, dandiya, a rangoli corner for kids and a community dinner by Galaxy Caffé. Dress code: festive ethnic. Green crackers only, in the marked zone.",
    likes: 214,
    comments: 48,
  },
  {
    id: "an-2",
    tag: "Notice",
    pinned: false,
    date: "Yesterday",
    title: "Water conservation drive",
    body: "Borewell levels are running low this season. Please conserve water — car-wash bays will stay closed on weekdays and garden sprinklers move to alternate days until further notice.",
    likes: 96,
    comments: 21,
  },
  {
    id: "an-3",
    tag: "Community",
    pinned: false,
    date: "Tue",
    title: "Fruit festival in the community",
    body: "Seasonal mango, jamun and litchi stalls by the Tower A plaza this weekend, 8 – 11 am. Farm-direct pricing for residents; carry your own bags.",
    likes: 132,
    comments: 17,
  },
  {
    id: "an-4",
    tag: "Maintenance",
    pinned: false,
    date: "Mon",
    title: "Tower B — Lift B-2 annual service",
    body: "Lift B-2 will be under scheduled maintenance on Friday, 2 – 4 pm. Please use Lift B-1 or the service elevator during this window.",
    likes: 41,
    comments: 9,
  },
  {
    id: "an-5",
    tag: "Clubhouse",
    pinned: false,
    date: "Sun",
    title: "Sunrise yoga returns to the deck",
    body: "Daily 6:30 am sessions at the clubhouse deck start Monday with instructor Kavita. Mats provided; first week is complimentary for all residents.",
    likes: 77,
    comments: 12,
  },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

export const ARRIVALS_SEED = [
  {
    id: "ARR-2841",
    icon: "food",
    name: "Swiggy delivery",
    detail: "Biryani Blues · Order #4821",
    gate: "Main Gate",
    since: "2 min",
  },
  {
    id: "ARR-2842",
    icon: "guest",
    name: "Rohan Mehta",
    detail: "Guest · says “college friend”",
    gate: "Main Gate",
    since: "5 min",
  },
  {
    id: "ARR-2843",
    icon: "package",
    name: "Amazon delivery",
    detail: "1 package · signature needed",
    gate: "Gate 2",
    since: "just now",
  },
];

export const PASS_SEED = [
  {
    id: "PS-SEED1",
    code: "482913",
    name: "Meera Joshi",
    type: "Guest",
    date: todayISO(),
    validity: "All day",
    note: "Sister visiting for the weekend",
    status: "Active",
    createdAt: 0,
  },
];

export const MARKET_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "dairy", label: "Dairy & Eggs" },
  { id: "fruits", label: "Fruits & Veg" },
  { id: "staples", label: "Staples" },
  { id: "bakery", label: "Bakery & Chai" },
  { id: "home", label: "Home Care" },
];

export const PRODUCTS = [
  { id: "milk", name: "Amul Taaza Toned Milk", unit: "500 ml", price: 29, emoji: "🥛", cat: "dairy" },
  { id: "eggs", name: "Brown Eggs", unit: "6 pcs", price: 54, emoji: "🥚", cat: "dairy" },
  { id: "paneer", name: "Malai Paneer", unit: "200 g", price: 95, emoji: "🧀", cat: "dairy" },
  { id: "curd", name: "Set Curd", unit: "400 g", price: 38, emoji: "🥣", cat: "dairy" },
  { id: "butter", name: "Amul Butter", unit: "100 g", price: 60, emoji: "🧈", cat: "dairy" },
  { id: "banana", name: "Robust Bananas", unit: "6 pcs", price: 42, emoji: "🍌", cat: "fruits" },
  { id: "mango", name: "Alphonso Mangoes", unit: "2 pcs", price: 180, emoji: "🥭", cat: "fruits" },
  { id: "tomato", name: "Hybrid Tomatoes", unit: "500 g", price: 24, emoji: "🍅", cat: "fruits" },
  { id: "onion", name: "Onions", unit: "1 kg", price: 36, emoji: "🧅", cat: "fruits" },
  { id: "spinach", name: "Palak (Spinach)", unit: "1 bunch", price: 18, emoji: "🥬", cat: "fruits" },
  { id: "atta", name: "Whole Wheat Atta", unit: "5 kg", price: 245, emoji: "🌾", cat: "staples" },
  { id: "rice", name: "Daawat Basmati Rice", unit: "1 kg", price: 128, emoji: "🍚", cat: "staples" },
  { id: "dal", name: "Toor Dal", unit: "1 kg", price: 152, emoji: "🫘", cat: "staples" },
  { id: "oil", name: "Sunflower Oil", unit: "1 L", price: 139, emoji: "🌻", cat: "staples" },
  { id: "bread", name: "Multigrain Bread", unit: "400 g", price: 40, emoji: "🍞", cat: "bakery" },
  { id: "biscuits", name: "Bourbon Biscuits", unit: "150 g", price: 30, emoji: "🍪", cat: "bakery" },
  { id: "chai", name: "Assam Masala Chai", unit: "250 g", price: 120, emoji: "☕", cat: "bakery" },
  { id: "dishwash", name: "Dishwash Gel", unit: "500 ml", price: 99, emoji: "🧴", cat: "home" },
  { id: "floor", name: "Floor Cleaner", unit: "1 L", price: 110, emoji: "🧽", cat: "home" },
  { id: "garbage", name: "Garbage Bags", unit: "30 pcs", price: 75, emoji: "🗑️", cat: "home" },
];
