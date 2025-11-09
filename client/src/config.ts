const FALLBACK_API_BASE_URL = "http://localhost:5050";

export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || FALLBACK_API_BASE_URL;
