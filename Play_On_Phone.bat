@echo off
title Tug of Math - Mobile Phone Server (DO NOT CLOSE THIS WINDOW)
cd /d "%~dp0"
cls
echo ======================================================================
echo           TUG OF MATH - MOBILE PHONE SERVER
echo ======================================================================
echo.
echo [*] Starting game server and generating phone QR code...
echo [*] KEEP THIS WINDOW OPEN while playing on your phone!
echo.
node serve.js
if %errorlevel% neq 0 (
    echo.
    echo Node.js is required to host the game on phone.
    echo Please ensure Node.js is installed on your computer.
    echo.
    pause
)
