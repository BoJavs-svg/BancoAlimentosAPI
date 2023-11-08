/** source/routes/posts.ts */
import express from 'express';
import controller from '../controllers/posts';
const router = express.Router();
//User

router.get('/getPosts', controller.getPost);
router.get('/getComments/:postId', controller.getComment);
router.get('/getPollito/:polloId', controller.getPollito);

router.post('/userSignUp', controller.createUser);
router.post('/userLogin', controller.userLogin);
router.post('/post', controller.createPost);
router.post('/comment', controller.createComment);

router.patch('/like/:postId/:like', controller.likePost);
router.patch('/view/:postId', controller.viewPost);
router.patch('/editPost/:postId',controller.editPost)
router.patch('/report/:postId',controller.reportPost)
router.patch('/patchPollito/:polloId', controller.patchPollito);


export = router;
