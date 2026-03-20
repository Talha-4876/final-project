import express from 'express';
import { getUsers, createUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', getUsers);       // Get all users
router.post('/', createUser);    // Create new user

export default router;
