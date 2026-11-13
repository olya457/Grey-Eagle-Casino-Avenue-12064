import { NavigatorScreenParams } from '@react-navigation/native';
export type TabParams = {
  Events: undefined;
  Dining: undefined;
  Hotel: undefined;
  Tours: undefined;
  Explore: undefined;
};
export type RootParams = {
  Main: NavigatorScreenParams<TabParams> | undefined;
  EventDetail: { id: string };
  VenueDetail: { id: string };
  RoomDetail: { id: string };
  TourDetail: { id: string };
  Assistant: undefined;
  Resources: { topic?: string } | undefined;
  ResourceDetail: { id: string };
};
