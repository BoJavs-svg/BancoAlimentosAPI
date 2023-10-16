/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import Parse from 'parse/node';
import * as dotenv from 'dotenv';
dotenv.config();

//DB CONNECTION
const appID = process.env.APPLICATION_ID;
const jsKey = process.env.JAVASCRIPT_KEY;
const rest= process.env.REST_API
if (appID && jsKey) {
    Parse.initialize(appID,jsKey,rest);
    Parse.serverURL = 'https://parseapi.back4app.com/';
} else {
    console.log("No Parse error");
}
//USER
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    // Create user in database
    try {
        const { username, password, email, name, nextStage } = req.body;         
        const Pollo=Parse.Object.extend('Pollo');
        const pollo = new Pollo();
        // Set properties for the object
        pollo.set('name', name);
        pollo.set('nextStage', nextStage);
        // Save the object to the database
        await pollo.save();

        // Create a new Parse User object
        const User = Parse.Object.extend('_User');
        const user = new User();

        // Set properties for the User object
        user.set('username', username);
        user.set('password', password);
        user.set('email', email);


        user.set('badges', []); // Initialize badges as an empty array
        user.set('idProfilePicture', 0); // Initialize profile picture ID 0 is starting picture for everyone
        user.set('visBadge', -1); // Initialize visibility badge. -1 means no badges

        // Create a pointer to the Pollo object
        const polloPointer = Pollo.createWithoutData(pollo.id); // 
        user.set('pollo', polloPointer);
        
        // Save the User object to the database
        await user.signUp();

        return res.status(200).json({
            message: 'New object created successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

// Get user by objectId
const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try{
    const{username,password}=req.body
    const user = await Parse.User.logIn(username, password, { usePost: false });
    return res.status(200).json({
        user: user,
    });
    }catch (error) {
        return res.status(500).json({
            message: error,
        });
    }

};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try{
        //Get body from endpoint call
        const { userId, text, title }  = req.body;
        const Post = Parse.Object.extend('Post');
        const post = new Post();

        //Setting Properties for the title and text:
        post.set('text', text);
        post.set('title', title);

        const User = Parse.Object.extend('_User');
        const postPointer = User.createWithoutData(userId);
        
        post.set('userId', postPointer);

        //Save to database
        await post.save();
        
        return res.status(200).json({
            message: 'New post created successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
}

const getPost = async (req: Request, res: Response, next: NextFunction) => {
    try{
        // Create a Query to Post table
        const parseQuery = new Parse.Query('Post');
        // Save objects returned from find query
        let posts: Parse.Object[] = await parseQuery.find();
        return res.status(200).json({
            message: 'Posts retrieved',
            posts: posts,
        });

    } catch(error) {
        return res.status(500).json({
            message: error,
        });
    }
}

//Comments

const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const {userId, postId, text} = req.body;
        const Comment = Parse.Object.extend('Comment');
        const comment = new Comment();

        //Set properties of the object Comment
        comment.set('text', text);

        const User = Parse.Object.extend('_User');
        const commentPointerU = User.createWithoutData(userId);

        const Post = Parse.Object.extend('Post');
        const commentPointerP = Post.createWithoutData(postId);

        comment.set('userId', commentPointerU);
        comment.set('postId', commentPointerP);

        //Save to database
        await comment.save();

        return res.status(200).json({
            message: 'New comment created successfully',
        });

    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
}

const getComment = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const query  = new Parse.Query('Comment');

        let comments: Parse.Object[] = await query.find();
        return res.status(200).json({
            message: 'Comments retrieved',
            comments: comments,
        });

    } catch (error){
        return res.status(500).json({
            message: error,
        });
    }
}

const likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.postId; // Assuming you have a postId parameter in the URL
        const query = new Parse.Query('Post');
        
        // Retrieve the post object based on the postId.
        const post = await query.get(postId);
        if (post) {
            post.increment('nLikes', 1);
            
            const updatedPost = await post.save();
            return res.status(200).json({
                message: 'Post liked successfully',
            });
        } else {
            return res.status(404).json({
                message: 'Post not found',
            });
        }

    } catch (error){
        return res.status(500).json({
            message: error,
        });
    }
}
const viewPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.postId; // Assuming you have a postId parameter in the URL
        const query = new Parse.Query('Post');
        
        // Retrieve the post object based on the postId.
        const post = await query.get(postId);
        if (post) {
            post.increment('nViews', 1);
            
            const updatedPost = await post.save();
            return res.status(200).json({
                message: 'Post viewed successfully',
            });
        } else {
            return res.status(404).json({
                message: 'Post not found',
            });
        }

    } catch (error){
        return res.status(500).json({
            message: error,
        });
    }
}
const editPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.postId; // Assuming you have a postId parameter in the URL
        const {text,title} =req.body;
        const query = new Parse.Query('Post');
        
        // Retrieve the post object based on the postId.
        const post = await query.get(postId);
        if (post) {
            if(text){
                post.set('text',text)
            }
            if(title){
                post.set('title',title)
            }
            const updatedPost = await post.save();
            return res.status(200).json({
                message: 'Post updated successfully',
            });
        } else {
            return res.status(404).json({
                message: 'Post not found',
            });
        }

    } catch (error){
        return res.status(500).json({
            message: error,
        });
    }
}
const reportPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.postId; // Assuming you have a postId parameter in the URL
        const query = new Parse.Query('Post');
        // Retrieve the post object based on the postId.
        const post = await query.get(postId);
        if (post) {
            post.set('reported',true)
            const updatedPost = await post.save();

            const ReportedPost = Parse.Object.extend('ReportedPost');
            const reportedPost = new ReportedPost();

            reportedPost.set('post', post);
            // Save the reported post
            await reportedPost.save();

            return res.status(200).json({
                message: 'Post reported successfully',
            });

        } else {
            return res.status(404).json({
                message: 'Post not found',
            });
        }

    } catch (error){
        return res.status(500).json({
            message: error,
        });
    }
}
export default { createUser ,userLogin, createPost, getPost, createComment, getComment,likePost,viewPost,editPost,reportPost};