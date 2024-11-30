const { Login, Signup, getUser,google_login}=require('../controllers/userController');

const {Router}=require('express');
const { restrictLoggedIn } = require('../middlewares/authCheck');
const { body } = require('express-validator');

const router=Router();
router.post("/login", [
body('email', 'Enter a valid email').isEmail(),
body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
],Login);

router.post('/google_login',[
    body('name').matches(/^[a-zA-Z\s]+$/).isLength({ min: 3 }).withMessage('Name must contain only letters and spaces.'),
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('google_id').isLength({ min: 21,max:21 }).matches(/^\d{21}$/).withMessage('Not a valid google_id')
],google_login);

router.post("/signup",[
body('name', 'Enter a valid name').isLength({ min: 3 }),
body('email', 'Enter a valid email').isEmail(),
body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
],Signup);

router.get("/",restrictLoggedIn,getUser);

module.exports=router;