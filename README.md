# Call Center Manager Web App

## Frontend
In the frontend, I used [React](https://reactjs.org/docs/create-a-new-react-app.html) styled with [material-ui](https://material-ui.com/).
All the app provides is a table that displays specific real-time socket.io data.
You can run the following comamnds in the `/client` folder to start the front end.

### `npm start`
Runs the app in development mode.
Open http://localhost:8080 to view it in the browser.

### `npm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Backend
The backend is an [Express](https://expressjs.com/) api which creates a socket.io websocket for the front end to connect to.
The data being sent over is from a Kafka topic produced in a machine learning demo [here](https://github.com/Gkrumbach07/docker-py-kaldi-asr).
To consume the Kafka topic, I used [kafka-node](https://www.npmjs.com/package/kafka-node).

### `npm start`
Runs the api in development mode.
Open http://0.0.0.0:8080 to view it in the browser.
If you are running this on your local machine

## Deploy to OpenShift 4.x
For both frontend and backend you can follow the same steps to get the image built.
1. Naviagte to the Add+ menu in the OpenShift and select the "from Git" option.
2. Paste the git url into the "Git Repo URL" line.
3. In advanced options, make sure to set the "Context Dir" to either "/client" or "/api" depending on what you are builing.
4. Select the Node.js builder image and verify that create route is selected.
5. Create the build!

### Linking
Now we need to link the two together using environment variables.
#### In the client
1. Navigate to the build config for the cleint.
2. Under the Environment tab, add a new variable called `REACT_APP_BACKEND_ENDPOINT`.
3. Set the value to the the route of the backend server. This can be founf in Routes > { your backend route } > location.
It will look something like this `http://{ host name } :80`. NOTE: remember to have a port `:80` so it routes correctly.

#### In the backend
1. Navigate to the build config for the backend.
2. Under the Environment tab, add two new variables called `KAFKA_HOST` and `KAFKA_TOPIC`.
3. You can find the host value in the kafka broker service. The value is equal to the name of that service. You do not need to include the port. ex) `odh-message-bus-kafka-brokers`.
4. The topic can be whatever you ended up naming the topic in your Kafak producer. If you are following the ML demo, then use this topic: `sentiment-text`.
