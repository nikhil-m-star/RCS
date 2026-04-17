import express from 'express';
import { requireAuth } from '@clerk/express';
import { 
  getProjects, 
  createProject, 
  deleteProject 
} from '../controllers/projectController.js';

const router = express.Router();

// All project routes require authentication
router.use(requireAuth());

router.get('/', getProjects);
router.post('/', createProject);
router.delete('/:id', deleteProject);

export default router;
