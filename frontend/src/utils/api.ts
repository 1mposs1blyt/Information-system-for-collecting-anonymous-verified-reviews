import Cookies from 'js-cookie';

export const authorizedFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = Cookies.get('auth_token');

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, { ...options, headers });
};

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
