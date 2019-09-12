# Rest API Techdegree Project 9
A Rest API to create users and create, retrieve, update and delete courses.

## Getting Started
Once the repository is downloaded, open the project files in your terminal and run `npm install` to install the project dependencies. Then run  `npm run seed` to populate the database. Finally start the server with `npm start`. This API is currently only on the backend and requires the use of Postman. Postman can be downloaded at https://www.getpostman.com/

## Creating Users
You can create a user by sending a POST request to `/api/users` with the following mandatory fields in JSON:
* `firstName`
* `lastName`
* `email` - Must be a valid email address
* `password`

## Retrieving Current User
The current user can be retrieved by sending a GET request to `/api/users`. This requires a login with the user credentials for the User you want to view.

## Retrieving Courses
A list of the courses can be retrieved by sending a GET request to `/api/courses`

## Retrieving Specific Courses
A specific course can be retrieved by sending a GET request to `/api/courses/:id` with the `id` parameter being the id property of the course you want to retrieve.

## Creating a Course
A course can be created by sending a POST request to `/api/courses`. This action requires a login and the following properties in JSON.
* `title` - Required
* `description` - Required
* `estimatedTime`
* `materialsNeeded`
* `userId` - Required

## Updating a Course
A course can be updated by sending a PUT request to `/api/courses/:id` with id being the id property of the course you wish to update. This action requires a login and the following properties in JSON
* `title` - Required
* `description` - Required
* `estimatedTime`
* `materialsNeeded`
* `userId` - Required

## Deleting a Course
A course can be deleted by sending a DELETE request to `/api/courses/:id` with id being the id property of the course you wish to delete. Be warned that deletion is permanent.
