@echo off
cd /d "%~dp0"
echo Open http://127.0.0.1:5173 in your browser.
echo Keep this window open while testing. Press Ctrl+C to stop.
node server.mjs
pause
