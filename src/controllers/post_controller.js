import PostModel from '../models/game_model';

export async function createPost(postFields) {
  // create a new post object
  const post = new PostModel();
  post.title = postFields.title;
  // await creating a post + return post
  try {
    const savedpost = await post.save();
    return savedpost;
  } catch (error) {
    throw new Error(`create post error: ${error}`);
  }
}
export async function getPosts() {
  // await finding posts
  // return posts
  try {
    const savedPosts = await PostModel.find({}).sort({ date: -1 });
    return savedPosts;
  } catch (error) {
    throw new Error(`retrieve posts error: ${error}`);
  }
}
export async function getPost(id) {
  // await finding one post
  // return post
  try {
    const post = await PostModel.findById(id);
    return post;
  } catch (error) {
    throw new Error(`retrieve post error: ${error}`);
  }
}
export async function deletePost(id) {
  // await deleting a post
  // return confirmation
  try {
    const deletedPost = await PostModel.findByIdAndDelete(id);
    return deletedPost;
  } catch (error) {
    throw new Error(`delete post error: ${error}`);
  }
}
export async function updatePost(id, postFields) {
  // await updating a post by id
  // return *updated* post
  try {
    await PostModel.findOneAndUpdate({ _id: id }, { title: postFields.title });
    const post = await PostModel.findById(id);
    return post;
  } catch (error) {
    throw new Error(`update post error: ${error}`);
  }
}
