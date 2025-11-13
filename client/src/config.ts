const FALLBACK_API_BASE_URL = "https://matlikeys.com";

export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || FALLBACK_API_BASE_URL;
