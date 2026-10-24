import { create } from "zustand";
import { API_BASE } from "../lib/api";

export interface CityInfo {
	key: string;
	code?: string;
	name: string;
	timezone?: string;
	data_loaded: boolean;
	data_source: string;
	live: boolean;
	map_center?: { lat: number; lng: number };
	map_zoom?: number;
}

const LS_CITY = "pt_city";

const savedCity =
	typeof localStorage !== "undefined"
		? localStorage.getItem(LS_CITY) || "vienna"
		: "vienna";

interface CityState {
	cities: CityInfo[];
	city: string;
	loaded: boolean;
	loadCities: () => Promise<void>;
	setCity: (key: string) => void;
	current: () => CityInfo | undefined;
	hasData: (key: string) => boolean;
}

export const useCityStore = create<CityState>((set, get) => ({
	cities: [],
	city: savedCity,
	loaded: false,

	loadCities: async () => {
		try {
			const r = await fetch(`${API_BASE}/api/cities`);
			if (!r.ok) return;
			const d = await r.json();
			const cities: CityInfo[] = d.cities ?? [];
			let city = get().city;
			// Fall back when the stored city has no data on disk: never boot
			// into a city that will render empty.
			if (cities.length > 0) {
				const cur = cities.find((c) => (c.key || c.code) === city);
				if (cur?.data_loaded !== true) {
					const fallback = cities.find((c) => c.data_loaded === true);
					if (fallback) {
						city = fallback.key || fallback.code || "vienna";
						try {
							localStorage.setItem(LS_CITY, city);
						} catch {
							/* storage unavailable */
						}
					}
				}
			}
			set({ cities, city, loaded: true });
		} catch {
			/* backend down - pages degrade to Vienna-only */
		}
	},

	setCity: (key: string) => {
		const st = get();
		// Same rule as the native map dropdown: cities without GTFS on disk
		// are shown disabled and can never become active.
		if (st.cities.length > 0) {
			const target = st.cities.find((c) => (c.key || c.code) === key);
			if (target && target.data_loaded !== true) return;
		}
		try {
			localStorage.setItem(LS_CITY, key);
		} catch {
			/* storage unavailable */
		}
		set({ city: key });
	},

	current: () => {
		const st = get();
		return st.cities.find((c) => (c.key || c.code) === st.city);
	},

	hasData: (key: string) => {
		const st = get();
		if (st.cities.length === 0) return true; // unknown - don't brick switching
		const c = st.cities.find((x) => (x.key || x.code) === key);
		return !!c && c.data_loaded === true;
	},
}));
