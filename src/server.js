import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { tryCatch } from './global-logic/tryCatch.js';
import { errorHandler } from './global-logic/errorHandler.js';
const app = express();
dotenv.config();
app.use(express.json());

const posts = [
  { 
    title: 'Post 1',
    content: 'Post 1 content text',
    username: 'user1'
  },
  { 
    title: 'Post 2',
    content: 'Post 2 content text',
    username: 'user2'
  },
  { 
    title: 'Post 3',
    content: 'Post 3 content text',
    username: 'user3'
   },
  { 
    title: 'Post 4',
    content: 'Post 4 content text',
    username: 'user4'
   },
];

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(400);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log('error:', err.message);
      return res.sendStatus(403);
    } else {
      req.user = user;
      next();
    }
  });
}

app.get(
  '/posts',
  verifyToken,
  tryCatch((req, res) => {
    return res.json(posts.filter(post => post.username === req.user.username))
  })
);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});