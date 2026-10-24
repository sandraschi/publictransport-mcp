import { ChevronLeft, ChevronRight, Globe, Map as MapIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import FloatingChat from "./components/FloatingChat";
import { useBackendStatus } from "./hooks/useBackendStatus";
import AppsPage from "./pages/AppsPage";
import ChatPage from "./pages/ChatPage";
import Dashboard from "./pages/Dashboard";
import DeparturePage from "./pages/DeparturePage";
import DisruptionsPage from "./pages/DisruptionsPage";
import HelpPage from "./pages/HelpPage";
import InboxPage from "./pages/InboxPage";
import LinesPage from "./pages/LinesPage";
import Logging from "./pages/Logging";
import MapPage from "./pages/MapPage";
import SettingsPage from "./pages/SettingsPage";
import SkillsPage from "./pages/SkillsPage";
import ToolsPage from "./pages/ToolsPage";
import { useCityStore } from "./store/city";

const NAV = [
	{ to: "/", label: "Dashboard" },
	{ to: "/map", label: "Live Map" },
	{ to: "/departures", label: "Departures" },
	{ to: "/disruptions", label: "Disruptions" },
	{ to: "/lines", label: "Lines" },
	{ to: "/inbox", label: "Inbox" },
	{ to: "/chat", label: "Chat" },
	{ to: "/tools", label: "Tools" },
	{ to: "/skills", label: "Skills" },
	{ to: "/apps", label: "Apps" },
	{ to: "/logs", label: "Logs" },
	{ to: "/settings", label: "Settings" },
	{ to: "/help", label: "Help" },
];

const LS_SIDEBAR = "pt_sidebar_collapsed";

function CitySelect() {
	const cities = useCityStore((s) => s.cities);
	const city = useCityStore((s) => s.city);
	const loaded = useCityStore((s) => s.loaded);
	const loadCities = useCityStore((s) => s.loadCities);
	const setCity = useCityStore((s) => s.setCity);

	useEffect(() => {
		loadCities();
	}, [loadCities]);

	if (!loaded) return null;
	return (
		<label
			className="inline-flex items-center gap-1.5 text-sm text-slate-300"
			title="Active transit city"
		>
			<Globe size={15} className="shrink-0" />
			<select
				data-testid="city-select"
				value={city}
				onChange={(e) => setCity(e.target.value)}
				className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
			>
				{cities
					.filter((c) => c.data_loaded === true)
					.map((c) => (
						<option key={c.key || c.code} value={c.key || c.code}>
							{c.name}
						</option>
					))}
				{cities
					.filter((c) => c.data_loaded !== true)
					.map((c) => (
						<option
							key={c.key || c.code}
							value={c.key || c.code}
							disabled
							title={`No GTFS data for ${c.name} yet - load it with gtfs-mcp`}
						>
							{c.name} - no data yet
						</option>
					))}
			</select>
		</label>
	);
}

function Shell() {
	const backend = useBackendStatus();
	const city = useCityStore((s) => s.city);
	const current = useCityStore((s) => s.current);
	const [collapsed, setCollapsed] = useState(
		() => localStorage.getItem(LS_SIDEBAR) === "1",
	);
	const dot =
		backend === "up"
			? "bg-emerald-500"
			: backend === "down"
				? "bg-red-500"
				: "bg-amber-400 animate-pulse";

	useEffect(() => {
		try {
			localStorage.setItem(LS_SIDEBAR, collapsed ? "1" : "0");
		} catch {
			/* storage unavailable */
		}
	}, [collapsed]);

	const cityName = current()?.name ?? city;

	return (
		<div
			className="min-h-screen flex bg-slate-950 text-slate-200"
			data-testid="app-shell"
		>
			{/* Sidebar */}
			<aside
				className={`${collapsed ? "w-14" : "w-56"} shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col transition-[width] duration-150`}
			>
				<div className="flex items-center gap-2 px-3 py-3 border-b border-gray-800">
					<button
						type="button"
						onClick={() => setCollapsed((c) => !c)}
						className="p-1.5 rounded hover:bg-gray-800 text-slate-300 hover:text-white"
						title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						data-testid="sidebar-toggle"
					>
						{collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
					</button>
					{!collapsed && (
						<span className="text-base font-bold text-white truncate">
							PublicTransport
						</span>
					)}
				</div>
				<nav
					className="flex-1 overflow-y-auto p-2 space-y-0.5"
					data-testid="main-nav"
				>
					{NAV.map(({ to, label }) => (
						<NavLink
							key={to}
							to={to}
							end={to === "/"}
							title={label}
							className={({ isActive }) =>
								`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors ${
									isActive
										? "bg-blue-600 text-white"
										: "text-slate-300 hover:text-white hover:bg-gray-800"
								}`
							}
						>
							{collapsed ? (
								<span className="truncate" title={label}>
									{to === "/map" ? (
										<MapIcon size={16} className="shrink-0" />
									) : (
										label.slice(0, 2)
									)}
								</span>
							) : (
								<>
									{to === "/map" && <MapIcon size={16} className="shrink-0" />}
									<span className="truncate">{label}</span>
								</>
							)}
						</NavLink>
					))}
				</nav>
				<div className="px-3 py-2 border-t border-gray-800 flex items-center gap-1.5 text-xs text-slate-400">
					<span
						className={`h-2 w-2 rounded-full ${dot}`}
						data-testid="backend-dot"
					/>
					{!collapsed && <span>{backend}</span>}
				</div>
			</aside>

			{/* Main column */}
			<div className="flex-1 flex flex-col min-w-0">
				<header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-4 flex-wrap">
					<h1 className="text-lg font-bold text-white">{cityName} Live</h1>
					<CitySelect />
				</header>

				<main className="flex-1 p-6 min-w-0">
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="/map" element={<MapPage />} />
						<Route path="/departures" element={<DeparturePage />} />
						<Route path="/disruptions" element={<DisruptionsPage />} />
						<Route path="/lines" element={<LinesPage />} />
						<Route path="/inbox" element={<InboxPage />} />
						<Route path="/chat" element={<ChatPage />} />
						<Route path="/tools" element={<ToolsPage />} />
						<Route path="/skills" element={<SkillsPage />} />
						<Route path="/apps" element={<AppsPage />} />
						<Route path="/logs" element={<Logging />} />
						<Route path="/settings" element={<SettingsPage />} />
						<Route path="/help" element={<HelpPage />} />
					</Routes>
				</main>

				<footer className="text-center text-sm text-slate-400 py-2">
					Data: Wiener Linien OGD realtime + GTFS reference snapshot
				</footer>
			</div>
			<FloatingChat />
		</div>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<Shell />
		</BrowserRouter>
	);
}
