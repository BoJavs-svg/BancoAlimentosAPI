## Endpoint Documentation

### 1. Get Posts
- **Endpoint:** `/getPosts`
- **Method:** GET
- **Controller Function:** `controller.getPost`
- **Description:** Retrieves all posts.
- **Inputs:** None
- **Outputs:**
  - Success (Status 200): JSON response with a message and an array of posts.
  - Failure (Status 500): JSON response for internal server error.

### 2. Get Comments
- **Endpoint:** `/getComments/:postId`
- **Method:** GET
- **Controller Function:** `controller.getComment`
- **Description:** Retrieves comments for a specific post.
- **Inputs:**
  - `postId` (string): ID of the post for which comments are requested.
- **Outputs:**
  - Success (Status 200): JSON response with a message and an array of comments.
  - Failure (Status 500): JSON response for internal server error.

### 3. Get Pollito
- **Endpoint:** `/getPollito/:polloId`
- **Method:** GET
- **Controller Function:** `controller.getPollito`
- **Description:** Retrieves information about a specific "Pollo."
- **Inputs:**
  - `polloId` (string): ID of the "Pollo" entity.
- **Outputs:**
  - Success (Status 200): JSON response with a message and information about the "Pollo."
  - Failure (Status 500): JSON response for internal server error.

### 4. Auth Session Token
- **Endpoint:** `/authSessionToken/:sessionToken`
- **Method:** GET
- **Controller Function:** `controller.authSessionToken`
- **Description:** Authenticates a user based on the session token.
- **Inputs:**
  - `sessionToken` (string): User's session token.
- **Outputs:**
  - Success (Status 200): JSON response with a message and user information.
  - Failure (Status 404): JSON response for user not found, Status 500 for internal server error.

### 5. User Sign Up
- **Endpoint:** `/userSignUp`
- **Method:** POST
- **Controller Function:** `controller.createUser`
- **Description:** Registers a new user.
- **Inputs:**
  - `username` (string): User's username.
  - `password` (string): User's password.
  - `email` (string): User's email address.
- **Outputs:**
  - Success (Status 200): JSON response with a message for successful user creation.
  - Failure (Status 500): JSON response for internal server error.

### 6. User Login
- **Endpoint:** `/userLogin`
- **Method:** POST
- **Controller Function:** `controller.userLogin`
- **Description:** Authenticates a user.
- **Inputs:**
  - `username` (string): User's username.
  - `password` (string): User's password.
- **Outputs:**
  - Success (Status 200): JSON response with user information.
  - Failure (Status 500): JSON response for internal server error.

### 7. Create Post
- **Endpoint:** `/post`
- **Method:** POST
- **Controller Function:** `controller.createPost`
- **Description:** Creates a new post.
- **Inputs:**
  - `sessionToken` (string): User's session token.
  - `text` (string): Content of the post.
  - `title` (string): Title of the post.
- **Outputs:**
  - Success (Status 200): JSON response with a message for successful post creation.
  - Failure (Status 500): JSON response for internal server error.

### 8. Create Comment
- **Endpoint:** `/comment`
- **Method:** POST
- **Controller Function:** `controller.createComment`
- **Description:** Creates a new comment on a post.
- **Inputs:**
  - `sessionToken` (string): User's session token.
  - `postId` (string): ID of the post on which the comment is created.
  - `text` (string): Content of the comment.
- **Outputs:**
  - Success (Status 200): JSON response with a message for successful comment creation.
  - Failure (Status 500): JSON response for internal server error.

### 9. Create Pollo
- **Endpoint:** `/pollo`
- **Method:** POST
- **Controller Function:** `controller.createPollo`
- **Description:** Creates a new "Pollo" entity associated with a user.
- **Inputs:**
  - `sessionToken` (string): User's session token.
  - `name` (string): Name of the "Pollo."
- **Outputs:**
  - Success (Status 200): JSON response with a message for successful "Pollo" creation.
  - Failure (Status 500): JSON response for internal server error.

### 10. Like Post
- **Endpoint:** `/likePost/:postId/:like`
- **Method:** PATCH
- **Controller Function:** `controller.likePost`
- **Description:** Likes or unlikes a post.
- **Inputs:**
  - `postId` (string): ID of the post to be liked/unliked.
  - `like` (number, 1 or -1): Indicates whether to like or unlike the post.
- **Outputs:**
  - Success (Status 200): JSON response with a message for successful post like/unlike.
  - Failure (Status 404): JSON response for post not found, Status 500 for internal server error.

### 11. View Post
- **Endpoint:** `/view/:postId`
- **Method:** PATCH
- **Controller Function:** `controller.viewPost`
- **Description:** Increments the view count for a specific post.
- **Inputs:**
  - `postId` (string): ID of the post to be viewed.
- **Outputs:**
  - Success (Status 200): JSON response with a message for successful view increment.
  - Failure (Status 404): JSON response for post not found, Status 500 for internal server error.

### 12. Edit Post
- **Endpoint:** `/editPost/:postId`
- **Method:** PATCH
- **Controller Function:** `controller.editPost`
- **Description:** Edits an existing post.
- **Inputs:**
  - `postId` (string): ID of the post to be edited.
  - `text` (string, optional): New content of the post.
  - `title` (string, optional): New title of the post.
- **Outputs:**
  - Success (Status 200): JSON response with a message for successful post update.
  - Failure (Status 404): JSON response for post not found, Status 500 for internal server error.

### 13. Report
- **Endpoint:** `/report/:postId`
- **Method:** PATCH
- **Controller Function:** `controller.report`
- **Description:** Marks a post as reported and creates a record in the "ReportedPost" class.
- **Inputs:**
  - `postId` (string): ID of the post to be reported.
  - `cause` (string): Cause or reason for reporting.
- **Outputs:**
  - Success (Status 200): JSON response with a message for successful reporting.
  - Failure (Status 404): JSON response for post not found, Status 500 for internal server error.

### 14. Patch Pollito
- **Endpoint:** `/patchPollito/:polloId`
- **Method:** PATCH
- **Controller Function:** `controller.patchPollito`
- **Description:** Updates the "nApple" property of a "Pollo" entity.
- **Inputs:**
  - `polloId` (string): ID of the "Pollo" entity.
  - `nApple` (number): New value for the "nApple" property.
- **Outputs:**
  - Success (Status 200): JSON response with a message for successful "Pollo" update.
  - Failure (Status 404): JSON response for "Pollo" not found, Status 500 for internal server error.
