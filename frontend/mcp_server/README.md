# `mcp_server` package (frontend)

MCP server implementation for **publictransport-mcp** (FastMCP 3.4):
live departures, station search, journey planning, timetables, disruptions,
nearby stops, multi-city support.

- Entry point (Claude Desktop / mcpb): `frontend.mcp_server.server`
  (`mcp.run()` over stdio; the `mcp` object is exported for the FastMCP CLI).
- Tool, prompt and resource counts change often — see the canonical
  [tool reference](../../docs/TOOLS.md) instead of any list here.
- Dev setup, lint, tests: [docs/DEVELOPMENT.md](../../docs/DEVELOPMENT.md).

> Historical note: older revisions of this file referenced FastMCP 2.13 and
> nine tools. Both were true at the time and stale since; the versioned
> truth lives in `pyproject.toml` (`fastmcp>=3.4.4,<4`) and `docs/TOOLS.md`.
