Start postgres docker (first time only): `docker run --name cs484 -e POSTGRES_PASSWORD=jonbhai -d postgres`
login to docker : `docker exec -it cs484 bash`
upgrade to su user: `su - postgres`
launch psql: `psql`
create user: `CREATE USER cs484 PASSWORD 'jonbhai';`
create database with owner : `create database cs484 owner cs484;`
cond