const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');


router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchedPosts;
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  // Post.find()
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'post fetched successfully..',
        posts: fetchedPosts,
        maxPosts: count
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Fetching Posts Failed'
      })
    });
});



router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post)
    }
    else {
      res.status(404).json({
        message: " Post not found..!"
      })
    }
  })
    .catch(err => {
      res.status(500).json({
        message: 'Fetching Post Failed'
      })
    })
})



router.post("", checkAuth, (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: ' post added successfully..',
      postId: createdPost._id
    });
  })
    .catch(err => {
      res.status(500).json({
        message: 'Post creation Failed'
      })
    });
});



router.put('/:id', checkAuth, (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({
        message: "update..!",
        id: post._id
      })
    }
    else {
      res.status(401).json({
        message: "UnAuthorized",
        id: post._id
      })
    }


  })
    .catch(() => {
      res.status(500).json({
        message: "Couldnt update Post",
        id: post._id
      })
    });
});



router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
    if (result.n > 0) {
      res.status(200).json({
        message: "Post Deleted!.."
      })
    }
    else {
      res.status(401).json({
        message: "UnAuthorized"
      })
    }

  })
    .catch(() => {
      res.status(500).json({
        message: 'Deleting Post Failed'
      })
    });
})



module.exports = router;
