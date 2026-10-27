import "dotenv/config";
import express from "express";
import path from "node:path";
import {fileURLToPath} from "node:url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import {searchCms} from "./integrations/cms.js";
import {searchPlaces} from "./integrations/googlePlaces.js";
import {zocdocStatus,searchZocdocAvailability} from "./integrations/zocdoc.js";
const app=express();
app.use(helmet());
app.use(express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../../frontend")));
app.use(express.json({limit:"10kb"}));
app.use("/api",rateLimit({windowMs:60000,limit:50,standardHeaders:"draft-7",legacyHeaders:false}));
const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res)).catch(next);
app.get("/api/health",(req,res)=>res.json({ok:true}));
app.get("/api/cms/:resource",wrap(async(req,res)=>{
 const filters={};
 for(const k of ["name","address-city","address-state","address-postalcode","identifier","specialty"]) {
   if(typeof req.query[k]==="string") filters[k]=req.query[k];
 }
 res.json(await searchCms(req.params.resource,filters));
}));
app.get("/api/places",wrap(async(req,res)=>{
 const query=typeof req.query.q==="string"?req.query.q.trim():"";
 if(!query) return res.status(400).json({error:"Search query required"});
 res.json({places:await searchPlaces(query)});
}));
app.get("/api/zocdoc/status",wrap(async(req,res)=>res.json(await zocdocStatus())));
app.get("/api/zocdoc/availability",wrap(async(req,res)=>res.json(await searchZocdocAvailability())));
app.use((err,req,res,next)=>{
 console.error("API error:",err.message);
 res.status(err.status>=400&&err.status<600?err.status:500).json({error:err.message||"Unexpected error"});
});
const port=Number(process.env.PORT)||3000;
app.listen(port,()=>console.log(`CareBridge API http://localhost:${port}`));
