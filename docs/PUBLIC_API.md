# Public API

Two HTTP servers, two API surfaces. No auth, no rate limiting, no API keys.

| Server | Base URL | Serves |
|---|---|---|
| web_sota backend (FastAPI) | `http://127.0.0.1:11170` | Dashboard API: cities, lines, stops, live departures, disruptions, LLM proxy, chat |
| Native map app (FastAPI) | `http://localhost:3079` (Docker; `:10722` native) | Leaflet UI + its own JSON API |

## web_sota backend (`:11170`)

Cities first: `GET /api/cities` lists every configured city with
`data_loaded` (GTFS on disk?) and `live` (real-time OGD data?).
Only Vienna is live; other cities serve static GTFS once loaded via gtfs-mcp.

| Method | Path | Notes |
|---|---|---|
| GET | /api/cities | City catalog with `data_loaded` / `live` flags |
| GET | /api/lines?city=vienna | Line catalog (Vienna snapshot, or the city's gtfs-mcp export; 404 when no data) |
| GET | /api/stops/major?city=vienna | Major stops (Vienna RBL table, or the city's GTFS stops) |
| GET | /api/departures?rbl=2903&city=vienna | Live OGD departures. **Vienna-only** (501 otherwise) |
| GET | /api/disruptions | Live OGD traffic info (Vienna-only) |
| GET | /api/news | Live OGD news/POIs (Vienna-only) |
| GET | /api/health, /api/status | Liveness + uptime/version |
| GET | /api/skills | Skill list consumed by the Chat UI |
| GET | /api/capabilities | Endpoint inventory of this server |
| GET | /api/v1/diagnostics | Smoke-test surface (routes, versions, errors) |
| GET | /api/llm/providers, /api/llm/models, /api/llm/discover | Local LLM discovery (Ollama, LM Studio) |
| GET | /api/llm/onboarding | Onboarding state for the Settings page |
| POST | /api/llm/chat | Non-streaming LLM proxy (`{provider, model, prompt}`) |
| POST | /api/chat/stream | SSE streaming chat (`{provider, model, prompt}`) |
| GET | /api/fleet/apps | Fleet app launcher list |
| POST | /api/webhooks/inbound | Inbound webhook receiver (fail-closed) |
| POST | /api/shutdown | Stop the backend (guarded) |

## Native map app (`:3079` Docker, `:10722` native)

Serves the Leaflet UI (`/`, `/about`, `/status`, `/analytics`, `/community`, `/line/{name}`) plus:

| Method | Path | Notes |
|---|---|---|
| GET | /api/vehicles | Pseudo-live vehicle markers (schedule-interpolated) |
| GET | /api/lines, /api/lines/{name}, /api/lines/{name}/route, /api/lines/{name}/stations | Line catalog and shapes |
| GET | /api/arrivals, /api/stations, /api/stations?query= | Stops, search |
| GET | /api/stops/nearby | Nearby stops |
| GET | /api/routes | Route variants |
| GET | /api/disruptions, /api/disruptions/summary | Disruptions |
| GET | /api/traffic-info | Raw OGD traffic info |
| GET | /api/cities, /api/cities/{key} | City catalog (same truth as web_sota) |
| GET | /api/status, /api/status/summary, /api/health | Health |
| POST | /api/fleet/launch | Fleet launcher hook |

## Examples (verified against the live backend)

```powershell
# City catalog with data_loaded truth
Invoke-RestMethod http://127.0.0.1:11170/api/cities |
  Select-Object -ExpandProperty cities |
  Select-Object key, name, data_loaded, live

# Vienna lines (live reference snapshot)
Invoke-RestMethod 'http://127.0.0.1:11170/api/lines?city=vienna' |
  Select-Object -ExpandProperty count

# Munich lines without data: honest 404, not an empty map
Invoke-RestMethod 'http://127.0.0.1:11170/api/lines?city=munich'
# -> 404: "No GTFS data for 'munich' yet - load it with gtfs-mcp."

# Live departures need Vienna (RBL stop code); elsewhere: honest 501
Invoke-RestMethod 'http://127.0.0.1:11170/api/departures?rbl=2903&city=vienna' |
  Select-Object -ExpandProperty count
```

## What this doc does not cover

Journey planning, timetables, nearby search and ML predictions live in the
**MCP server** (`frontend/mcp_server/`), not in REST — see
[TOOLS.md](TOOLS.md). The historical `/api/v1/*` paths and API-key auth
described here before 2026-10-24 never existed on either server.
