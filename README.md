
# Mongo DB server

## Create the server for the first time

sudo docker build -t mobil_webshop_mongo_image .

sudo docker run -it --name mobil_webshop_mongo_container -p 6000:27017 mobil_webshop_mongo_image

sudo docker start mobil_webshop_mongo_container

## Restart after stop

sudo docker restart mobil_webshop_mongo_container

# Server

cd server

npm install

npm run build

npm run start

# Client

cd client

npm install

ng serve

# Initialize database

Visit http://localhost:4200/init to initialize the database.

### Admin access:

E-Mail: admin@mobilwebshop.com

Password: admin

### User access:

E-Mail: ivan@test.com

Password: password
