import express from 'express';
import cors from 'cors';
import routes from './views/routes';


// Create an Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', routes);

// initial route
app.get('/', (req, res) => {
    res.send('Welcome to the HireMe API server!');
})

// invalid route handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})


export default app;
