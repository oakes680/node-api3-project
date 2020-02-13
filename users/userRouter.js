const express = require('express');

const router = express.Router();

const Data = require('./userDb');
const Posts = require('../posts/postDb')


router.post('/', validateUser, (req, res) => {
  // do your magic!

  Data.insert(req.body)
    .then(post => {
      res.status(201).json(req.body)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: "There was an error while saving the user to the database"
      })
    })

});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const{ id } = req.params
  
  Posts.insert({ ...req.body, user_id: id})
    .then(post => {
      res.status(201).json(req.body)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: "There was an error while saving the user to the database"
      })
    })
});




router.get('/', (req, res) => {
  // do your magic!
  Data.get()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'in.'
      });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id;
  Data.getUserPosts(id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'in.'
      });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  Data.remove(req.params.id)
    .then(post => {
        res.status(200).json({ message: 'The User has been deleted' });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The post could not be removed",
      });
    });
});

router.put('/:id', validateUserId, (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ errorMessage: "Please provide a name." })
  } else {
    Data.update(req.params.id, req.body)
      .then(post => {
          res.status(200).json(req.body);
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: 'Error updating the post'
        })
      })
  }
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  console.log(id);
  Data.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ error: 'Invalid user ID.' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Server error validating user ID' });
    });
}

//*********************************************** */
// function isEmpty(obj) {
//   for (var key in obj) {
//     if (obj.hasOwnProperty(key))
//       return false;
//   }
//   return true;
// };
// if (isEmpty(req.body)) {
//   console.log('I am empty');
// } else {
//   console.log('i am full');
// }


function validateUser(req, res, next) {
  console.log('this is validate user',res.body)

  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  };

  if (isEmpty(req.body))  {
    res
      .status(400)
      .json({ errorMessage: "missing user data" });
  } else if (!req.body.name) {
  res.status(400)
    .json({ errorMessage: "missing required name field" });
  } else if (req.body) {
    next();
}
}


//if (Object.getOwnPropertyNames(obj).length > 0) return false;

function validatePost(req, res, next) {
  // function isEmpty(obj) {
  //   for (var key in obj) {
  //     if (obj.hasOwnProperty(key))
  //       return false;
  //   }
  //   return true;
  // };

  if (Object.getOwnPropertyNames(req.body).length > 0) {
      res
        .status(400)
        .json({ Message: "missing post data" });
    } else if (!req.body.text) {
      res.status(400)
        .json({ Message: "missing required text field"});
    } else if (req.body) {
      next();
}
}

module.exports = router;
