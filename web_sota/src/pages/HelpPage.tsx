import { Link } from "react-router-dom";

const SECTIONS = [
	{
		title: "Getting started",
		body: "Backend: just serve (FastAPI on 127.0.0.1:11170). Dashboard: this app (Vite on :10896). Native map: /map route above, or just map (standalone Leaflet app on :10722). SQLite only - no Docker database to start. Open this dashboard and check the backend dot in the sidebar. Full walkthrough: docs/ONBOARDING.md in the repo.",
	},
	{
		title: "Where does the data come from?",
		body: "Departures, disruptions, and news come live from the Wiener Linien open data API (no key needed). The stop table and line catalog are reference snapshots from the official GTFS feed. Wiener Linien publishes no live vehicle GPS - map markers are schedule-interpolated.",
	},
	{
		title: "GTFS data and gtfs-mcp",
		body: "All schedule data enters through gtfs-mcp, the sibling fleet repo: it downloads official GTFS feeds, holds per-feed SQLite snapshots, and exports per-city tables into scripts/gtfs_data/cities/<id>/ here. The header city dropdown and the /api/cities endpoint report data_loaded per city from those exports - a city without an export shows 'no data yet' instead of an empty map. Refreshing data or adding a city (Munich, Berlin, ...) happens in gtfs-mcp, never by hand-editing files here.",
	},
	{
		title: "Multi-city",
		body: "Vienna is the only city with live data (OGD realtime). Every other city serves its static GTFS timetable once gtfs-mcp has exported it: lines, stops and the map work, live departure boards honestly report 501. Switch cities in the header dropdown.",
	},
	{
		title: "Chat and local LLMs",
		body: "Install Ollama and pull any model (e.g. llama3.2:3b), or start LM Studio. The Settings page auto-detects them. Your keys and prompts never leave this machine: the browser only talks to the backend proxy.",
	},
	{
		title: "MCP server (Claude Desktop)",
		body: "The same transit data is exposed as 20 MCP tools over stdio (see Tools). Configure Claude Desktop with python -m frontend.mcp_server.server run from the repo root. Docs: docs/TOOLS.md.",
	},
	{
		title: "Troubleshooting",
		body: "Backend dot red? The API on 127.0.0.1:11170 is not running - start it with just serve. Empty departures? The OGD API may be rate-limiting; wait 60 seconds. City shows 'no data yet'? Its gtfs-mcp export is missing - load the feed in gtfs-mcp first.",
	},
];

export default function HelpPage() {
	return (
		<div className="mx-auto max-w-3xl space-y-4" data-testid="help-page">
			<div>
				<h1 className="text-2xl font-bold text-white">Help</h1>
				<p className="mt-1 text-sm text-slate-300">
					What this dashboard does and how to run it. Repo docs live in{" "}
					<span className="font-mono">docs/</span>.
				</p>
			</div>
			{SECTIONS.map((s) => (
				<section
					key={s.title}
					className="rounded-xl border border-white/10 bg-slate-900/60 p-5"
				>
					<h2 className="font-semibold text-white">{s.title}</h2>
					<p className="mt-1 text-sm leading-relaxed text-slate-300">
						{s.body}
					</p>
				</section>
			))}
			<p className="text-sm text-slate-400">
				Still stuck? Check{" "}
				<Link to="/logs" className="text-blue-300 hover:underline">
					Logs
				</Link>{" "}
				for backend errors, or read{" "}
				<span className="font-mono">docs/TROUBLESHOOTING.md</span>.
			</p>
		</div>
	);
}
