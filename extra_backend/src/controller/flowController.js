import mongoose, { mongo } from "mongoose";
import Flow from "../models/Flow.js";

const createFlow = async (req, res, next) => {
    try{
        let { flowName } = req.body;

        if(!flowName || !flowName.trim){
            return res.status(400).json({message: 'Please enter a valid flow name'});
        }

        flowName = flowName.trim();

        const existing = await Flow.findOne({flowName: {$regex: new RegExp(flowName, 'i')}});

        if(existing){
            return res.status(409).json({message: 'A flow with the same name already exists'});
        }

        const newFlow = await Flow.create({
            flowName: flowName
        });

        res.status(201).json({
            message: 'Flow succesfully created',
            flow: newFlow
        })

    } catch(error){
        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({message: `Validation Error: ${messages.join(', ')}`});
        }

        if(error.code === 11000){
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({message: `A flow with the same ${field} already exists`});
        }
        next(error);
    }
}

const getFlows = async (req, res, next) => {
    try{
        const flows = await Flow.find().sort({flowName: 1});
        res.status(200).json(flows);
    }catch(error){
        next(error);
    }
}

const getFlowById = async (req, res, next) => {
    try{
        const { id } = req.params;
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: "Invalid Flow ID format"});
        }

        const flow = await Flow.findById(id);

        if(!flow){
            return res.status(404).json({message: 'Flow not found'});
        }

        res.status(200).json(flow);
    }catch(error){
        next(error);
    }
}

const updateFlow = async (req, res, next) => {
    try{
        const { id } = req.params;
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Invalid Flow ID format'});
        }

        const existingFlow = await Flow.findById(id);

        if(!existingFlow){
            return res.status(404).json({message: 'Flow not found'})
        }

        if(Object.keys(req.body).length === 0){
            return res.status(200).json({message: 'No updated fields provided'});
        }

        Object.assign(existingFlow, req.body);

        const updatedFlow = await existingFlow.save()

        res.status(200).json({
            message: 'Flow updated successfully',
            flow: updatedFlow
        });
    }catch(error){
        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({message: `Validation Error: ${messages.join(', ')}`});
        }

        if(error.code === 11000){
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({message: `A flow with the same ${field} already exists`});
        }
        next(error);
    }
}

const deleteFlow = async (req, res, next) => {
    try{
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Invalid Flow ID format'});
        }

        const deletedFlow = await Flow.findByIdAndDelete(id);

        if(!deletedFlow){
            return res.status(404).json({message: 'Flow not found'});
        }

        res.status(204).send();
    }catch(error){
        next(error);
    }
}

export {
    createFlow,
    getFlows,
    getFlowById,
    updateFlow,
    deleteFlow
}