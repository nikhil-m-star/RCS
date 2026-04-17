import { createContext } from 'react';

export const DemoAuthContext = createContext(null);

export const DEMO_USER = {
  id: 'demo_user_001',
  firstName: 'Wanderer',
  username: 'wanderer',
  imageUrl: null,
};
