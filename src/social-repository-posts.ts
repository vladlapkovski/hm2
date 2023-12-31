<<<<<<< HEAD
import { CreateComments, collection, collection1, collection4, collectionPostsType } from './db';
=======
import { GetPostComment, collection, collection1, collection4, collectionPostsType } from './db';
>>>>>>> a4ac42c455f65d4e514ba2a30da6ab6ae2afbdad
import { ObjectId } from 'mongodb';


export const socialRepository = {
  async getPosts(): Promise<collectionPostsType[]> {
    const foundPosts = await collection1.find({}).toArray();
    const posts = foundPosts.map((post) => {
      const { _id, ...rest } = post;
      return rest;
    });
    return posts;
  },

  async createPost(
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
      blog = await collection.findOne(
        { _id: new ObjectId(blogId) },
        { projection: { name: 1 } }
      );
    } catch (error) {
      return undefined;
    }

    if (typeof blog !== "object" || !blog) {
      return undefined;
    }

    
    const BLOGNAME = (blog as { name: string }).name;
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

export const getIDPost = {
  async getPost(): Promise<collectionPostsType[]> {
    const foundPosts = await collection1.find({}).toArray();
    const posts = foundPosts.map((post) => {
      const { _id, ...rest } = post;
      return rest;
    });
    return posts;
  }
};

export const deleteIDPost = {
  async deletePost(): Promise<void | collectionPostsType[]> {
    return collection1.find({}).toArray();
  }
};

export const updateIDPost = {
  async updatePost(
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  ) {
    if (
      typeof title !== 'string' || !title.trim() ||
      typeof shortDescription !== 'string' || !shortDescription.trim() ||
      typeof content !== 'string' || !content.trim() ||
      typeof blogId !== 'string' || !blogId.trim()
    ) {
      return undefined;
    }

    let blog;
    try {
      blog = await collection.findOne(
        { _id: new ObjectId(blogId) },
        { projection: { name: 1 } }
      );
    } catch (error) {
      return undefined;
    }

    if (typeof blog !== "object" || !blog) {
      return undefined;
    }

    const BLOGNAME = (blog as { name: string }).name;
    const updatePostDocument = {
      $set: {
        title,
        shortDescription,
        content,
        blogId,
        blogName: BLOGNAME
      }
    };

    const result1 = await collection1.findOneAndUpdate({ _id: id }, updatePostDocument);

    if (result1) {
      const updatedPost = result1 as collectionPostsType;
      return {
        id: updatedPost.id.toString(),
        title: updatedPost.title,
        shortDescription: updatedPost.shortDescription,
        content: updatedPost.content,
        blogId: updatedPost.blogId,
        blogName: updatedPost.blogName
      };
    } else {
      return undefined;
    }
  }
};


<<<<<<< HEAD
export const CreateCommentsRepository = {
  async CreateComment(content: string, rest: any): Promise<CreateComments | undefined> {
=======

export const CreateCommentForPost = {
  async getComment(): Promise<GetPostComment[]> {
    const foundComment = await collection4.find({}).toArray();
    const Comments = foundComment.map((Comment) => {
      const { _id, ...rest } = Comment;
      return rest;
    });
    return Comments;
  },

  async createComment(content: string, commentatorInfo: {userId: string, userlogin: string}, createdAt: string): Promise<GetPostComment | undefined> {
>>>>>>> a4ac42c455f65d4e514ba2a30da6ab6ae2afbdad
    if (!content.trim()) {
      return undefined;
    }
    const createdAt1 = new Date().toISOString();
    const objectId = new ObjectId();
    const result = await collection4.insertOne({
      id: objectId,
      content,
<<<<<<< HEAD
      commentatorInfo: rest,
      createdAt: createdAt1,
=======
      commentatorInfo: {
        userId: "341",
        userLogin: "123"
      },
      createdAt: createdAt1,
      _id: objectId
>>>>>>> a4ac42c455f65d4e514ba2a30da6ab6ae2afbdad
    });
    return {
      id: result.insertedId,
      content,
<<<<<<< HEAD
      commentatorInfo: rest,
      createdAt: createdAt1,
    };
  },
=======
      commentatorInfo: {
        userId: "341",
        userLogin: "123"
      },
      createdAt: createdAt1
    };
  }
>>>>>>> a4ac42c455f65d4e514ba2a30da6ab6ae2afbdad
};