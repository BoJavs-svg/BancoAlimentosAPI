## User Management

### Sign Up
- **Endpoint:** `/userSignUp`
- **Method:** POST
- **Description:** Registers a new user.
- **Inputs:**
  - `username` (string)
  - `password` (string)
  - `email` (string)
- **Outputs:**
  - Success: Status 200 with a JSON response indicating successful user creation.
  - Failure: Status 500 with a JSON response for internal server error.

### Login
- **Endpoint:** `/userLogin`
- **Method:** POST
- **Description:** Authenticates a user.
- **Inputs:**
  - `username` (string)
  - `password` (string)
- **Outputs:**
  - Success: Status 200 with a JSON response containing user information.
  - Failure: Status 500 with a JSON response for internal server error.

### Auth Session Token
- **Endpoint:** `/authSessionToken/:sessionToken`
- **Method:** GET
- **Description:** Authenticates a user based on the session token.
- **Inputs:**
  - `sessionToken` (string)
- **Outputs:**
  - Success: Status 200 with a JSON response containing user information.
  - Failure: Status 404 if the user is not found, Status 500 for internal server error.

## Post Management

### Create Post
- **Endpoint:** `/post`
- **Method:** POST
- **Description:** Creates a new post.
- **Inputs:**
  - `sessionToken` (string)
  - `text` (string)
  - `title` (string)
- **Outputs:**
  - Success: Status 200 with a JSON response indicating successful post creation.
  - Failure: Status 500 with a JSON response for internal server error.

### Get Posts
- **Endpoint:** `/getPosts`
- **Method:** GET
- **Description:** Retrieves all posts.
- **Outputs:**
  - Success: Status 200 with a JSON response containing posts.
  - Failure: Status 500 with a JSON response for internal server error.

### Edit Post
- **Endpoint:** `/editPost/:postId`
- **Method:** PATCH
- **Description:** Edits an existing post.
- **Inputs:**
  - `text` (string, optional)
  - `title` (string, optional)
- **Outputs:**
  - Success: Status 200 with a JSON response indicating successful post update.
  - Failure: Status 404 if the post is not found, Status 500 for internal server error.

... (similar documentation for other endpoints)

