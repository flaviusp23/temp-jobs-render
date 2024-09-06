const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors")
const Job = require('../models/Job')

const getAllJobs = async(req,res) => {
    const jobs = await Job
    .find({createdBy:req.user.userId},{'__v':0})
    .sort('createdAt')
    res.status(StatusCodes.OK).json({jobs})
}
const getJob = async(req,res) => {
    const { 
        user: {
            userId
        },
        params:{
            id:jobId
        },
    } = req
    const job = await Job.findOne({
        _id:jobId,
        createdBy:userId//potentially, someone can have your job id (hypothetical) so with this we just ensure that only the user (in the token) can access the job.
    },{
        '__v':0
    })
    if(!job){
        throw new NotFoundError(`No job found with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job});
}
const createJob = async(req,res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}
const updateJob = async(req,res) => {
    const { 
        user: {
            userId
        },
        params:{
            id:jobId
        },
        body:{
            company,
            position
        }
    } = req
    if(company === '' || position === ''){
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
    const job = await Job.findOneAndUpdate({
        _id:jobId,
        createdBy:userId//same validation
    },req.body,{
        new:true,
        runValidators:true
    }).select('-__v');
    if(!job){
        throw new NotFoundError(`No job found with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job});
}
const deleteJob = async(req,res) => {
    const { 
        user: {
            userId
        },
        params:{
            id:jobId
        },
    } = req
    const job = await Job.deleteOne({
        _id:jobId,
        createdBy:userId
    },{
        '__v':0
    })
    if(!job){
        throw new NotFoundError(`No job found with id ${jobId}`)
    }
    res.status(StatusCodes.OK).send('Job deleted');
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}