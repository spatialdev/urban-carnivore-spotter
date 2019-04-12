# Woodland Park Zoo Urban Carnivore Spotter

This project is a Create React App + Firebase project.


### To get started: 
1. Start by `git clone git@github.com:spatialdev/urban-carnivore-spotter.git`
2. Request access to the Seattle Carnivores Firebase account by contacting Savannah, Sayana, or Micah.
3. Run `npm install -g firebase-tools` to install the CLI for Firebase on your machine.
4. Navigate to the project's root directory and `npm i` to install project dependencies.
5. Navigate to the `functions` directory and `npm i` to install Firebase dependencies.
6. Navigate back to the root of the project and run `npm start`. This will kick off the localhost port for development in your preferred browser. Any changes made during development with `npm start` running will show up immediately in the browser.
6. You're now ready to develop!

### To add new 'endpoints':
Note that this project leverages Cloud Functions for all endpoints in the app. As such, to create a new endpoint, you'll need to add to the `functions/index.js` file. Once you have created a new function, you'll need to deploy the function to Firebase by running 'firebase deploy'. This operation should take a minute or two. You may run into some linting errors but once you've successfully deployed you should be able to view active functions [here](https://console.firebase.google.com/u/2/project/seattlecarnivores-edca2/functions/list). As it currently stands, we have endpoints to add a new report, retrieve a single report, and retrieve the collection of reports based on some bounds and a set of filtering parameters.



