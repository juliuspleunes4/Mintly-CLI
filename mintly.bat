@echo off
REM Mintly CLI Launcher for Windows
REM Double-click this file to start the interactive token creation wizard

cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Run the interactive CLI
node cli.js

REM Keep window open if there was an error
if %ERRORLEVEL% NEQ 0 (
    pause
)
