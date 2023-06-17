import { waitFor } from '@testing-library/react';

import {
  getTokensFromLoginToken,
  getTokensFromRefreshToken,
  getUserIdFromToken,
  hasAccessToken,
  hasRefreshToken,
} from '../AuthService';

const validTokensPayload = {
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

const mockFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  if (input.toString().match(/\/auth\/token$/g)) {
    const refreshToken = init?.body
      ? JSON.parse(init.body.toString()).refreshToken
      : null;
    return new Promise((resolve) => {
      resolve(
        new Response(
          JSON.stringify({
            tokens:
              refreshToken === 'xxx-valid-refresh' ? validTokensPayload : null,
          }),
        ),
      );
    });
  }

  if (input.toString().match(/\/auth\/verify$/g)) {
    const loginToken = init?.body
      ? JSON.parse(init.body.toString()).loginToken
      : null;
    return new Promise((resolve) => {
      resolve(
        new Response(
          JSON.stringify({
            tokens:
              loginToken === 'xxx-valid-login' ? validTokensPayload : null,
          }),
        ),
      );
    });
  }
  return new Promise(() => new Response());
};

global.fetch = mockFetch;

it('hasAccessToken is true when token is present', () => {
  localStorage.setItem('accessToken', 'xxx');
  expect(hasAccessToken()).toBe(true);
});

it('hasAccessToken is false when token is not', () => {
  expect(hasAccessToken()).toBe(false);
});

it('hasRefreshToken is true when token is present', () => {
  localStorage.setItem('refreshToken', 'xxx');
  expect(hasRefreshToken()).toBe(true);
});

it('hasRefreshToken is true when token is not', () => {
  expect(hasRefreshToken()).toBe(false);
});

it('refreshToken does not refresh the token if refresh token is missing', () => {
  getTokensFromRefreshToken();
  expect(localStorage.getItem('accessToken')).toBeNull();
});

it('refreshToken does not refreh the token if refresh token is invalid', () => {
  localStorage.setItem('refreshToken', 'xxx-invalid-refresh');
  getTokensFromRefreshToken();
  expect(localStorage.getItem('accessToken')).toBeNull();
});

it('refreshToken does not refreh the token if refresh token is empty', () => {
  getTokensFromRefreshToken();
  expect(localStorage.getItem('accessToken')).toBeNull();
});

it('refreshToken refreshes the token if refresh token is valid', async () => {
  localStorage.setItem('refreshToken', 'xxx-valid-refresh');
  getTokensFromRefreshToken();
  await waitFor(() => {
    expect(localStorage.getItem('accessToken')).toBe(
      '***REMOVED***',
    );
  });
});

it('getUserIdFromToken returns null when the token is not present', async () => {
  const userId = getUserIdFromToken();
  expect(userId).toBeNull();
});

it('getUserIdFromToken returns null when the token is not valid', async () => {
  localStorage.setItem('accessToken', 'xxx-invalid-access');
  const userId = getUserIdFromToken();
  expect(userId).toBeNull();
});

it('getUserIdFromToken returns the right userId when the token is valid', async () => {
  localStorage.setItem(
    'accessToken',
    '***REMOVED***',
  );
  const userId = getUserIdFromToken();
  expect(userId).toBe('374fe3a5-df1e-4119-afe0-2a62a2ba481e');
});

it('getTokensFromLoginToken does nothing if loginToken is empty', async () => {
  await getTokensFromLoginToken('');
  expect(localStorage.getItem('accessToken')).toBeNull();
  expect(localStorage.getItem('refreshToken')).toBeNull();
});

it('getTokensFromLoginToken does nothing if loginToken is not valid', async () => {
  await getTokensFromLoginToken('xxx-invalid-login');
  expect(localStorage.getItem('accessToken')).toBeNull();
  expect(localStorage.getItem('refreshToken')).toBeNull();
});

it('getTokensFromLoginToken does nothing if loginToken is not valid', async () => {
  await getTokensFromLoginToken('xxx-valid-login');
  expect(localStorage.getItem('accessToken')).toBe(
    '***REMOVED***',
  );
  expect(localStorage.getItem('refreshToken')).toBe(
    '***REMOVED***',
  );
});

afterEach(() => {
  localStorage.clear();
});
