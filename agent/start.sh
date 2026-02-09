#!/bin/bash
echo "=== Starting RFP.quest Agent ==="
echo "PORT: $PORT"
echo "PWD: $(pwd)"
echo "Files: $(ls -la)"
echo "Python: $(python --version)"
echo "=== Starting uvicorn ==="
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info
