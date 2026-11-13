# Grey Eagle Casino Avenue

React Native 0.86 and TypeScript mobile guide, based on the supplied screen references and content. All photos, posters and logos are bundled in `src/assets`; no remote images are used.

## Run

```sh
npm install
npm start
```

In another terminal:

```sh
npm run ios
npm run android
```

After changing native dependencies, install iOS pods with `pod install --project-directory=ios`. The Podfile aligns dependency deployment targets with React Native’s minimum iOS version, including resource bundles required by recent Xcode versions.

## Structure

- `src/navigation`: typed root stack and five bottom tabs using React Navigation.
- `src/screens`: onboarding, event calendar and details, dining and menus, hotel and rooms, cultural experiences, resort guide and assistant.
- `src/components`: reusable gradient buttons, icons, cards, segments, filters and information tables.
- `src/data`: the supplied catalogue and explicit local image mapping.
- `src/storage`: AsyncStorage hydration and serialized writes for user data.
- `src/theme`: shared colours and typography.
- `src/utils`: event filtering and external link handling.

## Behaviour

The splash uses the supplied background and logo with a four-second WebView progress animation. First launch continues to four onboarding pages. Completed onboarding is remembered; later launches open Events after the splash.

The catalogue contains 36 events, five venues, 169 menu items, five room types and eight cultural experiences. Search, category and date filters combine. Favorites start empty and are grouped by venue. Favorite dishes, user-entered promo codes, onboarding completion and assistant history remain on the device between launches.

The assistant answers the supplied questions offline and has question search and conversation clearing. It is not connected to an AI service. Maps, the restaurant phone action and Ticketmaster search open external applications; external actions require compatible apps or connectivity.

No discount codes or personal data are generated. Event promo sheets let visitors save, edit, remove and copy codes they already received from a venue or ticket provider. Automatic discount issuance, verification, in-app bookings and payments require authorized external services that were not supplied. The app does not claim a booking or purchase has been completed.

The supplied content is a bundled catalogue, not a live event or restaurant feed. Update the JSON data when schedules, menus, prices or renovation notices change. The runtime reads `menu.json`; keep record IDs stable when updating the catalogue.

## Checks

```sh
npx tsc --noEmit
npm test -- --runInBand
npm run lint
```

Tests cover catalogue integrity, combined filters, saved-data migration, reading-list persistence, narrow/unfolded/landscape layouts, large text and preservation of user input across layout changes.

## Read & Watch

Explore includes eight English-language resources: six articles and two videos from Tourism Calgary, Travel Alberta and Grey Eagle. Visitors can search, filter by format or topic, save links locally, share them and open the original publisher. Saved links do not download external content. Existing saved dishes, codes and conversations are retained when the new reading-list field is added.

## Adaptive layout and motion

Layouts observe live window dimensions, safe-area insets and font scaling. Wide windows use two-column cards, a split onboarding layout, labelled navigation and side-by-side assistant conversation and suggestions. When the window is wider than it is tall, navigation becomes a scrollable vertical rail on the left and reserves its own content space. Portrait windows keep the bottom tab bar. Narrow windows return to one column; large text, short landscape windows and safe areas are handled without device-name checks or resetting navigation and input state. This supports the iPhone Duo outer and unfolded displays as well as resized multitasking windows.

Screen entrances, staggered cards, onboarding changes, chat messages and press feedback use React Native Animated with native-driver transforms. System Reduce Motion disables these transitions and changes the splash to a static progress indicator while preserving its four-second duration.

Images follow `grey-eagle-*.png` naming. Unused background/duplicate-room images, five byte-identical poster copies, redundant menu source copies and the unused React Native welcome package have been removed. The native launch storyboard now uses a plain black background instead of template branding.

The Events date control opens a month calendar with event markers and a clear-date action. The supplied 36 events repeat across November 2026–April 2027, while original entries outside that window remain available. Generated occurrences have unique IDs, preserve show times and are labelled as repeated listings requiring date confirmation.
