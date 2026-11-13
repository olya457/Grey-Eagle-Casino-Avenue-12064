export type Resource = {
  id: string;
  title: string;
  kind: 'Article' | 'Video';
  topic: string;
  publisher: string;
  url: string;
  image: string;
  summary: string;
  highlights: string[];
};
export const resources: Resource[] = [
  {
    id: 'indigenous-calgary',
    title: 'Indigenous experiences in and around Calgary',
    kind: 'Article',
    topic: 'Culture',
    publisher: 'Tourism Calgary',
    url: 'https://www.visitcalgary.com/plan-and-stay/itineraries-and-travel-inspiration/indigenous-experiences-in-and-around-calgary',
    image: 'grey-eagle-onboarding-culture.png',
    summary:
      'Discover Indigenous-led experiences near Calgary, with ideas for learning about local art, heritage and connections to the land.',
    highlights: [
      'Ideas for a cultural day out',
      'Museums, artists and local operators',
      'Places beyond the resort',
    ],
  },
  {
    id: 'confluence-guide',
    title: 'A visitor’s guide to The Confluence',
    kind: 'Article',
    topic: 'Calgary',
    publisher: 'Tourism Calgary',
    url: 'https://www.visitcalgary.com/plan-and-stay/itineraries-and-travel-inspiration/the-confluence-guide',
    image: 'grey-eagle-resort-exterior.png',
    summary:
      'Explore the historic meeting place of the Bow and Elbow rivers, including exhibitions, parkland and Indigenous interpretation.',
    highlights: [
      'Historic site and parkland',
      'Exhibitions and walking experiences',
      'Ideas for planning your visit',
    ],
  },
  {
    id: 'stampede-culture',
    title: 'First Nations experiences at the Calgary Stampede',
    kind: 'Article',
    topic: 'Culture',
    publisher: 'Tourism Calgary',
    url: 'https://www.visitcalgary.com/plan-and-stay/itineraries-and-travel-inspiration/first-nations-stampede',
    image: 'grey-eagle-onboarding-culture.png',
    summary:
      'Learn about Treaty 7 cultures at the Stampede, from Elbow River Camp to dance, hand games and Indigenous food.',
    highlights: [
      'Elbow River Camp',
      'Treaty 7 First Nations',
      'Seasonal cultural programming',
    ],
  },
  {
    id: 'resort-dining',
    title: 'Explore Grey Eagle dining',
    kind: 'Article',
    topic: 'Dining',
    publisher: 'Grey Eagle Resort',
    url: 'https://www.greyeagleresortandcasino.ca/dining',
    image: 'grey-eagle-little-chief-restaurant.png',
    summary:
      'Visit the official dining guide for restaurant information and Little Chief’s Indigenous-inspired approach to food.',
    highlights: [
      'Official dining information',
      'Little Chief Restaurant',
      'Restaurant contacts and menus',
    ],
  },
  {
    id: 'resort-updates',
    title: 'Plan your stay: resort updates',
    kind: 'Article',
    topic: 'Stay',
    publisher: 'Grey Eagle Resort',
    url: 'https://www.greyeagleresortandcasino.ca/resort-updates',
    image: 'grey-eagle-onboarding-stay.png',
    summary:
      'Check the resort’s own updates before travelling, including renovation notices and changes to dining or hotel facilities.',
    highlights: [
      'Renovation notices',
      'Hotel and dining facilities',
      'Information to check before arrival',
    ],
  },
  {
    id: 'about-grey-eagle',
    title: 'The story of Grey Eagle',
    kind: 'Article',
    topic: 'Resort',
    publisher: 'Grey Eagle Resort',
    url: 'https://www.greyeagleresortandcasino.ca/about-us',
    image: 'grey-eagle-resort-exterior.png',
    summary:
      'Read the resort’s introduction to its setting on Tsuut’ina Nation land, hospitality and entertainment.',
    highlights: [
      'The resort and its setting',
      'Entertainment and hospitality',
      'An introduction for first-time visitors',
    ],
  },
  {
    id: 'embrace-buffalo',
    title: 'Embrace the Buffalo',
    kind: 'Video',
    topic: 'Culture',
    publisher: 'Travel Alberta',
    url: 'https://industry.travelalberta.com/posts/articles/embrace-the-buffalo',
    image: 'grey-eagle-onboarding-culture.png',
    summary:
      'A short film exploring the buffalo’s cultural importance and the role of Indigenous-led tourism, shared through Indigenous operators’ perspectives.',
    highlights: [
      'Film and accompanying English article',
      'Indigenous voices and storytelling',
      'Connections between culture and land',
    ],
  },
  {
    id: 'alberta-experiences',
    title: 'Indigenous experiences in Alberta',
    kind: 'Video',
    topic: 'Culture',
    publisher: 'Travel Alberta · YouTube',
    url: 'https://www.youtube.com/watch?v=NB41-GlAx3s',
    image: 'grey-eagle-onboarding-culture.png',
    summary:
      'Watch Travel Alberta’s introduction to Indigenous travel experiences across the province.',
    highlights: [
      'English-language travel video',
      'Inspiration for exploring Alberta',
      'Opens on YouTube',
    ],
  },
];
export function filterResources(
  query: string,
  topic: string,
  kind: string,
  savedOnly: boolean,
  savedIds: string[],
) {
  const term = query.trim().toLowerCase();
  return resources.filter(
    item =>
      (!term ||
        `${item.title} ${item.summary} ${item.publisher}`
          .toLowerCase()
          .includes(term)) &&
      (topic === 'All topics' || item.topic === topic) &&
      (kind === 'All' || item.kind === kind) &&
      (!savedOnly || savedIds.includes(item.id)),
  );
}
