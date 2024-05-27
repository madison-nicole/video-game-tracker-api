import { Router } from 'express';
import * as Posts from './controllers/post_controller';
import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';
import signS3 from './services/s3';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

/// routes go here
router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = UserController.signin(req.user);
    res.json({ token, user: req.user });
  } catch (error) {
    console.log(error.toString());
    res.status(422).send({ error: error.toString() });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { token, user } = await UserController.signup(req.body);
    res.json({ token, user });
  } catch (error) {
    console.log(error.toString());
    res.status(422).send({ error: error.toString() });
  }
});

router.get('/users', requireAuth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.log('error');
    res.status(422).send({ error: error.toString() });
  }
});

router.route('/users/:username')
  .get(async (req, res) => {
    try {
      const { username } = req.params;
      const user = await UserController.isUsernameTaken(username);
      if (user) {
        res.json(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  })
  .put(requireAuth, async (req, res) => {
    try {
      const { username } = req.params;
      const { user } = req.body;
      const newUser = await UserController.updateUser(username, user);
      res.json(newUser);
    } catch (error) {
      console.log(error);
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/users/:username/games')
  // fetch games
  .get(async (req, res) => {
    const { username } = req.params;

    try {
      const result = await UserController.getGames(username);
      return res.json(result);
    } catch (error) {
      // if games not found
      return res.status(404).json({ error: error.message });
    }
  })
  // log a game for the user
  .post(requireAuth, async (req, res) => {
    // store game data
    const { username } = req.params;
    const { game } = req.body;
    const review = req.body?.review;

    try {
      const { user, game: newGame } = await UserController.saveGame(username, game, review);
      return res.json({ user, newGame });
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  // delete a game for the user
  .delete(requireAuth, async (req, res) => {
    // store game data
    const { username } = req.params;
    const { gameId } = req.body;

    try {
      const user = await UserController.deleteGame(username, gameId);
      return res.json(user);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
// update a game for the user
  .put(requireAuth, async (req, res) => {
    // store game data
    const { username } = req.params;
    const { game } = req.body;
    const review = req.body?.review;

    try {
      const user = await UserController.updateGame(username, game, review);
      return res.json(user);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

router.route('/posts')
// fetching posts
  .get(async (req, res) => {
    // use req.body etc to await some contoller function
    // send back the result
    // or catch the error and send back an error
    try {
      const result = await Posts.getPosts();
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  .post(requireAuth, async (req, res) => {
    const fields = req.body;
    try {
      const result = await Posts.createPost(fields);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

router.route('/posts/:id')
  .get(async (req, res) => {
    const postId = req.params.id;
    try {
      const result = await Posts.getPost(postId);
      if (!result) {
        return res.status(404).json({ error: 'Post not found' });
      }
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  })
  .put(requireAuth, async (req, res) => {
    const postId = req.params.id;
    const fields = req.body;
    try {
      const result = await Posts.updatePost(postId, fields);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  .delete(requireAuth, async (req, res) => {
    const postId = req.params.id;
    try {
      const result = await Posts.deletePost(postId);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

router.route('/users/:username/user-info')
  .get(async (req, res) => {
    const { username } = req.params;
    try {
      const result = await UserController.getUser(username);
      if (!result) {
        return res.status(404).json({ error: 'User info not found' });
      }
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  });

router.get('/sign-s3', signS3);

export default router;
