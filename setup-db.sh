#!/bin/bash

echo "Starting database setup..."

# Database Configuration
DB_USER="postgres"
DB_HOST="localhost"
DB_NAME="vulndb"
DB_PASSWORD="password"
DB_PORT="5432"

# Export PGPASSWORD so psql doesn't prompt for it manually
export PGPASSWORD=$DB_PASSWORD

# Check if psql is installed
if ! command -v psql &> /dev/null
then
    echo "Error: psql could not be found. Please ensure PostgreSQL client tools are installed."
    exit 1
fi

echo -e "\n[1/2] Checking if database '$DB_NAME' exists..."

# List databases, grab the first column, and check for the exact database name
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "  - Database '$DB_NAME' already exists. Skipping creation."
else
    echo "  - Creating database '$DB_NAME'..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
fi

echo -e "\n[2/2] Running setup.sql against '$DB_NAME'..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f setup.sql

echo -e "\nDatabase setup complete!"
