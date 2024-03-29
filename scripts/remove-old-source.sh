#! /bin/bash

SRC_DIR=mending-depot

# Remove old source code if there
if [ -d $SRC_DIR ];
then
    sudo rm -r $SRC_DIR
fi