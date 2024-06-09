const { Create,Redirect,getURL,getURLData}=require('../controllers/urlController');
const {Router}=require('express');
const {body}=require('express-validator');
const { restrictLoggedIn } = require('../middlewares/authCheck');
const router=Router();
router.post("/create",restrictLoggedIn,[
body('url',"Not a valid URL").isURL()
],Create);
router.get("/data/:shortId",restrictLoggedIn,getURLData);
router.post("/:shortId",Redirect);
router.get("/",restrictLoggedIn,getURL);


module.exports=router;