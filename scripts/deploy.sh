#! /bin/bash

# Declare variables
DATABASE_URL=$1
DATABASE_PASSWORD=$2
URL=$3

NEXTAUTH_URL=$4
NEXTAUTH_SECRET=$5

GITHUB_CLIENT_ID=$6
GITHUB_CLIENT_SECRET=$7

# Take down current running docker container
sudo docker compose down

# Clone directory onto server if doesn't yet exist
if [ ! -d "mending-depot/"]; then
git clone git@github.com:Blakthorne/mending-depot.git
fi

# Create .env file
cd ~/mending-depot
touch .env
printf "DATABASE_URL="$DATABASE_URL"\n" >> .env
printf "DATABASE_PASSWORD="$DATABASE_PASSWORD"\n" >> .env
printf "URL="$URL"\n" >> .env

printf "NEXTAUTH_URL="$NEXTAUTH_URL"\n" >> .env
printf "NEXTAUTH_SECRET="$NEXTAUTH_SECRET"\n" >> .env

printf "GITHUB_CLIENT_ID="$GITHUB_CLIENT_ID"\n" >> .env
printf "GITHUB_CLIENT_SECRET="$GITHUB_CLIENT_SECRET"\n" >> .env

# Build new docker image
sudo docker build --network host -t mending-depot-app:latest .

# Start new docker container
sudo docker compose up