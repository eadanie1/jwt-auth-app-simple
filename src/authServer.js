import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
app.use(express.json());

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

// Function to simulate user login
async function loginUser(username, password) {
  const user = users.find(user => user.username === username);
  if (!user) {
    console.log('User not found');
    return;
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (isPasswordCorrect) {
    console.log('Login successful');
  } else {
    console.log('Incorrect password');
  }
}

hashPasswords().then(() => {
  // Simulate login attempts
  loginUser('user1', process.env.TEST_PASSWORD_x1); // Should succeed
  loginUser('user2', process.env.INCORRECT_TEST_PASSWORD); // Should fail
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Find user by username
  const user = users.find(user => user.username === username);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  try {
    // Compare the provided password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // Passwords match, generate token
      const token = jwt.sign({ username: user.username, id: user.id }, process.env.JWT_SECRET);
      res.status(200).json({ token });
    } else {
      // Passwords don't match
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});