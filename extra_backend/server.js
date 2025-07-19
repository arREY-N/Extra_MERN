import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import categoryRoutes from './src/routes/categoryRoutes.js'; 
import flowRoutes from './src/routes/flowRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import transactionRoutes from './src/routes/transactionRoutes.js';

const app = express();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        
        app.listen(PORT, () => {
            console.log('Extra backend now working.')
            console.log(`Access at http://localhost:${PORT}`);
        })
    })
    .catch(err => {
        console.error('MongoDB connection error: ', err);
        process.exit(1);        
    });

app.use(express.json())

if(NODE_ENV !== 'production'){
    app.use(cors());
    console.log('CORS enabled for development environment');
} else {
    console.log('CORS is NOT enabled for production environment');
}

app.get('/', (req, res) => {
    res.send('Welcome to ExTra from the backend');
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/api/categories', categoryRoutes);
app.use('/api/flows', flowRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.use((req, res, next) => {
    res.status(404).json({message: 'Resource not found'});
})

app.use((err, req, res, next) => {
    console.error('An error has occured: ', err.stack);
    res.status(500).json({
        message: 'Internal server error',
        error: err.message
    });
});