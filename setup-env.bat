@echo off
REM =============================================================================
REM API_RAL Environment Setup Script
REM =============================================================================
REM This script creates and configures the .env file for the API_RAL project
REM Author: Auto-generated setup script
REM Date: October 17, 2025
REM =============================================================================

echo.
echo ===============================================
echo    API_RAL Environment Setup Script
echo ===============================================
echo.

REM Check if .env file already exists
if exist .env (
    echo WARNING: .env file already exists!
    echo.
    set /p "overwrite=Do you want to overwrite it? (y/N): "
    if /i not "!overwrite!"=="y" (
        echo Setup cancelled. Existing .env file preserved.
        pause
        exit /b 0
    )
    echo.
    echo Backing up existing .env to .env.backup...
    copy .env .env.backup >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Failed to backup existing .env file!
        pause
        exit /b 1
    )
    echo Backup created successfully.
    echo.
)

echo Creating .env file with default configuration...
echo.

REM Create the .env file with default values
(
echo # =============================================================================
echo # API_RAL Environment Configuration
echo # =============================================================================
echo # Generated on %date% at %time%
echo.
echo # MySQL Database Configuration
echo DB_HOST=ca664385-001.eu.clouddb.ovh.net
echo DB_USERNAME=Alan
echo DB_PORT=
echo DB_DATABASE=
echo DB_PASSWORD=
echo.
echo # API Configuration
echo API_PORT=
echo.
echo # JWT Configuration
echo JWT_SECRET=
echo JWT_EXPIRES_IN=
echo.
echo # Bcrypt Configuration
echo BCRYPT_SALT_ROUNDS=
echo.
echo # Connection command:
) > .env

if errorlevel 1 (
    echo ERROR: Failed to create .env file!
    pause
    exit /b 1
)

echo ✓ .env file created successfully!
echo.
echo ===============================================
echo Configuration Summary:
echo ===============================================
echo Database Host:
echo Database Name:
echo Database User:
echo Database Port:
echo API Port:
echo JWT Expiration:
echo Bcrypt Salt Rounds:
echo ===============================================
echo.

REM Ask if user wants to customize the configuration
set /p "customize=Do you want to customize any settings? (y/N): "
if /i "!customize!"=="y" (
    echo.
    echo Opening .env file for editing...
    if exist "C:\Program Files\Notepad++\notepad++.exe" (
        start "" "C:\Program Files\Notepad++\notepad++.exe" .env
    ) else if exist "C:\Windows\System32\notepad.exe" (
        start notepad .env
    ) else (
        echo Please edit the .env file manually with your preferred text editor.
    )
    echo.
    echo IMPORTANT SECURITY NOTES:
    echo - Change the JWT_SECRET to a secure random string in production
    echo - Update database credentials if using a different database
    echo - Never commit the .env file to version control
    echo - Add .env to your .gitignore file
    echo.
)

echo Setup completed successfully!
echo.
echo Next steps:
echo 1. Review and update the .env file if needed
echo 2. Install dependencies: npm install
echo 3. Start the server: npm start
echo.
pause