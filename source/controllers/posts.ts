/** source/controllers/posts.ts */
import e, { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import Parse from "parse/node";
import * as dotenv from "dotenv";

import crypto from 'crypto';

dotenv.config();

const algorithm = process.env.ALGORITHM ?? "";
const key : string = process.env.ENCRYPTION_KEY ?? ""; 
const iv = Buffer.from(process.env.IV ?? "", 'hex');

//DB CONNECTION
const appID = process.env.APPLICATION_ID;
const jsKey = process.env.JAVASCRIPT_KEY;
const rest = process.env.REST_API;
if (appID && jsKey) {
  Parse.initialize(appID, jsKey, rest);
  Parse.serverURL = "https://parseapi.back4app.com/";
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

    return res.status(201).json({
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
interface ExtendedUser extends Parse.User {
  sessionToken?: string;
}
const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    console.log(key);
    const user = await Parse.User.logIn(username, password) as ExtendedUser;
    if (user) {
      const sessionToken = user.getSessionToken();
      
      let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
      let encryptedSessionToken = cipher.update(sessionToken, 'utf8', 'hex');
      encryptedSessionToken += cipher.final('hex');

      const nUser = {
        ...user.toJSON(),
        sessionToken: encryptedSessionToken
      };
      
      return res.status(200).json({
        user: nUser,
      });
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
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
) => {///
  try {
    //  decrypt session token
    const sessionToken: string = req.params.auth;
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');

    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(decryptedSessionToken);
    const nUser = {
      ...user.toJSON(),
      sessionToken: sessionToken
    };

    return res.status(200).json({
      user: nUser,
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
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  } 
};

const createPollo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      color,
    }: { name: string; color: number } = req.body;

    let sessionToken: string = req.headers.authorization ?? "";
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');
    sessionToken = decryptedSessionToken;

    const Pollo = Parse.Object.extend("Pollo");
    const pollo: Parse.Object = new Pollo();
    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(sessionToken);
    pollo.set("name", name);
    pollo.set("color", color);

    await pollo.save().then((res) => {
      user.set("pollo", res);
    });

    await user.save();
    return res.status(200).json({
      message: "New pollo created successfully",
      pollo: pollo,
    });
  } catch (error) {
    
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, title }: { text: string; title: string } = req.body;
    const Post = Parse.Object.extend("Post");
    const post = new Post();

    let sessionToken: string = req.headers.authorization ?? "";
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');
    sessionToken = decryptedSessionToken;
    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(sessionToken);

    if (user) {
      post.set("text", text);
      post.set("title", title);
      post.set("userData",[user.get("username"),user.get("colorProfilePicture"),user.get("idProfilePicture"),user.get("visBadge")]);

      await post.save();

    return res.status(200).json({
      message: "New post created successfully",
    });

  }} catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const index:number = parseInt(req.params.index);
    // Create a Query to Post table
    const parseQuery = new Parse.Query("Post");
    // Save objects returned from find query
    let posts: Parse.Object[] = await parseQuery.find();

    let sessionToken: string = req.headers.authorization ?? "";
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');
    sessionToken = decryptedSessionToken;
    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(sessionToken);

    const newPosts = posts.map((post): any => {
      return {
        ...post.toJSON(),
        isliked: post.toJSON().usersLiked.includes(user.id),
      };
    });

    if (newPosts.length - index -20 > 0){
        newPosts.splice(newPosts.length - index - 20, newPosts.length);
    }
    
    return res.status(200).json({
      message: "Posts retrieved",
      posts:newPosts,
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
      postId,
      text,
    }: { postId: string; text: string } = req.body;
    const Comment = Parse.Object.extend("Comment");
    const comment = new Comment();
    
    let sessionToken: string = req.headers.authorization ?? "";
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');
    sessionToken = decryptedSessionToken;
    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(sessionToken);
    if (user){
      comment.set("text", text);
      const Post = Parse.Object.extend("Post");
      const commentPointerP = Post.createWithoutData(postId);
      comment.set("postId", commentPointerP);
      comment.set("userData",[user.get("username"),user.get("colorProfilePicture"),user.get("idProfilePicture"),user.get("visBadge")]);
      await comment.save();

      return res.status(200).json({
        message: "New comment created successfully",
      });
    } else {
      return res.status(400).json({
        message: "User not found",
      });
    }
  } catch (error: any) {
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

      let sessionToken: string = req.headers.authorization ?? "";
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');
    sessionToken = decryptedSessionToken;
      Parse.User.enableUnsafeCurrentUser();
      const user = await Parse.User.become(sessionToken);

      var usersLiked = post.toJSON().usersLiked;

      if (like > 0 && !usersLiked.includes(user.id)) {
        usersLiked.push(user.id);
      } else if (like < 0 && usersLiked.includes(user.id)) {
        const index = usersLiked.indexOf(user.id);
        usersLiked.splice(index, 1);
      }
      post.set("usersLiked", usersLiked);

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
    const objId = req.params.objId;
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
    const pollo = await query.get(polloId);
    if (pollo) {
      pollo.set("nApple", nApple);
      const updatedPollo = await pollo.save();
      return res.status(200).json({
        message: "Pollito changed successfully",
        pollo: updatedPollo,
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

const nextApplePollito = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //
  try {
    //Get body from endpoint call
    const polloId = req.params.polloId;
    const { nextApple } = req.body;
    const query = new Parse.Query("Pollo");

    const pollo = await query.get(polloId);
    if (pollo) {
      pollo.set("nextApple", nextApple);
      const updatedPollo = await pollo.save();
      return res.status(200).json({
        message: "Pollito changed successfully",
        pollo: updatedPollo,
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

const nextStagePollito = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const polloId = req.params.polloId;
    const { nextStage } = req.body;
    const query = new Parse.Query("Pollo");
    const pollo = await query.get(polloId);
    if (pollo) {
      const nextStageRandom = Math.floor(Math.random() * 5) + 2;

      pollo.set("nextStage", nextStage <= 0 ? nextStageRandom : nextStage);
      var updatedPollo = await pollo.save();
      return res.status(200).json({
        message: "Pollito changed successfully",
        pollo: updatedPollo,
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

const eggPollito = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nEggs } = req.body;

    let sessionToken: string = req.headers.authorization ?? "";
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');
    sessionToken = decryptedSessionToken;
    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(sessionToken);

    const query = new Parse.Query("Pollo");
    const pollo = await query.get(user.toJSON().pollo.objectId);

    if (pollo && user) {
      const userBadges: any[] = user.toJSON().badges;
      pollo.set("nEggs", nEggs);
      const updatedPollo = await pollo.save();

      var randombadge = -1;
      while (userBadges.includes(randombadge) || randombadge == -1) {
        randombadge = Math.floor(Math.random() * 28);
      }

      userBadges.push(randombadge);
      user.set("badges", userBadges);
      const updatedUser = await user.save();

      return res.status(200).json({
        message: "Pollito changed successfully",
        pollo: updatedPollo,
        user: updatedUser,
        badge: randombadge,
      });
    } else {
      return res.status(404).json({
        message: "Pollo or user not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// send a email with Cloud code for a password reposition
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await Parse.Cloud.run("resetPassword", { email });
    return res.status(200).json({
      message: 'Email sent successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};


const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let sessionToken: string = req.headers.authorization ?? "";
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');
    sessionToken = decryptedSessionToken;
    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(sessionToken);
    await Parse.User.logOut();
    await user.destroy();
    return res.status(200).json({
      message: "User deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const profileBadge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const badgeIndex = parseInt(req.params.index);
    let sessionToken: string = req.headers.authorization ?? "";
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');
    sessionToken = decryptedSessionToken;
    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(sessionToken);

    if (user) {
      user.set("visBadge", badgeIndex);
      const updatedUser = await user.save();
      return res.status(200).json({
        message: "Badge changed changed successfully",
        user: updatedUser,
      });
    } else {
      return res.status(404).json({
        message: "Badge not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const createBadge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const badge: number = parseInt(req.params.badge);
    let sessionToken: string = req.headers.authorization ?? "";
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');
    sessionToken = decryptedSessionToken;

    Parse.User.enableUnsafeCurrentUser();

    const user = await Parse.User.become(sessionToken);

    if (user) {
      const badges = user.get("badges") || [];
      badges.push(badge);
      user.set("badges", badges);

      const updatedUser = await user.save();
      return res.status(200).json({
        message: "Posts Fetches successfully",
      });
    } else {
      return res.status(400).json({
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const profileChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      colorProfilePicture,
      idProfilePicture,
    }: { colorProfilePicture: number; idProfilePicture: number } = req.body;

    let sessionToken: string = req.headers.authorization ?? "";
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');
    sessionToken = decryptedSessionToken;

    Parse.User.enableUnsafeCurrentUser();

    const user = await Parse.User.become(sessionToken);

    if (user) {
      user.set("colorProfilePicture", colorProfilePicture);
      user.set("idProfilePicture", idProfilePicture);
      const updatedUser = await user.save();
      return res.status(200).json({
        message: "Color preferences saved",
        user: updatedUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getUserPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sessionToken: string = req.headers.authorization ?? "";
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');
    sessionToken = decryptedSessionToken;
    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(sessionToken);

    if (user) {
      const parseQuery = new Parse.Query("Post");
      var posts: Parse.Object[] = await parseQuery.find();
      const userJson = user.toJSON();
      posts = posts.filter(
        (post) => post.toJSON().userData[0] == userJson.username,
      );

      return res.status(200).json({
        message: "Badge changed changed successfully",
        userPosts: posts,
      });
    } else {
      return res.status(404).json({
        message: "Pollo not found",
      });
    }
  } catch (error:any) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const verificationEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await Parse.User.currentAsync();
    if (user) {
      // Call Cloud Function to send email verification
      await Parse.Cloud.run("sendVerificationEmail");
    }
    return res.status(200).json({
      message: 'Email verification request sent successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId; 
    const query = new Parse.Query("Post");
    const commentQuery = new Parse.Query("Comment");

    const post = await query.get(postId);

    if (post) {
      await post.destroy();
      commentQuery.equalTo("postId", post);

      let comments: Parse.Object[] = await commentQuery.find();
      comments.forEach(async (comment) => {
        await comment.destroy();
      });
      return res.status(200).json({
        message: "Post deleted successfully",
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
}
const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = req.params.commentId; 
    const query = new Parse.Query("Comment");
    const comment = await query.get(commentId);

    if (comment) {
      await comment.destroy();
      return res.status(200).json({
        message: "Comment deleted successfully",
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
}

const cerrarSesion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let sessionToken: string = req.headers.authorization ?? "";
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedSessionToken = decipher.update(sessionToken, 'hex', 'utf8');
    decryptedSessionToken += decipher.final('utf8');
    sessionToken = decryptedSessionToken;
    Parse.User.enableUnsafeCurrentUser();
    const user = await Parse.User.become(sessionToken);

    if (user) {
      await Parse.User.logOut();
    }
    return res.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

export default {
  profileChange,
  createBadge,
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
  nextStagePollito,
  getPollito,
  patchPollito,
  eggPollito,
  nextApplePollito,
  likeComment,
  authSessionToken,
  createPollo,
  resetPassword,
  deleteUser,
  profileBadge,
  verificationEmail,
  getUserPosts,
  deletePost,
  deleteComment,
  cerrarSesion,
};
