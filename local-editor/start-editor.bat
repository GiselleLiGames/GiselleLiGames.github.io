@echo off
setlocal

node --version >nul 2>nul
if not errorlevel 1 (
  pushd "%~dp0.."
  start "GiselleLi Local Editor Server" cmd /k node local-editor\server.js
  goto open_editor
)

py -3 --version >nul 2>nul
if not errorlevel 1 (
  set "EDITOR_PYTHON=py -3"
  goto start_python_server
)

python --version >nul 2>nul
if not errorlevel 1 (
  set "EDITOR_PYTHON=python"
  goto start_python_server
)

echo Node.js or Python was not found.
echo Install either runtime, then run this file again.
pause
exit /b 1

:start_python_server
pushd "%~dp0.."
start "GiselleLi Local Editor Server" cmd /k %EDITOR_PYTHON% -m http.server 8000

:open_editor
timeout /t 1 /nobreak >nul
start "" "http://localhost:8000/local-editor/?panel=layout"
popd

echo The editor is opening in your browser.
echo Keep the server window open while editing.
endlocal
