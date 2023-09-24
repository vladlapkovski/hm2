import express, {Request, Response, Router} from "express"
export const blogsRoutes = Router({})

const auth = "admin:qwerty";
const encodedAuth = Buffer.from(auth).toString("base64");

interface Blog {

  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  
}


export const blogs: Blog[] = [

  {

    id: "1",
    name: "Blog 1",
    description: "MUSIC",
    websiteUrl: "https://www.youtube.com/watch?v=H6tNm72cMA8"
    
  },

  {

    id: "2",
    name: "Blog 2",
    description: "MUSIC",
    websiteUrl: "https://www.youtube.com/watch?v=kM8LC3Nj7-s"

  }
  
];

blogsRoutes.delete("/:blogId", (req: Request, res: Response) => {

  const blogId = req.params.blogId;
  
  const index = blogs.findIndex(blog => blog.id === blogId);
  
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

  if (index !== -1) {
    blogs.splice(index, 1);
    return res.status(204).send();
  } else {
    return res.status(404).send()
  }

});
  
  
  
blogsRoutes.post('/', (req: Request, res: Response) => {
    
  const { name, description, websiteUrl } = req.body as Blog;

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }

  // Проверяем, что все обязательные поля заполнены
  if (!name || !description || !websiteUrl) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Missing required fields', 
          field: "name or description or websiteUrl"
        }
      ]
    });
  }

  // Проверяем, что поля соответствуют критериям
  if (name.length > 15) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Name is too long', 
          field: "name"
        }
      ]
    });
  }

  if (description.length > 500) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Description is too long', 
          field: "name"
        }
      ]
    });
  }

  const websiteUrlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

  if (!websiteUrlRegex.test(websiteUrl)) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid website URL', 
          field: "websiteUrl"
        }
      ]
    });
  }

  // Создаем новый блог
  const newBlog: Blog = { id: String(blogs.length + 1), name, description, websiteUrl };

  blogs.push(newBlog); // добавляем новый блог в массив

  // Возвращаем созданный блог с кодом 201
  return res.status(201).send(newBlog);

});
  
  
  
blogsRoutes.get('/', (req: Request, res: Response) => {

  res.status(200).send(blogs); // возвращаем массив всех блогов

});
  
  
blogsRoutes.get('/:id', (req: Request, res: Response) => {

  const id = req.params.id;

  const blog = blogs.find((blog) => blog.id === id);

  if (blog) {
    res.status(200).send(blog); 
  } else {
    res.sendStatus(404);
  }

});
  
  
  
blogsRoutes.put('/:id', (req: Request, res: Response) => {

  const id = req.params.id;

  const { name, description, websiteUrl } = req.body;

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Basic ${encodedAuth}`) {
    return res.status(401).send();
  }
  
  if (!websiteUrl || websiteUrl.length > 100) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid website URL', 
          field: "websiteUrl"
        }
      ]
    });
  }

  // Проверяем корректность ссылки на сайт
  const websiteUrlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

  if (!websiteUrlRegex.test(websiteUrl)) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid website URL', 
          field: "websiteUrl"
        }
      ]
    });
  }
  
  if (!name || name.length > 15) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid name', 
          field: "name"
        }
      ]
    });
  }

  if (!description || description.length > 500) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid description', 
          field: "description"
        }
      ]
    });
  }


  // Обновляем блог по его id
  const updatedBlog = blogs.find(blog => blog.id === id);

  if (!updatedBlog) {
    return res.status(404)
  } else {
    updatedBlog.name = name;
    updatedBlog.description = description;
    updatedBlog.websiteUrl = websiteUrl;

    return res.send(updatedBlog);
  }

});
    