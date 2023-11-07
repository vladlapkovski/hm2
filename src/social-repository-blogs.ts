import { collection, collection1, collectionBlogsType, collectionPostsType } from './db';
import { ObjectId } from 'mongodb';

export const socialRepository = {
  async getBlogs(): Promise<collectionBlogsType[]> {
    const foundBlogs = await collection.find({}).toArray();
    const blogs = foundBlogs.map((blog) => {
      const { _id, ...rest } = blog;
      return rest;
    });
    return blogs;
  },

  async createBlog(name: string, description: string, websiteUrl: string, createdAt: string, isMembership: boolean): Promise<collectionBlogsType | undefined> {
    if (!name.trim() || !description.trim() || !websiteUrl.trim()) {
      return undefined;
    }
    const createdAt1 = new Date().toISOString();
    const objectId = new ObjectId();
    const result = await collection.insertOne({
      name,
      description,
      websiteUrl,
      createdAt: createdAt1,
      isMembership: false,
      _id: objectId,
      id: objectId
    });

    return {
      id: result.insertedId,
      name,
      description,
      websiteUrl,
      createdAt: createdAt1,
      isMembership: false
    };
  }
};

export const getIDBlog = {
  async getBlog(): Promise<collectionBlogsType[]> {
    const foundBlogs = await collection.find({}).toArray();
    const blogs = foundBlogs.map((blog) => {
      const { _id, ...rest } = blog;
      return rest;
    });
    return blogs;
  }
};

export const deleteIDBlog = {
  async deleteBlog(): Promise<void | collectionBlogsType[]> {
    return collection.find({}).toArray();
  }
};

export const updateIDBlog = {
  async updateBlog(id: ObjectId, name: string, description: string, websiteUrl: string) {
    if (typeof name !== 'string' || !name.trim() || typeof description !== 'string' || !description.trim() || typeof websiteUrl !== 'string' || !websiteUrl.trim()) {
      return undefined;
    }

    const updateDocument = {
      $set: {
        name,
        description,
        websiteUrl
      }
    };

    const result = await collection.findOneAndUpdate({ _id: id }, updateDocument);

    if (result) {
      const updatedBlog = result as collectionBlogsType;
      return {
        id: updatedBlog.id.toString(),
        name: updatedBlog.name,
        description: updatedBlog.description,
        websiteUrl: updatedBlog.websiteUrl
      };
    } else {
      return undefined;
    }
  }
};
  




export const socialRepository1 = {
  async getPosts(): Promise<collectionPostsType[]> {
    const foundPosts = await collection1.find({}).toArray();
    const posts = foundPosts.map((post) => {
      const { _id, ...rest } = post;
      return rest;
    });
    return posts;
  },

  async createPost1(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
  ): Promise<collectionPostsType | undefined> {
    if (!title.trim() || !shortDescription.trim() || !content.trim() || !blogId.trim()) {
      return undefined;
    }
    
    let blog;
    try {
      blog = await collection.findOne({ _id: new ObjectId(blogId) });
    } catch (error) {
      return undefined;
    }

    if (typeof blog !== "object" || !blog) {
      return undefined;
    }

    const BLOGNAME = blog.name;
    const createdAt2 = new Date().toISOString();
    const objectId1 = new ObjectId();
    const result = await collection1.insertOne({
      title,
      shortDescription,
      content,
      blogId,
      blogName: BLOGNAME,
      createdAt: createdAt2,
      _id: objectId1,
      id: objectId1
    });

    return {
      id: result.insertedId,
      title,
      shortDescription,
      content,
      blogId,
      blogName: BLOGNAME,
      createdAt: createdAt2
    };
  }
};


