import React from 'react';

import { NotificationProvider } from './src/context/AddItemNotificationProvider';

export const shouldUpdateScroll = ({ routerProps }) => {
  // Let browser handle scroll restoration (especially for Back/Forward buttons)
  return false;
};

export const wrapRootElement = ({ element }) => (
  <NotificationProvider>{element}</NotificationProvider>
);
