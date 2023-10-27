import express, {Request, Response, Router} from "express"
import { socialRepository, updateIDPost } from "../social-repository-posts";
import { collection, collectionPostsType, collection1 } from "../db";
import { Collection, ObjectId } from 'mongodb';


export const postsRouter = Router()

const auth = "admin:qwerty";
const encodedAuth = Buffer.from(auth).toString("base64");


postsRouter.get('/', async (req: Request, res: Response) => {
  const post = await socialRepository.getPosts();
  res.status(200).send(post); // возвращаем массив всех блогов
});

postsRouter.get('/:id', async (req: Request, res: Response) => {

  const id = new ObjectId(req.params.id);

  const post = await collection1.findOne({ $or: [{ _id: id }, { id }] }); 

  if (post) {
    const { _id, ...rest } = post;
    res.status(200).send(rest); 
  } else {
    res.sendStatus(404);
  }
});

postsRouter.delete('/:postId', async (req: Request, res: Response) => {

  const postId = new ObjectId(req.params.postId);

  const postIndex = await collection1.findOne({ _id: postId })

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

  if (postIndex) {
    await collection1.deleteOne({ _id: postId });
    return res.status(204).send();
  } else {
    return res.status(404).send()
  }

});


postsRouter.post('/', async (req: Request, res: Response) => {
  
  const { title, shortDescription, content, blogId, blogName, createdAt } = req.body as collectionPostsType;
 
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

    // Проверяем, что все обязательные поля заполнены
  const errorsMessages = [];

  const isValidObjectId = ObjectId.isValid(blogId);

  let blog;
    try {
      blog = await collection.findOne({ _id: new ObjectId(blogId) });
    } catch (error) {
      errorsMessages.push({
        message: 'invalid blogId',
        field: 'blogId'
      });
    }
  
  if (!title || title?.trim()?.length == 0 || title?.length > 30) {
    errorsMessages.push({
      message: 'Invalid title',
      field: 'title'
    });
  }
  if (!shortDescription || shortDescription?.length > 100) {
    errorsMessages.push({
      message: 'Invalid shortDescription',
      field: 'shortDescription'
    });
  }
  if (!content || content?.trim()?.length == 0 || content?.length > 1000) {
    errorsMessages.push({
      message: 'Invalid content',
      field: 'content'
    });
  }
   if (!blogId || !isValidObjectId) {
    errorsMessages.push({
      message: 'Missing required field',
      field: 'blogId'
    });
  }
  if (errorsMessages.length > 0) {
    return res.status(400).json({
      errorsMessages
    });
  } 

  

  // Создаем новый пост
  const newPost = await socialRepository.createPost(title, shortDescription, content, blogId, blogName, createdAt);

  // Возвращаем созданный пост с кодом 201
  return res.status(201).json(newPost);

});


postsRouter.put('/:id', async (req: Request, res: Response) => {
  const id = new ObjectId(req.params.id);
  const { title, shortDescription, content, blogId, blogName } = req.body as collectionPostsType;
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

  const errorsMessages = [];

  const isValidObjectId = ObjectId.isValid(blogId);
  if (!isValidObjectId) {
    errorsMessages.push({
      message: 'Invalid blogId',
      field: 'blogId'
    });
  }

  if (!title || title?.trim()?.length == 0 || title?.length > 30) {
    errorsMessages.push({
      message: 'Invalid title', 
      field: "title"
    });
  }

  if (!shortDescription || shortDescription?.length > 100) {
    errorsMessages.push({
      message: 'Invalid shortDescription', 
      field: "shortDescription"
    });
  }

  if (!content || content?.trim()?.length == 0 || content?.length > 1000) {
    errorsMessages.push({
      message: 'Invalid content', 
      field: "content"
    });
  }

  if (errorsMessages.length > 0) {
    return res.status(400).json({
      errorsMessages
    });
  }

  const updatedPost = await updateIDPost.updatePost(id, title, shortDescription, content, blogId, blogName);

  if (!updatedPost) {
    return res.status(404).send("Post not found");
  } else {
    return res.status(204).send(updatedPost);
  }
});






