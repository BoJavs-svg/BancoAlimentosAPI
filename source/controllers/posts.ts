/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import Parse from "parse/node";
import * as dotenv from "dotenv";
dotenv.config();

//DB CONNECTION
const appID = process.env.APPLICATION_ID;
const jsKey = process.env.JAVASCRIPT_KEY;
const rest = process.env.REST_API;

if (appID && jsKey) {
  Parse.initialize(appID, jsKey, rest);
  Parse.serverURL = "https://parseapi.back4app.com/";
} else {
  console.log("No Parse error");
}
//USER
interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  name: string;
  nextStage: number;
}

const createUser = async (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email } = req.body;
    const User = Parse.Object.extend("_User");
    const user = new User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);
    await user.signUp();

    return res.status(200).json({
      message: "New object created successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
interface UserLoginRequest {
  username: string;
  password: string;
}

const userLogin = async (
  req: Request<{}, {}, UserLoginRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const user = await Parse.User.logIn(username, password);
    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const authSessionToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken: string = req.params.sessionToken;
    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(sessionToken);
    return res.status(200).json({
      user,
    });
  } catch (error) {
    if (
      error instanceof Parse.Error &&
      error.code === Parse.Error.OBJECT_NOT_FOUND
    ) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    } else {
      console.error(
        "Error durante la autenticación con token de sesión:",
        error
      );
      return res.status(500).json({
        message: "Internal Server Error",
        error: error,
      });
    }
  } finally {
    Parse.User.disableUnsafeCurrentUser();
  }
};

const createPollo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      sessionToken,
      name,
      color,
    }: { sessionToken: string; name: string; color: number } = req.body;
    const Pollo = Parse.Object.extend("Pollo");
    const pollo: Parse.Object = new Pollo();
    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(sessionToken);
    pollo.set("name", name);
    pollo.set("color", color);

    const polloPointer = Pollo.createWithoutData(pollo.id);
    user.set("pollo", polloPointer);

    await user.save();
    await pollo.save();
    return res.status(200).json({
      message: "New pollo created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      sessionToken,
      text,
      title,
    }: { sessionToken: string; text: string; title: string } = req.body;
    const Post = Parse.Object.extend("Post");
    const post = new Post();

    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(sessionToken);
    post.set("text", text);
    post.set("title", title);

    post.set("username", user.get("username"));
    post.set("idProfilePicture", user.get("idProfilePicture"));
    await post.save();

    return res.status(200).json({
      message: "New post created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Create a Query to Post table
    const parseQuery = new Parse.Query("Post");
    // Save objects returned from find query
    let posts: Parse.Object[] = await parseQuery.find();
    return res.status(200).json({
      message: "Posts retrieved",
      posts: posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      sessionToken,
      postId,
      text,
    }: { sessionToken: string; postId: string; text: string } = req.body;
    const Comment = Parse.Object.extend("Comment");
    const comment = new Comment();

    const user = await Parse.User.become(sessionToken);
    //Set properties of the object Comment
    comment.set("text", text);

    const Post = Parse.Object.extend("Post");
    const commentPointerP = Post.createWithoutData(postId);

    comment.set("username", user.get("username"));
    comment.set("idProfilePicture", user.get("idProfilePicture"));
    comment.set("postId", commentPointerP);

    await comment.save();

    return res.status(200).json({
      message: "New comment created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId: string = req.params.postId;
    const Comment = Parse.Object.extend("Comment");
    const query = new Parse.Query(Comment);
    const queryPost = new Parse.Query("Post");
    const Post = await queryPost.get(postId);

    query.equalTo("postId", Post);
    let comments: Parse.Object[] = await query.find();
    return res.status(200).json({
      message: "Comments retrieved",
      comments: comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId: string = req.params.postId;
    const like: number = parseInt(req.params.like);
    const query = new Parse.Query("Post");

    // Retrieve the post object based on the postId.
    const post = await query.get(postId);
    if (post) {
      post.increment("nLikes", like);

      const updatedPost = await post.save();
      return res.status(200).json({
        message: "Post liked successfully",
      });
    } else {
      return res.status(404).json({
        message: "Post not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const likeComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = req.params.commentId;
    const like = parseInt(req.params.like);
    const query = new Parse.Query("Comment");

    // Retrieve the post object based on the postId.
    const post = await query.get(commentId);
    if (post) {
      post.increment("nLikes", like);

      const updatedComment = await post.save();
      return res.status(200).json({
        message: "Comment liked successfully",
      });
    } else {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const viewPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId; // Assuming you have a postId parameter in the URL
    const query = new Parse.Query("Post");

    // Retrieve the post object based on the postId.
    const post = await query.get(postId);
    if (post) {
      post.increment("nViews", 1);

      const updatedPost = await post.save();
      return res.status(200).json({
        message: "Post viewed successfully",
      });
    } else {
      return res.status(404).json({
        message: "Post not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const editPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId; // Assuming you have a postId parameter in the URL
    const { text, title } = req.body;
    const query = new Parse.Query("Post");

    // Retrieve the post object based on the postId.
    const post = await query.get(postId);
    if (post) {
      if (text) {
        post.set("text", text);
      }
      if (title) {
        post.set("title", title);
      }
      const updatedPost = await post.save();
      return res.status(200).json({
        message: "Post updated successfully",
      });
    } else {
      return res.status(404).json({
        message: "Post not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const report = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cause } = req.body;
    const objId = req.params.objtId;
    const type = parseInt(req.params.type);
    let query;
    if (type == 0) {
      query = new Parse.Query("Post");
    } else if (type == 1) {
      query = new Parse.Query("Comment");
    } else {
      return res.status(404).json({
        message: "Type not found",
      });
    }
    const obj = await query.get(objId);
    if (obj) {
      obj.set("reported", true);
      const updatedPost = await obj.save();

      const ReportedPost = Parse.Object.extend("ReportedPost");
      const reportedPost = new ReportedPost();
      if (type == 0) {
        reportedPost.set("post", obj);
      } else if (type == 1) {
        reportedPost.set("comment", obj);
      }
      reportedPost.set("cause", cause);
      await reportedPost.save();
      return res.status(200).json({
        message: "Reported successfully",
      });
    } else {
      return res.status(404).json({
        message: "Object not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const reportPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId: string = req.params.postId; // Assuming you have a postId parameter in the URL
    const query = new Parse.Query("Post");
    // Retrieve the post object based on the postId.
    const post = await query.get(postId);
    if (post) {
      post.set("reported", true);
      const updatedPost = await post.save();

      const ReportedPost = Parse.Object.extend("ReportedPost");
      const reportedPost = new ReportedPost();

      reportedPost.set("post", post);
      // Save the reported post
      await reportedPost.save();

      return res.status(200).json({
        message: "Post reported successfully",
      });
    } else {
      return res.status(404).json({
        message: "Post not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getPollito = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const polloId: string = req.params.polloId; //

    const query = new Parse.Query("Pollo"); //Pollo
    const pollito = await query.get(polloId);
    return res.status(200).json({
      message: "Pollo received",
      pollo: pollito,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const patchPollito = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //
  try {
    //Get body from endpoint call
    const polloId = req.params.polloId;
    const { nApple } = req.body;
    const query = new Parse.Query("Pollo");
    console.log("Get");
    const pollo = await query.get(polloId);
    if (pollo) {
      pollo.set("nApple", nApple);
      const updatedPollo = await pollo.save();
      return res.status(200).json({
        message: "Pollito changed successfully",
      });
    } else {
      return res.status(404).json({
        message: "Pollo not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export default {
  createUser,
  userLogin,
  createPost,
  getPost,
  createComment,
  getComment,
  likePost,
  viewPost,
  editPost,
  report,
  getPollito,
  patchPollito,
  likeComment,
  authSessionToken,
  createPollo,
};
