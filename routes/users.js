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
/*
*-------------------------------------------------
** Login and return token 
*-------------------------------------------------
*/
router.post('/login', async(req, res, next)=>{
  const {email, password} = req.body;
  let msg   
  const getUserQuery = `SELECT * FROM users WHERE user_email = $1`
  //check if provided email exists 
  const checkUser = await db.query(getUserQuery, [email])
  if(checkUser.length>0){
  //check if password is correct 
    const loginUser = checkUser[0];
    const validPass = bcrypt.compareSync(password, loginUser.password);
    if(validPass){
      msg = 'Success! You\'ve been loged in'
      const token = randToken.uid(50)
      db.none(`UPDATE users SET token = $1 WHERE user_email = $2`, [token, loginUser.user_email])
      res.json({
        msg,
        userInfo: {
          name:`${loginUser.user_fname} ${loginUser.user_lname}`, 
          token: token
        }
      })
      return
    } else{
      msg = 'Either the email or PASSWORD, or both, is incorrect'
      res.json(msg)
    }
  }else{
    msg = 'Either the EMAIL or password, or both, is incorrect.'
    res.json({
      msg,
    })  
  }
});




module.exports = router;
