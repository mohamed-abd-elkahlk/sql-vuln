@echo off
echo Starting database setup...

REM Database Configuration
SET DB_USER=postgres
SET DB_HOST=localhost
SET DB_NAME=vulndb
SET DB_PASSWORD=password
SET DB_PORT=5432

REM Set PGPASSWORD so psql doesn't prompt for it manually
SET PGPASSWORD=%DB_PASSWORD%

echo.
echo [1/2] Checking if database '%DB_NAME%' exists...
REM List databases and search for vulndb exactly as a whole word
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -lqt | findstr /i /w /c:"%DB_NAME%" >nul 2>&1

IF %ERRORLEVEL% EQU 0 (
    echo - Database '%DB_NAME%' already exists. Skipping creation.
) ELSE (
    echo - Creating database '%DB_NAME%'...
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "CREATE DATABASE %DB_NAME%;"
)

echo.
echo [2/2] Running setup.sql against '%DB_NAME%'...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f setup.sql

echo.
echo Database setup complete!
pause
