import express, {Request, Response, Router} from "express"
import { blogs } from "./blogs";

export const postsRouter = Router()

const auth = "admin:qwerty";
const encodedAuth = Buffer.from(auth).toString("base64");

interface Post {

  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;

}
  
export const posts: Post[] = [

  {

    id: "1",
    title: "My life",
    shortDescription: "Fanta",
    content: "ужастик",
    blogId: "12",
    blogName: "поскорее бы это закончилось"

  },

  {

    id: "2",
    title: "axe",
    shortDescription: "геймплэй",
    content: "игры",
    blogId: "22",
    blogName: "dota"
    
  }

];

postsRouter.get('/', (req: Request, res: Response) => {
  res.status(200).send(posts); // возвращаем массив всех блогов
});

postsRouter.get('/:id', (req: Request, res: Response) => {

  const id = req.params.id;

  const post = posts.find((post) => post.id === id); 

  if (post) {
    res.status(200).send(post); 
  } else {
    res.sendStatus(404);
  }
});

postsRouter.delete('/:id', (req: Request, res: Response) => {

  const postId = req.params.id;

  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex === -1) {
    return res.status(404)
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }
  
  posts.splice(postIndex, 1);

  return res.status(204).send();

});


postsRouter.post('/', (req: Request, res: Response) => {
  
  const { title, shortDescription, content, blogId } = req.body as Post;
 
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

    // Проверяем, что все обязательные поля заполнены
  if (!title || !shortDescription || !content || !blogId) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Missing required fields', 
          field: "title or shortDescription or content or blogId"
        }
      ]
    });
  }

  // Проверяем, что поля соответствуют критериям
  if (title.length > 30) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Title is too long', 
          field: "title"
        }
      ]
    });
  }
  

  if (shortDescription.length > 100) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'shortDescription is too long', 
          field: "shortDescription"
        }
      ]
    });
  }
  

  if (content.length > 1000) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'content is too long', 
          field: "content"
        }
      ]
    });
  }
  

  const blog = blogs.find((blog) => blog.id === blogId);

  if (!blog) {
    return res.status(404).send()
  }
    

  // Создаем новый пост
  const newPost: Post = { 

    id: String(posts.length + 1), 
    title, 
    shortDescription, 
    content, 
    blogId, 
    blogName: blog.name 

  }; 

  posts.push(newPost); // добавляем новый пост в массив

  // Возвращаем созданный пост с кодом 201
  return res.status(201).send(newPost);

});


postsRouter.put('/:id', (req: Request, res: Response) => {

  const postId = req.params.id;

  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex === -1) {
    return res.status(404).send()
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

  const { title, shortDescription, content, blogId } = req.body as Post;

  // Validate the input fields
  if (!title || title.length > 30) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid title', 
          field: "title"
        }
      ]
    });
  }

  if (!shortDescription || shortDescription.length > 100) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid shortDescription', 
          field: "shortDescription"
        }
      ]
    });
  }

  if (!content || content.length > 1000) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid content', 
          field: "content"
        }
      ]
    });
  }

  if (!blogId) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Blog not found', 
          field: "blogId"
        }
      ]
    });
  }

  const blog = blogs.find((blog) => blog.id === blogId);

  if (!blog) {
    return res.status(404).send()
  }

  const updatedPost = {

    id: postId,
    title,
    shortDescription,
    content,
    blogId,
    blogName: posts[postIndex].blogName

  };

  posts.splice(postIndex, 1, updatedPost);

  return res.status(204).send()

});






