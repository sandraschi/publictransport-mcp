import { useMemo } from "react";
import { MAP_URL } from "../lib/config";
import { useCityStore } from "../store/city";

/** Live map, embedded: the native Leaflet app in a full-height frame. */
export default function MapPage() {
	const city = useCityStore((s) => s.city);
	const src = useMemo(
		() => `${MAP_URL}/?city=${encodeURIComponent(city)}`,
		[city],
	);
	return (
		<div className="h-[calc(100vh-10rem)]" data-testid="map-page">
			<iframe
				key={src}
				title="Live transit map"
				src={src}
				className="h-full w-full rounded-lg border border-gray-800 bg-slate-950"
			/>
		</div>
	);
}
