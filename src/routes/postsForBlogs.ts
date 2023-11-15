import express, {Request, Response, Router} from "express"
import { getIDBlog, socialRepository} from "../social-repository-blogs";
import { socialRepositoryForPostsInBlogs } from "../social-repositoryForPostsInBlogs"
import { collection, collectionBlogsType, collectionPostsType } from '../db';
export const postsForBlogsRoutes = Router({}) 
import { ObjectId } from 'mongodb';
import { updateIDBlog } from "../social-repository-blogs"


const auth = "admin:qwerty";
const encodedAuth = Buffer.from(auth).toString("base64");

postsForBlogsRoutes.post('/blogs/:blogId/posts', async (req: Request, res: Response) => {
    const { title, shortDescription, content, blogName, createdAt } = req.body as collectionPostsType;

    const blogId = req.params.blogId;
    
    const authHeader = req.headers.authorization;
  
    if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
      return res.status(401).send();
    }
  
  
    let blog;
    try {
      blog = await collection.findOne({ _id: new ObjectId(blogId) });
    } catch (error) {
      return res.status(404).json({
        message: 'Invalid blogId',
        field: 'blogId'
      });
    }
  
    if (typeof blog !== "object" || !blog) {
      return res.status(400).json({
        message: 'Invalid blogId',
        field: 'blogId'
      });
    }
  
    const errorsMessages = [];
    if (!title || title.trim().length == 0 || title.length > 30) {
      errorsMessages.push({
        message: 'Invalid title',
        field: 'title'
      });
    }
    if (!shortDescription || shortDescription.length > 100) {
      errorsMessages.push({
        message: 'Invalid shortDescription',
        field: 'shortDescription'
      });
    }
    if (!content || content.trim().length == 0 || content.length > 1000) {
      errorsMessages.push({
        message: 'Invalid content',
        field: 'content'
      });
    }
    
    if (errorsMessages.length > 0) {
      return res.status(400).json({
        errorsMessages
      });
    } 
  
  
    const newPost = await socialRepositoryForPostsInBlogs.createPostInBlogs(title, shortDescription, content, blogId, blogName, createdAt);
  
   
    return res.status(201).json(newPost);
  });
  
  
  postsForBlogsRoutes.get('/blogs/:blogId/posts', async (req: Request, res: Response) => {
    const blogId = req.params.blogId;
    let blog;
    try {
      blog = await collection.findOne({ _id: new ObjectId(blogId) });
    } catch (error) {
      return res.status(404).json({
        message: 'Invalid blogId',
        field: 'blogId'
      });
    }

    const post = await socialRepositoryForPostsInBlogs.getPostsInBlogs();
    return res.status(200).send(post); // возвращаем массив всех блогов
  });