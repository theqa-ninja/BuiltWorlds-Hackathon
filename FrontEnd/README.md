# builtworlds-hackathon FrontEnd

> A Vue.js project

## Running Locally
``` bash
cd ./FrontEnd/
npm install
npm run build
npm run localstart
```
Should now be up at http://localhost:5000/

## Local DB setup steps
``` bash
# check your database list
psql -c "\list"

# if failure on failure of no db, run this first
psql -d template1
>CREATE DATABASE <hostname>
>\q
# now you should be able to run commands

# create the user
psql -c "CREATE USER bwhacker WITH PASSWORD 'QArocks';"

# grant the user perms
psql -c "ALTER USER bwhacker WITH SUPERUSER;"

# check user is made with perms
psql -c "\du"

# make sure databases are created
psql -c "\list"

./node_modules/.bin/sequelize db:create
./node_modules/.bin/sequelize db:migrate
```

## Useful db commands
``` bash
# undo last migrate
./node_modules/.bin/sequelize db:migrate:undo

# undo all migrates
./node_modules/.bin/sequelize db:migrate:undo:all

# seed data
./node_modules/.bin/sequelize db:seed:all

# helpful check for tables in the db
psql -c "\dt" -d bwhack_dev

# to create a new model
./node_modules/.bin/sequelize model:generate --name images --attributes filename:string,path:string
```

## Build Setup
this stuff was put in by vue, just leaving it behind

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
