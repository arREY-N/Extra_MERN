import mongoose from "mongoose";

import { 
    Transaction, 
    User, 
    Category, 
    Flow 
} from '../models/index.js'

const createTransaction = async (req, res, next) => {
    try{
        let { item, amount, category, flow, user } = req.body;
        
        // const user = req.user.id;

        if(!item || !item.trim() || !amount || !user || !flow){
            return res.status(400).json({message: 'Provide item name, amount, user ID, and flow ID'});
        }

        if(isNaN(Number(amount))){
            return res.status(400).json({message: 'Invalid amount'})
        }

        item = item.trim();
        amount = Number(amount);

        if(!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(flow)){
            return res.status(400).json({message: 'Invalid User or Flow ID format'});
        }

        if(category && !mongoose.Types.ObjectId.isValid(category)){
            return res.status(400).json({message: 'Invalid Category ID format'});
        }

        const [foundUser, foundFlow, foundCategory] = await Promise.all([
            User.findById(user),
            Flow.findById(flow),
            category ? Category.findById(category) : Promise.resolve(null)
        ]);

        if(!foundUser){
            return res.status(404).json({message: 'User not found'});
        }

        if(!foundFlow){
            return res.status(404).json({message: 'Flow not found'});
        }

        if(category && !foundCategory){
            return res.status(404).json({message: 'Category not found'});
        }

        const newTransaction = await Transaction.create({
            item,
            amount,
            user: foundUser.id,
            category: foundCategory ? foundCategory.id : null,
            flow: foundFlow.id
        });

        res.status(201).json({
            message: 'Transaction created',
            transaction: newTransaction
        });
    }catch(error){
        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({message: `Validation Error: ${messages.join(', ')} `});
        }

        next(error);
    }
}

const getTransactions = async (req, res, next) => {
    try{
        const transactions = await Transaction.find().sort({updatedAt: 1});
        res.status(200).json(transactions);
    }catch(error){
        next(error);
    }
}

const getTransactionById = async (req, res, next) => {
    try{
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Invalid User ID format'});
        }

        const transaction = await Transaction.findById(id);

        if(!transaction){
            return res.status(404).json({message: 'Transaction not found'});
        }

        res.status(200).json(transaction);
    }catch(error){
        next(error);
    }
}

const updateTransaction = async (req, res, next) => {
    try{
        const { id } = req.params;
        let { item, amount, category, flow, user } = req.body;
        // const user = req.user.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Invalid transaction ID format'});
        }

        const existingTransaction = await Transaction.findById(id);

        if(!existingTransaction){
            return res.status(404).json({message: 'Transaction not found'});
        }

        if(existingTransaction.user.toString() !== user){
            return res.status(403).json({message: 'Unauthorized to edit this transaction'});
        }

        if(Object.keys(req.body).length === 0){
            return res.status(400).json({message: 'No update fields provided'});
        }


        if(item !== undefined && !item.trim()){
            return res.status(400).json({message: 'Invalid item name'});
        }

        if(amount && isNaN(Number(amount))){
            return res.status(400).json({message: 'Invalid amount'});
        }

        if(user && !mongoose.Types.ObjectId.isValid(user)){
            return res.status(400).json({message: 'Invalid User ID format'});
        }

        if(flow && !mongoose.Types.ObjectId.isValid(flow)){
            return res.status(400).json({message: 'Invalid Flow ID format'});
        }

        if(category && !mongoose.Types.ObjectId.isValid(category)){
            return res.status(400).json({message: 'Invalid Category ID format'});
        }

        item = item ? item.trim() : null;
        amount = amount ? Number(amount) : null;

        let foundCategory = null;
        let foundFlow = null;
        
        if(category){
            foundCategory = await Category.findById(category);
            if(!foundCategory){
                return res.status(404).json({message: 'Category not found'});
            }
        }

        if(flow){
            foundFlow = await Flow.findById(flow);
            if(!foundFlow){
                return res.status(404).json({message: 'Flow not found'});
            }
        }

        if(!amount){
            console.log('!amount');
        }

        const updateData = {
            item: item ? item : existingTransaction.item,
            amount: amount ? amount : existingTransaction.amount,
            category: category ? (foundCategory ? foundCategory.id : null) : existingTransaction.category,
            flow: !flow ? (flow ? flow.id : existingTransaction.flow) : existingTransaction.flow
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,
            updateData,
            {new: true, runValidators: true}
        );

        res.status(200).json({
            message: 'Transaction updated successfully',
            transaction: updatedTransaction
        });
    }catch(error){
        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({message: `Validation Error: ${messages.join(', ')} `});
        }

        next(error);
    }
}

const deleteTransaction = async (req, res, next) => {
    try{
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Inavalid Transaction ID format'});
        }

        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        if(!deleteTransaction){
            return res.status(404).json({message: 'Transaction not found'});
        }

        res.status(204).send();
    }catch(error){
        next(error);
    }
}

export {
    createTransaction,
    getTransactionById,
    getTransactions,
    updateTransaction,
    deleteTransaction
}