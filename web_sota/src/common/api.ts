// Typed client for the web_sota FastAPI backend (port 11170).
// Live OGD data: departures/disruptions. Reference snapshots: major stops, lines.
import { API_BASE } from "../lib/api";

export interface Departure {
	line: string;
	destination: string;
	countdown: number | null;
	time_planned?: string | null;
	time_real?: string | null;
	platform?: string | null;
	stop?: string | null;
}

export interface Alert {
	id: string;
	title: string;
	description: string;
	reason?: string;
	lines: string[];
	severity?: string;
	status?: string;
	start_time?: string;
	end_time?: string;
}

export interface Station {
	name: string;
	rbl: string;
	lat?: number;
	lon?: number;
}

export interface LineInfo {
	name: string;
	type: string;
	color: string;
	description?: string;
}

async function get<T>(path: string): Promise<T> {
	const r = await fetch(`${API_BASE}${path}`);
	if (!r.ok) {
		let detail = `${r.status} ${r.statusText}`;
		try {
			const body = await r.json();
			if (body?.error) detail += ` - ${body.error}`;
		} catch {
			/* non-JSON error body */
		}
		throw new Error(detail);
	}
	return r.json();
}

const majorCache: Map<string, Station[]> = new Map();
const linesCache: Map<string, LineInfo[]> = new Map();

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

export const api = {
	/** City catalog with data_loaded truth and live flags. */
	cities: () => get<{ cities: CityInfo[]; count: number }>("/api/cities"),

	/** Live departures for one stop (RBL) via the OGD monitor API. Vienna-only. */
	departures: (rbl: string, city = "vienna") =>
		get<{ rbl: string; departures: Departure[]; count: number }>(
			`/api/departures?rbl=${encodeURIComponent(rbl)}&city=${encodeURIComponent(city)}`,
		),

	/** Major stops: Vienna RBL table, or the city's GTFS stops when loaded. */
	majorStops: async (city = "vienna"): Promise<Station[]> => {
		const hit = majorCache.get(city);
		if (hit) return hit;
		const d = await get<{ stops: Station[] }>(
			`/api/stops/major?city=${encodeURIComponent(city)}`,
		);
		const stops = d.stops ?? [];
		majorCache.set(city, stops);
		return stops;
	},

	/** Live service disruptions via OGD trafficInfoList. */
	trafficInfo: () =>
		get<{ alerts: Alert[]; count: number; timestamp: string }>(
			"/api/disruptions",
		),

	/** Line catalog: Vienna GTFS snapshot, or the city's gtfs-mcp export. */
	lines: async (city = "vienna"): Promise<{ lines: LineInfo[] }> => {
		const hit = linesCache.get(city);
		if (hit) return { lines: hit };
		const d = await get<{
			lines: Array<{
				name: string;
				long_name: string;
				type: string;
				color: string;
			}>;
		}>(`/api/lines?city=${encodeURIComponent(city)}`);
		const lines = (d.lines ?? []).map((l) => ({
			name: l.name,
			type: l.type,
			color: l.color,
			description: l.long_name,
		}));
		linesCache.set(city, lines);
		return { lines };
	},

	/** Name search over the stop table (client-side filter). */
	searchStations: async (
		query: string,
		city = "vienna",
	): Promise<Station[]> => {
		const stations = await api.majorStops(city);
		const q = query.toLowerCase();
		return stations
			.filter((s) => s.name.toLowerCase().includes(q))
			.slice(0, 12);
	},

	/** Backend liveness. */
	health: () => get<{ status: string }>("/api/health"),

	/** Backend status (uptime, version). */
	status: () =>
		get<{
			status: string;
			service: string;
			version: string;
			uptime_seconds: number;
		}>("/api/status"),
};
