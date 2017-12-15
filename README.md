# AF Line News API

AF Line News API is a RESTful API which has been developed using Node.js, Express.js, MongoDB and Mongoose.

## Run the Production Deployed API

If you want to run the production deployed API without installing the software onto your computer, open a browser and enter the following url:

`https://afline-news-api.herokuapp.com/`

e.g. `https://afline-news-api.herokuapp.com/api/articles` will return all articles in the database. Please refer to the table below for a list of all available routes

## Installation Instructions

You will need to install Node.js and MongoDB to use the API. 

### Node
Type the command below to check if you already have node installed:

`$ node -v`

If node is already installed the output of the command will display the version (e.g. v7.9.0). If you need to install node please follow link (http://nodejs.org/en/).

### MongoDB
If you need to install MongoDB please follow link (https://docs.mongodb.com/manual/installation/) 

### Install AF Line News API
Please clone the repository https://github.com/tfarrelly01/AFLine-news-api.git

`$ git clone https://github.com/tfarrelly01/AFLine-news-api.git`

To install all dependencies please enter the following commands into the terminal:-

`$ cd AFLine-news-api`
`$ npm install`

Open an additional terminal window and start the MongoDB deamon with the following command - `N.B.` on Ubuntu systems you may need to be superuser

`$ mongod`

Return to your original terminal window and type the following commands:-

`$ npm run seed:dev`
`$ npm run dev` 

Once you have done this, the API will be available on `http://localhost:3000` via your web browser.

The API and all of its endpoints have been fully tested, to run the test suite please enter the following command into the terminal

`$ npm test`

### Routes

| Route |   |
| ------|---|
| `GET /api/topics` | Get all the topics |
| `GET /api/topics/:topic_id/articles` | Return all the articles for a particular topic |
| `GET /api/articles` | Get all the articles |
| `GET /api/articles/:article_id` | Get individual article by id |
| `PUT /api/articles/:article_id` | Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down' e.g. /api/articles/:article_id?vote=up |
| `GET /api/articles/:article_id/comments` | Get all comments for an individual article |
| `POST /api/articles/:article_id/comments` | Add a new comment to an article. This route requires a JSON body with  a comment key and value pair e.g: {"comment": "This is my new comment"} |
| `GET /api/comments` | Get all the comments |
| `GET /api/comments/:comment_id` | Get comment by id |
| `PUT /api/comments/:comment_id` | Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down' e.g. /api/comments/:comment_id?vote=down |
| `DELETE /api/comments/:comment_id` | Deletes a comment |
| `GET /api/users` | Returns a JSON object with all user profile data. |
| `GET /api/users/:username` | Returns a JSON object with the profile data for the specified user. |
