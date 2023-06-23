import { cookieStorage } from '@/utils/cookie-storage';

import { getUserIdFromToken } from '../AuthService';

it('getUserIdFromToken returns null when the token is not present', async () => {
  const userId = getUserIdFromToken();
  expect(userId).toBeNull();
});

it('getUserIdFromToken returns null when the token is not valid', async () => {
  cookieStorage.setItem('accessToken', 'xxx-invalid-access');
  const userId = getUserIdFromToken();
  expect(userId).toBeNull();
});

it('getUserIdFromToken returns the right userId when the token is valid', async () => {
  cookieStorage.setItem(
    'accessToken',
    '***REMOVED***',
  );
  const userId = getUserIdFromToken();
  expect(userId).toBe('374fe3a5-df1e-4119-afe0-2a62a2ba481e');
});

afterEach(() => {
  cookieStorage.clear();
});
