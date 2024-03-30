#! /bin/bash

# Go into newly cloned source code folder
cd ~/mending-depot

# Take down current running docker container
sudo docker compose down

# Build new docker image
sudo docker build --network host -t mending-depot-app:latest .

# Start new docker container
sudo docker compose up --detach