#!/bin/sh

psql -h localhost -U postgres < backup.sql
