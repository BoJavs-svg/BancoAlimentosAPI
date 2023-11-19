/** source/routes/posts.ts */
import express from "express";
import controller from "../controllers/posts";
const router = express.Router();
//User
router.post("/userSignUp", controller.createUser); //
router.get("/authSessionToken/:sessionToken", controller.authSessionToken); //
router.post("/userLogin", controller.userLogin); //
router.patch("/profileBadge/:index", controller.profileBadge); //
router.get("/resetPassword", controller.resetPassword); //
router.get("/deleteUser", controller.deleteUser); //
router.patch("/profileBadge/:index", controller.profileBadge);
router.patch("/badgeCreate/:badge", controller.createBadge);
router.patch("/editarPerfil/", controller.editarPerfil);
router.get("/getUserPosts", controller.getUserPosts);

//Post
router.post("/post", controller.createPost); //
router.get("/getPosts", controller.getPost); //
router.patch("/likePost/:postId/:like", controller.likePost); //
router.patch("/view/:postId", controller.viewPost); //
router.patch("/editPost/:postId", controller.editPost); //
router.patch("/report/:objId/:type", controller.report); //
// router.patch("/deletePost/:postId", controller.deletePost);

//Comment
router.post("/comment", controller.createComment);
router.get("/getComments/:postId", controller.getComment);
router.patch("/likeComment/:commentId/:like", controller.likeComment);
// router.patch("/deleteComment/:commentId", controller.deleteComment);

//Pollo
router.get("/getPollito/:polloId", controller.getPollito);
router.post("/pollo", controller.createPollo);
router.patch("/patchPollito/:polloId", controller.patchPollito);
router.patch("/nextApple/:polloId", controller.nextApplePollito);
router.patch("/nextStagePollito/:polloId", controller.nextStagePollito);
router.patch("/eggPollito", controller.eggPollito);

// router.patch("/deletePollito/:polloId", controller.deletePollito);

export = router;
