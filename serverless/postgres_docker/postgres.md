Install docker, docker-compose 
Navigate to this folder and run `docker build -t custm_cs484 .`
docker image will be created
run `docker-compose up -d`
login to docker container using `docker exec -it bash cs484`
within container run `cd docker-entrypoint-initdb.d`
run ` psql -U cs484 -d cs484 -a -f create_tables.sql`
