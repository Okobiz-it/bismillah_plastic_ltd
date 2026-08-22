export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://maple-ag-backend.vercel.app/api';
export const API_BASE = API_URL;

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
  }
  return null;
};


export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData, don't set Content-Type so browser sets it with boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('adminToken');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const uploadFile = async (endpoint: string, formData: FormData, method: string = 'POST') => {
  return fetchApi(endpoint, {
    method,
    body: formData,
  });
};

export const formatExternalUrl = (url?: string): string => {
  if (!url || url === '#') return '#';
  let cleaned = url.trim();
  if (!cleaned) return '#';
  if (cleaned.startsWith('http://localhost:3000/') || cleaned.startsWith('http://localhost:5000/')) {
    cleaned = cleaned.replace(/^http:\/\/localhost:(3000|5000)\//, '');
  }
  cleaned = cleaned.trim();
  if (!cleaned) return '#';
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
};

export const formatGoogleMapsEmbedUrl = (rawUrl?: string): string => {
  const fallback = "https://maps.google.com/maps?q=Baluadangga%2C%20Chauliapotti%2C%20Dinajpur&t=&z=15&ie=UTF8&iwloc=&output=embed";
  if (!rawUrl || !rawUrl.trim()) return fallback;

  let url = rawUrl.trim();

  // If user pasted an iframe tag: <iframe src="https://..." ...></iframe>
  const iframeSrcMatch = url.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    url = iframeSrcMatch[1].trim();
  }

  // If it's already a valid embed URL, return it
  if (url.includes('/maps/embed') || url.includes('output=embed')) {
    return url;
  }

  // If user entered short link (e.g. https://maps.app.goo.gl/...) or place URL:
  return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
};
