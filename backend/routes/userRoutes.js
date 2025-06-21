import express from 'express';
import { createUser,
         loginUser,
         logoutCurrentUser,
          } from '../controllers/userController.js';

import { authenticate, authorizedAdmin, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile } from '../middlewares/authMiddleware.js';
         
const router = express.Router();

router.route('/').post(createUser).get(authenticate, authorizedAdmin, getAllUsers);
router.post('/auth', loginUser);
router.post('/logout', logoutCurrentUser);

router.route('/profile').get(authenticate, getCurrentUserProfile).put(authenticate, updateCurrentUserProfile);


export default router;