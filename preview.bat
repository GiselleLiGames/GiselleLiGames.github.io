@echo off
rem Local preview of the site: double-click this file, then close the window to stop.
cd /d "%~dp0"
title GiselleLi site preview - close this window to stop
echo Serving %CD% at http://localhost:8000/portfolio.html
start "" cmd /c "timeout /t 2 >nul & start http://localhost:8000/portfolio.html"
where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server 8000
) else (
  py -m http.server 8000
)
pause
