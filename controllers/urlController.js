const { validationResult } = require('express-validator');
const urlModel=require('../models/urlModel');
const shortid = require('shortid');

const Create=async (req,res)=>{
const url=urlModel.create();
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg});
try {
    const {url}=req.body;
    const shortId= shortid.generate(); // Generates a short, unique ID
    const createdBy=req.user.user._id;
    const shortUrl=await urlModel.create({
       shortId,
       createdBy,
       redirect:url
    });
    if(!shortUrl) return res.status(400).json({error:"Something Went Wrong"});
    return res.status(200).json(shortUrl);
} catch (error) {
    return res.status(400).json({error:"Something went Wrong"});
}
}

const Redirect = async (req, res) => {
    try {
        const { shortId } = req.params;
        const {os,browser,ip,language,country,state,city,coord,provider,postal,timezone}=req.body;
        const timestamp=new Date();
        const entry = await urlModel.findOneAndUpdate(
            { shortId },
            { $push: { 
                visits: { 
                timestamp,os,browser,ip,language,country,state,city,coord,provider,postal,timezone
            } 
            } 
            },
            { new: true });
        // If no document is found with the provided shortId, return an error response
        if (!entry) return res.status(401).json({ error: "URL not found" });
        // Return only the relevant information
        return res.status(200).json({redirect:entry.redirect});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const getURL=async (req,res)=>{
try {
    const id=req?.user?.user?._id;
    const urlDetail=await urlModel.find({createdBy:id});
    console.log(urlDetail);
    if(!urlDetail) return res.status(400).json({error:"No Such URL found in your account"});
    return res.json(urlDetail);
} catch (error) {
    console.log(error);
    return res.status(400).json({error:"Something went Wrong"});
}
}

const getURLData=async (req,res)=>{
    try {
        const { shortId } = req.params;
        const createdBy=req.user.user._id;
        const entry = await urlModel.findOne({createdBy,shortId});
        if (!entry) return res.status(401).json({ error: "URL not found" });
        // Return only the relevant information
        return res.status(200).json({entry});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports={Create,Redirect,getURL,getURLData};