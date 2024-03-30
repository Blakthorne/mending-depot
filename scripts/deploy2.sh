#! /bin/bash

SRC_DIR=mending-depot

# Remove old source code if there
if [ -d $SRC_DIR ];
then
    sudo rm -r $SRC_DIR
fi

# Clone new repo
git clone git@github.com:Blakthorne/mending-depot.git

# Go into newly cloned source code folder
cd ~/mending-depot

# Take down current running docker container
sudo docker compose down

# Create .env file with variables
touch .env
echo "DATABASE_URL=${DATABASE_URL}" >> .env
echo "DATABASE_PASSWORD=${DATABASE_PASSWORD}" >> .env
echo "URL=${URL}" >> .env

echo "NEXTAUTH_URL=${NEXTAUTH_URL}" >> .env
echo "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}" >> .env

echo "GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}" >> .env
echo "GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}" >> .env

# Build new docker image
sudo docker build --network host -t mending-depot-app:latest .

# Start new docker container
sudo docker compose up