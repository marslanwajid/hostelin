export interface Tweaks {
  primaryColor: string;
  showUrdu: boolean;
  cardCount: number;
}

export interface City {
  name: string;
  urdu: string;
  count: string;
  grad: string;
}

export interface Hostel {
  id: string | number;
  name: string;
  area: string;
  city: string;
  price: string;
  rating: number;
  reviews: number;
  type: string;
  verified: boolean;
  amenities: string[];
  tags: string[];
  grad: string;
}

export interface Testimonial {
  q: string;
  name: string;
  role: string;
  city: string;
  init: string;
  color: string;
}
