import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
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

app.listen(3000, () => {
  console.log('Listening on port 3000');
});