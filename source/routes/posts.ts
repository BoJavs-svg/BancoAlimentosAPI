/** source/routes/posts.ts */
import express from "express";
import controller from "../controllers/posts";
const router = express.Router();
//User

router.get("/getPosts", controller.getPost);
router.get("/getComments/:postId", controller.getComment);
router.get("/getPollito/:polloId", controller.getPollito);
router.get("/authSessionToken/:sessionToken", controller.authSessionToken);
router.get("/resetPassword", controller.resetPassword);
router.get("/deleteUser", controller.deleteUser);

router.post("/userSignUp", controller.createUser);
router.post("/userLogin", controller.userLogin);
router.post("/post", controller.createPost);
router.post("/comment", controller.createComment);
router.post("/pollo", controller.createPollo);

router.patch("/likePost/:postId/:like", controller.likePost);
router.patch("/likeComment/:commentId/:like", controller.likeComment);
router.patch("/view/:postId", controller.viewPost);
router.patch("/editPost/:postId", controller.editPost);
router.patch("/report/:objId/:type", controller.report);
router.patch("/patchPollito/:polloId", controller.patchPollito);
router.patch("/nextApple/:polloId", controller.nextApplePollito);
router.patch("/nextStagePollito/:polloId", controller.nextStagePollito);
router.patch("/eggPollito/:polloId", controller.eggPollito);

export = router;
