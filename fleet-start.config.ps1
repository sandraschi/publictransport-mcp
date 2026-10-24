# Per-repo fleet start config for publictransport-mcp
# Edit ports/backend target here - start.ps1 is fleet-standard.
@{
    Name           = 'publictransport-mcp'
    BackendPort    = 11170
    FrontendPort   = 10896
    HealthPath     = '/health'
    WebRoot        = 'web_sota'
    PreStartScript = 'start-map.ps1'
    PreStartArgs   = @('-Headless', '-NoBrowser')
    Backend = @{
        Kind          = 'uvicorn'
        UvicornTarget = 'web_sota.backend.server:app'
        SyncExtras    = @('dev')
        SyncOnStart   = $true
        Env           = @{ WEB_PORT = '11170' }
    }
    Frontend = @{
        Kind           = 'vite-npm'
        PackageManager = 'npm'
        PortEnvVar     = 'VITE_PORT'
        ApiTargetEnv   = 'VITE_API_TARGET'
    }
}
