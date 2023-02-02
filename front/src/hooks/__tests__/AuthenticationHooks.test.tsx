import { renderHook } from '@testing-library/react';
import {
  useIsNotLoggedIn,
  useGetUserEmailFromToken,
} from '../AuthenticationHooks';
import { useAuth0 } from '@auth0/auth0-react';
import { mocked } from 'jest-mock';

jest.mock('@auth0/auth0-react');
const mockedUseAuth0 = mocked(useAuth0, true);

const user = {
  email: 'johndoe@me.com',
  email_verified: true,
  sub: 'google-oauth2|12345678901234',
};

describe('useIsNotLoggedIn', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.resetModules();
  });

  it('returns false if auth0 is loading', () => {
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: false,
      user,
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
      getAccessTokenWithPopup: jest.fn(),
      getAccessTokenSilently: jest.fn(),
      getIdTokenClaims: jest.fn(),
      loginWithPopup: jest.fn(),
      handleRedirectCallback: jest.fn(),
      isLoading: true,
    });

    const { result } = renderHook(() => useIsNotLoggedIn());
    const isNotLoggedIn = result.current;

    expect(isNotLoggedIn).toBe(false);
  });

  it('returns false if token is not there', () => {
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: false,
      user,
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
      getAccessTokenWithPopup: jest.fn(),
      getAccessTokenSilently: jest.fn(),
      getIdTokenClaims: jest.fn(),
      loginWithPopup: jest.fn(),
      handleRedirectCallback: jest.fn(),
      isLoading: false,
    });

    const { result } = renderHook(() => useIsNotLoggedIn());
    const isNotLoggedIn = result.current;

    expect(isNotLoggedIn).toBe(true);
  });

  it('returns false if token is there but user is not connected on auth0', () => {
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: false,
      user,
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
      getAccessTokenWithPopup: jest.fn(),
      getAccessTokenSilently: jest.fn(),
      getIdTokenClaims: jest.fn(),
      loginWithPopup: jest.fn(),
      handleRedirectCallback: jest.fn(),
      isLoading: false,
    });

    window.localStorage.setItem('accessToken', 'token');
    const { result } = renderHook(() => useIsNotLoggedIn());
    const isNotLoggedIn = result.current;

    expect(isNotLoggedIn).toBe(true);
  });

  it('returns false if token is there and user is connected on auth0', () => {
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
      getAccessTokenWithPopup: jest.fn(),
      getAccessTokenSilently: jest.fn(),
      getIdTokenClaims: jest.fn(),
      loginWithPopup: jest.fn(),
      handleRedirectCallback: jest.fn(),
      isLoading: false,
    });

    window.localStorage.setItem('accessToken', 'token');
    const { result } = renderHook(() => useIsNotLoggedIn());
    const isNotLoggedIn = result.current;

    expect(isNotLoggedIn).toBe(false);
  });
});

describe('useGetUserEmailFromToken', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.resetModules();
  });

  it('returns undefined if token is not there', () => {
    const { result } = renderHook(() => useGetUserEmailFromToken());
    const email = result.current;

    expect(email).toBe(undefined);
  });

  it('returns email if token is there', () => {
    window.localStorage.setItem(
      'accessToken',
      '***REMOVED***',
    );
    const { result } = renderHook(() => useGetUserEmailFromToken());

    expect(result.current).toBe('charles@ouihelp.twenty.com');
  });
});
