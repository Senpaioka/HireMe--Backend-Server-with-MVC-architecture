import express from 'express';
import { userRoutes } from './user.route';
import { jobRoutes} from './job.route';
import { applyRoutes } from './apply.route';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/users',
        route: userRoutes,
    },
    {
        path: '/jobs',
        route: jobRoutes,
    },
    {
        path: '/apply',
        route: applyRoutes,
    }
    
];


moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;