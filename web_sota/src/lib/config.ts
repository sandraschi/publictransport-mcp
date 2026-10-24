// Centralised endpoints/ports. Env-overridable for other machines -
// no hardcoded localhost ports scattered through pages (fleet P1 rule).
export const API_BASE =
	import.meta.env.VITE_API_TARGET ?? "http://127.0.0.1:11170";

// Native Leaflet map app (frontend/app.py). Runs as its own server -
// embedded in the dashboard under /map via iframe, ?city= selects the city.
export const MAP_URL = import.meta.env.VITE_MAP_URL ?? "http://localhost:10722";

export const DOCS_URL =
	import.meta.env.VITE_DOCS_URL ??
	"https://github.com/sandraschi/publictransport-mcp";
