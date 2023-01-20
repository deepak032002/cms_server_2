#!/bin/sh

echo Enter id of process?
read ID

pm2 stop $ID && pm2 delete $ID

echo Enter Process Name?
read $PROCESS_NAME

echo Enter command name?
read $COMMAND_NAME

pm2 start yarn --name $PROCESS_NAME -- $COMMAND_NAME

echo Start Successfully :)
