import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { tryCatch } from './global-logic/tryCatch.js';
const app = express();
dotenv.config();
app.use(express.json());

let refreshTokens = [];

const users = [
  { username: 'user1', password: process.env.USER_PASSWORD_x1, id: 'x1' },
  { username: 'user2', password: process.env.USER_PASSWORD_x2, id: 'x2' },
  { username: 'user3', password: process.env.USER_PASSWORD_x3, id: 'x3' },
  { username: 'user4', password: process.env.USER_PASSWORD_x4, id: 'x4' },
];

async function hashPasswords() {
  for (let user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
}

hashPasswords().then();

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

app.post(
  '/login', 
  tryCatch(async (req, res) => {
    const { username, password } = req.body;
    const matchedUser = users.find(user => user.username === username);
    
    if (!matchedUser) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = { username: matchedUser.username, id: matchedUser.id };
    const isPasswordCorrect = await bcrypt.compare(password, matchedUser.password);

    if (isPasswordCorrect) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);

      return res.status(200).json({ accessToken, refreshToken });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
}));

app.post(
  '/token', 
  tryCatch((req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken === null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({message: 'Token not found'});

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        const accessToken = generateAccessToken({ name: user.name });
        return res.json({ accessToken });
      }
    })
  })
);

app.delete(
  '/logout', 
  tryCatch((req, res) => {
    const foundToken = refreshTokens.find(token => token === req.body.token);

    if (foundToken) {
      refreshTokens = refreshTokens.filter(token => token !== foundToken);
      res.sendStatus(204);
    } else {
      res.status(404).json({message: 'Token not found'});
    }
}));

app.listen(4000, () => {
  console.log('Listening on port 4000');
});