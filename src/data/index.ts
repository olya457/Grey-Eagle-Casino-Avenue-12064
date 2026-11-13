import eventData from './events.json';
import roomData from './rooms.json';
import tourData from './tours.json';
import venueData from './venues.json';
import menuData from './menu.json';
export { default as questions } from './faq.json';
export { default as exploreSections } from './explore.json';
export { assets } from './assets';
export type CatalogItem = {
  id: string;
  title: string;
  image: string | null;
  fields: Record<string, string>;
  description: string;
  sections: Record<string, string[]>;
  date?: string;
};
export type MenuItem = {
  id: string;
  venueId: string;
  category: string;
  title: string;
  price: string;
  description: string;
  availability: string;
};
export const events = eventData as CatalogItem[];
export const rooms = roomData as CatalogItem[];
export const tours = tourData as CatalogItem[];
export const venues = venueData as unknown as CatalogItem[];
export const menu: MenuItem[] = menuData;
export const facilities = [
  ['FC', 'Fitness Centre', 'Open 24 hours for registered hotel guests'],
  ['HS', 'Hot Tub & Sauna', 'Outdoor wellness facilities'],
  [
    'WF',
    'Complimentary Wi-Fi',
    'In hotel guest areas and designated facilities',
  ],
  ['FP', 'Free Parking', 'Secure parking for hotel guests'],
  ['BC', 'Business Centre', 'Computer access and basic printing'],
  ['FD', 'Front Desk', 'Guest assistance and local information'],
  ['GA', 'Guest Activities', 'Board games and selected activities'],
  ['GR', 'Gaming Room', 'Reservable PlayStation 5 room'],
  ['MR', 'Meeting Facilities', 'Conferences, banquets and private events'],
  ['SH', 'Shuttle Services', 'Selected destinations, by arrangement'],
];
