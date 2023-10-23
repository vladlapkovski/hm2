import express, {Request, Response, Router} from "express"
import { socialRepository } from "../social-repository-blogs";
import { collection, collectionBlogsType } from '../db';
export const blogsRoutes = Router({}) 
import { ObjectId } from 'mongodb';
import { updateIDBlog } from "../social-repository-blogs"


const auth = "admin:qwerty";
const encodedAuth = Buffer.from(auth).toString("base64");


blogsRoutes.delete("/:blogId", async (req: Request, res: Response) => {

  const blogId = new ObjectId(req.params.blogId);
  
  const index = await collection.findOne({ _id: blogId });
  
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

  if (index) {
    await collection.deleteOne({ _id: blogId });
    return res.status(204).send();
  } else {
    return res.status(404).send()
  }

});
  
  
  
blogsRoutes.post('/', async (req: Request, res: Response) => {
    
  const { name, description, websiteUrl, createdAt, isMembership } = req.body as collectionBlogsType;

  const authHeader = await req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

  const errorsMessages = [];

  // Проверяем, что все обязательные поля заполнены
  if (typeof name !== "string" || !name || name?.trim()?.length == 0 || name?.length > 15) {
    errorsMessages.push({
      message: 'Invalid name', 
      field: "name"
    });
  }

  if (typeof description !== "string" || !description || description?.trim()?.length == 0 || description?.length > 500) {
    errorsMessages.push({
      message: 'Invalid description', 
      field: "description"
    });
  }

  const websiteUrlRegex = new RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');

  if (typeof websiteUrl !== "string" || !websiteUrl || websiteUrl?.length > 100 || !websiteUrlRegex.test(websiteUrl)) {
    errorsMessages.push({
      message: 'Invalid websiteUrl', 
      field: "websiteUrl"
    });
  }


  if (errorsMessages.length > 0) {
    return res.status(400).json({
      errorsMessages
    });
  }

  // Создаем новый блог
  const newBlog = await socialRepository.createBlog(name, description, websiteUrl, createdAt, isMembership);

  // blogs.push(newBlog); // добавляем новый блог в массив

  // Возвращаем созданный блог с кодом 201
  return res.status(201).json(newBlog);

});
  
  
  
blogsRoutes.get('/', async (req: Request, res: Response) => {
  const blog = await socialRepository.getBlogs();
  res.status(200).send(blog); // возвращаем массив всех блогов
});
  
  
blogsRoutes.get('/:id', async (req: Request, res: Response) => {
  const id = new ObjectId(req.params.id);

  const blog = await collection.findOne({ _id: id });

  if (blog) {
    res.status(200).send(blog);
  } else {
    res.sendStatus(404);
  }
});
  
  
  
blogsRoutes.put('/:id', async (req: Request, res: Response) => {

  const id = new ObjectId(req.params.id);

  const { name, description, websiteUrl } = req.body as collectionBlogsType;

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

  const errorsMessages = [];

  const websiteUrlRegex = new RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');

  if (!websiteUrl || websiteUrl.length > 100 || !websiteUrlRegex.test(websiteUrl)) {
    errorsMessages.push({
      message: 'Invalid website URL',
      field: "websiteUrl"
    });
  }

  if (!name || name.trim().length == 0 || name.length > 15) {
    errorsMessages.push({
      message: 'Invalid name',
      field: "name"
    });
  }

  if (!description || description.length > 500) {
    errorsMessages.push({
      message: 'Invalid description',
      field: "description"
    });
  }

  if (errorsMessages.length > 0) {
    return res.status(400).json({
      errorsMessages
    });
  }

  // Обновляем блог по его id
  const updatedBlog = await updateIDBlog.updateBlog(id, name, description, websiteUrl);
  if (!updatedBlog) {
    return res.status(404).send();
  } else {
    return res.status(204).send(updatedBlog);
  }
});
    