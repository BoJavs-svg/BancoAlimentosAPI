/** source/routes/posts.ts */
import express from "express";
import controller from "../controllers/posts";
const router = express.Router();
//User

router.get("/getPosts", controller.getPost); //
router.get("/getComments/:postId", controller.getComment);//
router.get("/getPollito/:polloId", controller.getPollito);//
router.get("/authSessionToken/:sessionToken", controller.authSessionToken);

router.post('/userSignUp', controller.createUser); //bien
router.post('/userLogin', controller.userLogin); //bien
router.post('/post', controller.createPost); //bien
router.post('/comment', controller.createComment); //bien
router.post('/pollo', controller.createPollo); 

router.patch('/likePost/:postId/:like', controller.likePost);
router.patch('/likeComment/:commentId/:like', controller.likeComment);
router.patch('/view/:postId', controller.viewPost);
router.patch('/editPost/:postId',controller.editPost)
router.patch('/report/:postId',controller.report)
router.patch('/patchPollito/:polloId', controller.patchPollito);

export = router;
