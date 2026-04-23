import { City, Hostel, Testimonial } from "./types";

export const TWEAK_DEFAULTS = {
  primaryColor: "#C0392B",
  showUrdu: false,
  cardCount: 6,
};

export const CITIES: City[] = [
  { name: "Lahore", urdu: "لاہور", count: "120+", grad: "linear-gradient(160deg,#7b1413,#c0392b)" },
  { name: "Karachi", urdu: "کراچی", count: "95+", grad: "linear-gradient(160deg,#0d3b6e,#1a6fa8)" },
  { name: "Islamabad", urdu: "اسلام آباد", count: "80+", grad: "linear-gradient(160deg,#1a3a2a,#27ae60)" },
  { name: "Peshawar", urdu: "پشاور", count: "45+", grad: "linear-gradient(160deg,#5d3a1a,#e67e22)" },
  { name: "Faisalabad", urdu: "فیصل آباد", count: "60+", grad: "linear-gradient(160deg,#3b1f5e,#8e44ad)" },
  { name: "Quetta", urdu: "کوئٹہ", count: "30+", grad: "linear-gradient(160deg,#0a2e2e,#16a085)" },
  { name: "Multan", urdu: "ملتان", count: "40+", grad: "linear-gradient(160deg,#4a1500,#d35400)" },
];

export const HOSTELS: Hostel[] = [
  { id: 1, name: "Al-Noor Executive Hostel", area: "Gulberg III", city: "Lahore", price: "9,500", rating: 4.6, reviews: 128, type: "Male", verified: true, amenities: ["wifi", "meals", "ac", "security", "generator"], tags: ["Monthly", "Daily"], grad: "linear-gradient(135deg,#1a1a2e,#16213e)" },
  { id: 2, name: "Rahat Ladies Hostel", area: "F-7 Markaz", city: "Islamabad", price: "12,000", rating: 4.8, reviews: 204, type: "Female", verified: true, amenities: ["wifi", "meals", "ac", "laundry", "security"], tags: ["Monthly"], grad: "linear-gradient(135deg,#2d1b69,#11998e)" },
  { id: 3, name: "Capital View Residency", area: "G-10/1", city: "Islamabad", price: "8,000", rating: 4.3, reviews: 76, type: "Co-ed", verified: true, amenities: ["wifi", "ac", "security", "generator"], tags: ["Monthly", "Weekly"], grad: "linear-gradient(135deg,#134e5e,#71b280)" },
  { id: 4, name: "DHA Boys Hostel", area: "Phase 6", city: "Karachi", price: "11,000", rating: 4.5, reviews: 161, type: "Male", verified: true, amenities: ["wifi", "meals", "laundry", "security"], tags: ["Monthly"], grad: "linear-gradient(135deg,#360033,#0b8793)" },
  { id: 5, name: "Nishtar Road Hostel", area: "Faisalabad City", city: "Faisalabad", price: "6,500", rating: 4.1, reviews: 53, type: "Male", verified: false, amenities: ["wifi", "meals", "generator"], tags: ["Monthly", "Daily"], grad: "linear-gradient(135deg,#5c3317,#c0392b)" },
  { id: 6, name: "Saddar Professional Stay", area: "Saddar", city: "Peshawar", price: "7,200", rating: 4.4, reviews: 89, type: "Co-ed", verified: true, amenities: ["wifi", "ac", "laundry", "security"], tags: ["Monthly", "Weekly"], grad: "linear-gradient(135deg,#003973,#e5e5be)" },
];

export const TESTIMONIALS: Testimonial[] = [
  { q: "HostelIn ne meri zindagi aasaan kar di. Lahore mein job ke liye aaya tha, 2 din mein perfect hostel mil gaya.", name: "Usman Tariq", role: "Software Engineer", city: "Lahore", init: "UT", color: "#C0392B" },
  { q: "As a girl moving to Islamabad for university, safety was my top concern. Found a verified ladies hostel through HostelIn in minutes.", name: "Ayesha Noor", role: "Student, NUST", city: "Islamabad", init: "AN", color: "#8e44ad" },
  { q: "Monthly rent, meals included, WiFi - sab kuch ek jagah. Highly recommend to all professionals.", name: "Bilal Hussain", role: "MBA Student", city: "Karachi", init: "BH", color: "#2980b9" },
];

export const FOOTER_COLS = [
  { title: "Company", links: ["About Us", "Blog", "Careers", "Press"] },
  { title: "For Guests", links: ["Find Hostel", "How It Works", "Safety", "FAQs"] },
  { title: "For Owners", links: ["List Hostel", "Owner Dashboard", "Pricing", "Support"] },
  { title: "Cities", links: ["Lahore", "Karachi", "Islamabad", "Peshawar", "Faisalabad", "Quetta"] },
];

export const FILTERS = ["All", "Male Only", "Female Only", "Co-ed", "Student Hostels", "Professional Hostels", "Near University"];

export const STEPS = [
  { n: 1, title: "Search Your City" },
  { n: 2, title: "Compare & Choose" },
  { n: 3, title: "Book & Move In" },
];

export const CITY_AREAS: Record<string, string[]> = {
  Lahore: ["Gulberg", "DHA", "Johar Town", "Model Town", "Garden Town", "Cavalry Ground", "Allama Iqbal Town", "Wapda Town", "Cantt", "Bahria Town", "Township", "Shadman", "Faisal Town"],
  Karachi: ["DHA", "Clifton", "Gulshan-e-Iqbal", "Gulistan-e-Johar", "North Nazimabad", "Saddar", "PECHS", "Korangi", "Malir", "Nazimabad", "Bahadurabad", "FB Area", "Scheme 33"],
  Islamabad: ["F-6", "F-7", "F-8", "F-10", "F-11", "G-8", "G-9", "G-10", "G-11", "G-13", "H-8", "I-8", "I-10", "Blue Area", "Bahria Town"],
  Peshawar: ["University Town", "Hayatabad", "Saddar", "Cantt", "Board Bazaar", "Gulbahar", "Ring Road", "Warsak Road", "GT Road"],
  Faisalabad: ["Peoples Colony", "Madina Town", "Ghulam Muhammad Abad", "Susan Road", "Jinnah Colony", "Canal Road", "Satiana Road", "Abdullahpur"],
  Quetta: ["Cantt", "Satellite Town", "Jinnah Town", "Brewery Road", "Zarghoon Road", "Airport Road", "Sariab Road", "Joint Road"],
  Multan: ["Bosan Road", "Shah Rukn-e-Alam Colony", "Gulgasht Colony", "Cantt", "Bahauddin Zakariya", "Sher Shah Road", "Mumtazabad", "Garden Town"],
  Rawalpindi: ["Satellite Town", "Commercial Market", "Saddar", "Chaklala", "Bahria Town", "DHA", "Adiala Road", "Sixth Road", "Cantt", "Westridge"],
};
