# BuiltWorlds-Hackathon

## Goal
* remove extra images from a set of images

## Things To Do
* [x] set up github repo
* [x] set up heroku for auto deploy from master
* [x] set up google vision analysis (postman)
* [x] set up microsoft vision analysis (postman)
* [ ] set up postgres DB
* [ ] BIM360 integration (aaron)
* [ ] Clustering (Yumo)
* [ ] extracting exif aka gps (Daniel)
* [ ] website front end for image elimination (Sue)
* [ ] saving / loading data from DB
* [ ] node integration with postgres data
* [ ] use all the things


## Heroku notes
create DB `heroku addons:create heroku-postgresql -a builtworldhack`
reset the DB `heroku pg:reset -a builtworldhack`
migrate the DB `heroku run rake db:migrate -a builtworldhack`
seed the DB `heroku run rake db:seed -a builtworldhack`