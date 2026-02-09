# RFP.quest Agent

FastAPI backend with CopilotKit integration for UK tender analysis.

## Development

```bash
uv run uvicorn main:app --reload --port 8000
```

## Endpoints

- `GET /health` - Health check
- `GET /` - Service info
- `POST /copilotkit` - CopilotKit endpoint
