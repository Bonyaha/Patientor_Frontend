# Patientor - frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`

Install the project dependencies.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

[React TypeScript cheetseat](https://react-typescript-cheatsheet.netlify.app/)

## Explanation of code

In the line void axios.get<void>(${apiBaseUrl}/ping) in App.tsx, both instances of void have different purposes:

    The first void: This is used to indicate that the function call axios.get<void>(...) doesn't return a value (i.e., its return value is void). It's saying that the result of the axios.get call is being intentionally ignored.

    The second <void>: This is a TypeScript generic type parameter. It's used to specify the expected type of the response data when making an HTTP request using Axios. In this case, it's telling TypeScript that the response from the GET request is expected to have no data (i.e., it's void).