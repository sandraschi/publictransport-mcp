# publictransport-mcp

Live Vienna public transport — departures, journey planning, disruptions and a
real-time map — as a web dashboard and as a Claude Desktop MCP server
(FastMCP 3.4, 20 tools, 5 prompts, 5 resources).

**Version:** 1.1.0 · **License:** MIT · **Status:** beta

> Renamed from `mywienerlinien` to `publictransport-mcp` in October 2026
> (multi-city support). Old paths, ports and screenshots floating around the
> internet may still say Wiener Linien or `mywienerlinien`.

## What You Can Do

- **Live map** (`web_sota` dashboard + native Leaflet page): lines, stops and
  vehicle markers with type/line filters, arrivals panel, favorites, traffic
  alerts. Honest limitation: Wiener Linien publishes no live GPS positions,
  so markers are schedule-interpolated between GTFS stops, not tracked buses.
- **Next departures, timetables, nearby stops** from the Vienna GTFS feed.
- **Journey planning** with A* multi-transfer routing and real-time delays.
- **Disruptions and traffic alerts** from the official Wiener Linien feed.
- **Multi-city**: Vienna plus other cities once their GTFS is loaded. The map
  dropdown only enables cities with data on disk; the rest show
  "no data yet - load it with gtfs-mcp".
- **Ask Claude**: all of the above in natural language via the MCP server
  (stdio for Claude Desktop, HTTP for the dashboard).

## Preview

*Screenshots: TODO — no current captures checked in. If you run the stack
locally, the live views are:*

- Map (native Leaflet page served by the backend)
- Dashboard: <http://localhost:10896> (Vite, proxied) once `just serve` is up
- Backend health: <http://localhost:11170/api/health>

Captures belong in `docs/screenshots/` (`dashboard.png` hero,
`map-demo.png` feature) with a one-line caption each.

## Install

**Claude Desktop (easiest):** download the `.mcpb` bundle from the
[latest release](https://github.com/sandraschi/publictransport-mcp/releases/latest)
(current file is `vienna-transit-mcp.mcpb`, a pre-rename name) and open it
with Claude Desktop. This registers the MCP server only; it does not install
the web dashboard.

**Web dashboard (local):** double-click
`mcp-central-docs/starts/publictransport-mcp-start.bat`
(or `start-map.ps1` in this repo). Backend on `:11170`, frontend on `:10896`.

**Developers:** source builds, justfile recipes, tests and packaging are in
[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) — no `git clone` / `just` / `uv`
in this section by design. Everything else is in [INSTALL.md](INSTALL.md).

## Example Prompts

> "When does the next U6 leave Nussdorfer Strasse toward Siebenhirten?"
>
> "Plan a journey from Stephansplatz to Schoenbrunn with the fewest transfers."
>
> "Are there any disruptions on the D tram line right now?"

## Fleet Crossconnects

| Companion | Why | Ports |
|---|---|---|
| [gtfs-mcp](https://github.com/sandraschi/gtfs-mcp) | Downloads and serves the GTFS schedule snapshots this repo reads (`data/snapshots/vienna.db`); also the loader for non-Vienna cities | backend 10913, frontend 10912 |

Companions are optional: the map and MCP server run on the bundled Vienna
snapshot without gtfs-mcp installed.

## Documentation

| Doc | Contents |
|-----|----------|
| [Installation](INSTALL.md) | All install methods, prerequisites |
| [Onboarding](docs/ONBOARDING.md) | First-timer GTFS data setup, API quirks |
| [Configuration](docs/CONFIGURATION.md) | Env vars, config options |
| [Tool Reference](docs/TOOLS.md) | All 20 tools, 5 prompts, 5 resources |
| [Public API](docs/PUBLIC_API.md) | REST endpoints |
| [Development](docs/DEVELOPMENT.md) | Local setup, justfile recipes, tests |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues |

## Requirements

- Windows 10/11 (starts launchers and `start.ps1` target Windows; the Python
  backend itself is cross-platform)
- Claude Desktop (only for the MCP path)
- Python 3.10+ and `uv` (only for source builds — not needed for the `.mcpb`
  or starts-bat paths)
- Vienna GTFS data: bundled snapshot works out of the box; refreshes and
  extra cities via gtfs-mcp

## License

MIT — see [LICENSE](LICENSE).

**Data:** Wiener Linien Open Data (<https://www.wienerlinien.at/open-data>),
CC BY 4.0.
