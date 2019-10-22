const express = require('express');
const router = express.Router();
const db = require('../db');
const randToken = require('rand-token');
const bcrypt = require('bcryptjs')

router.get('/', async function(req, res, next) {
  res.json('hello')
});
/*
*-------------------------------------------------
** Add User to the Database 
*-------------------------------------------------
*/
router.post('/add_user', async function(req,res,next){
  const {fname, lname, password, email} =  req.body
  let msg
  //check if information is complete 
  if((!fname)||(!lname)||(!password)||(!email)){
    msg = 'Invalid Info'
    res.json(msg)
    return 
  }

  //check if user exists 
  const userCheckQuery = `SELECT user_email FROM users WHERE user_email = $1`
  const userExist = await db.query(userCheckQuery, [email])
  console.log('+++', userExist)
  if(userExist.length > 0){
    msg = "a user with this email already exists"
    res.json(msg)
    return 
  }
  else {
    const insertNewUserQuery = `INSERT INTO users 
    (user_fname, user_lname, user_email, token, password) 
    VALUES ($1,$2,$3,$4,$5)
    returning user_fname, user_lname, user_email, token`
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const token = randToken.uid(50);
    const insertUser = await db.one(insertNewUserQuery,[fname, lname, email,token,hash])
    console.log('++',insertUser)
    msg = "user added";
    res.json({
      fname,
      lname,
      token,
      msg
    });
    return
  }
});

router.post('/login', async(req, res, next)=>{
  res.json('hello')
})




module.exports = router;
