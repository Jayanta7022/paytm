const express = require('express');
const zod = require('zod');
const { User, Account } = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authMidleware } = require('../midddleware/middleware.js');
const JWT_SECRET = process.env.JWT_SECRET;

const signUpBody = zod.object({
  username: zod.string().email(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});

//signup api

router.post('/signup', async (req, res) => {
  const { success } = signUpBody.safeParse(req.body);
  console.log(req.body);
  if (!success) {
    return res.status(411).json({
      message: 'something wrong in input',
    });
  }
  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: 'email allready taken/invalid input',
    });
  }
  const user = await User.create({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
  });

  const userId = user._id;
  await Account.create({
    userId,
    balance: 1 + Math.random() * 1000,
  });
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );
  res.status(200).json({
    message: 'user created successfully',
    token: token,
  });
});

//signin api

const signInBody = zod.object({
  username: zod.string().email(),
  password: zod.string,
});

router.post('/signin', async (req, res) => {
  const { success } = signInBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: 'incorrect input',
    });
  }

  const user = User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
    res.status(200).json({
      token: token,
    });
    return;
  }
  res.status(411).json({
    message: 'error while login',
  });
});

//update api
const updateBody = zod.object({
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
  password: zod.string().optional(),
});
router.post('/', authMidleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: 'eror while updation',
    });
  }
  await User.updateOne(req.body, {
    _id: req.userId,
  }).catch((err) => {
    return res.status(411).json({
      error: err,
    });
  });
  res.status(200).json({
    message: 'updated successfully',
  });
});

router.get('/bulk', authMidleware, async (req, res) => {
  const filter = req.query.filter || '';
  const users = User.find({
    $or: [
      {
        firstname: {
          $regex: filter,
        },
      },
      {
        lastname: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      id: user._id,
    })),
  });
});

module.exports = router;
