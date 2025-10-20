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
    echo attention le fichier .env existe déjà !
    echo.
    set /p "overwrite=voulez-vous le remplacer ? (O/N): "
    if /i not "!overwrite!"=="O" (
        echo initialisation annulée par l'utilisateur.
        pause
        exit /b 0
    )
    echo.
    echo sauvegarde de l'ancien fichier .env...
    copy .env .env.backup >nul 2>&1
    if errorlevel 1 (
        echo ERREUR : échec de la création de la sauvegarde du fichier .env !
        pause
        exit /b 1
    )
    echo sauvegarde créée avec succès.
    echo.
)

echo création du fichier .env avec les valeurs par défaut...
echo.

REM Create the .env file with default values
(
echo # =============================================================================
echo # API_RAL Environment Configuration
echo # =============================================================================
echo # Generated on %date% at %time%
echo.
echo # MySQL Database Configuration
echo DB_HOST=
echo DB_USERNAME=
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
set /p "customize=voulez-vous personnaliser les paramètres ? (O/N): "
if /i "!customize!"=="O" (
    echo.
    echo Opening .env file for editing...
    if exist "C:\Program Files\Notepad++\notepad++.exe" (
        start "" "C:\Program Files\Notepad++\notepad++.exe" .env
    ) else if exist "C:\Windows\System32\notepad.exe" (
        start notepad .env
    ) else (
        echo veuillez ouvrir le fichier .env avec votre éditeur de texte préféré.
    )
    echo.
    echo NOTES DE SÉCURITÉ IMPORTANTES :
    echo - changez le JWT_SECRET pour une chaîne aléatoire sécurisée en production
    echo - mettez à jour les identifiants de base de données si vous utilisez une base différente
    echo - ne commitez jamais le fichier .env dans le contrôle de version
    echo - ajoutez .env à votre fichier .gitignore
    echo.
)

echo configuration terminée avec succès !
echo.
echo prochaines étapes :
echo 1. examinez et mettez à jour le fichier .env si nécessaire
echo 2. installez les dépendances : npm install
echo 3. démarrez le serveur : run.bat
echo.
pause