Below are the steps to run the project locally:
- `sudo docker images` (to list all the images)
- `sudo docker ps -a` (to list all the containers)
- `sudo docker pull mongo` (to pull the mongo image)
- `sudo docker run -d -p 27017:27017 --name mongo_container mongo` (to run the mongo container, mapping the port 27017 of the container to the port 27017 of the host is important) 
- `cd backend`
- `node populatedb.js` (fill the mongo container with data)
- `npm start` (start the backend server)
- `cd ../frontend`
- `npm start` (start the frontend server)

These steps won't start the docker container for frontend and backend for easy debugging.