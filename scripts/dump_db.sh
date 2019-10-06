#!/bin/sh

docker run -it --rm postgres:11.5 pg_dump $DATABASE_URL > backup.sql
