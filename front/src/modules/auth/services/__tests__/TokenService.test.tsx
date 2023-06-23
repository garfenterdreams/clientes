import Cookies from 'js-cookie';

import { tokenService } from '../TokenService';

const tokenPair = {
  accessToken: {
    token:
      '***REMOVED***',
    expiresAt: '2023-06-17T09:18:02.942Z',
  },
  refreshToken: {
    token:
      '***REMOVED***',
    expiresAt: '2023-09-15T09:13:02.952Z',
  },
};

it('getTokenPair is fullfiled when token is present', () => {
  tokenService.setTokenPair(tokenPair);

  // Otherwise the test will fail because Cookies-js seems to be async but functions aren't promises
  setTimeout(() => {
    expect(tokenService.getTokenPair()).toBe({
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    });
  }, 10);
});

it('getTokenPair is null when token is not set', () => {
  expect(tokenService.getTokenPair()).toBeNull();
});

it('removeTokenPair clean cookie storage', () => {
  tokenService.setTokenPair(tokenPair);
  tokenService.removeTokenPair();
  expect(tokenService.getTokenPair()).toBeNull();
});

afterEach(() => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
});
