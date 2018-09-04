const User = require('../../models/User')
const UserSession = require('../../models/UserSession')
module.exports = (app) => {
    // app.get('/api/counters', (req, res, next) => {
    //   Counter.find()
    //     .exec()
    //     .then((counter) => res.json(counter))
    //     .catch((err) => next(err));
    // });
    app.post('/api/accounts/signup',(req,res)=>{
        const {body} = req
        let {
            firstName,lastName,email,password
        } = body
        if(!firstName){return res.send({succes:false,message:"User must must have First Name"})}
        if(!email){return res.send({succes:false,message:"User must must have Email"})}
        if(!password){return res.send({succes:false,message:"User must must have Password"})}
        if(!lastName){return res.send({succes:false,message:"User must must have Last Name"})}
        email = email.toLowerCase()
        User.find({
            email:email
        },(err,prevUser)=>{
            if(err){return res.send({succes:false,message:"Internal Server Error"})}
            else if(prevUser.length>0){return res.send({succes:false,message:"User already exist"})}
            
            let newUser = new User();
            newUser.email = email;
            newUser.firstName = firstName;
            newUser.lastName = lastName;
            newUser.password = newUser.generateHash(password)
            newUser.save((err,user)=>{
                if(err){
                    return res.send({succes:false,message:"Internal Server Error"})
                }
                return res.send(user)
            })
        })
    })
    app.post('/api/accounts/signin',(req,res)=>{
      const {body} = req
      let {
          email,password
      } = body
      email = email.toLowerCase()
      if(!email){return res.send({succes:false,message:"User must must have an Email"})};
      if(!password){return res.send({succes:false,message:"User must must have a Password"})}
      User.find({email:email},(err,users)=>{
          if(err){
              return res.send({succes:false,message:'Internal Server Error'})
          }
          if(users.length!=1){
              return res.send({succes:false,message:'Invalid Login'})
          }
          const user = users[0]
          if(!user.validPassword(password)){
              return res.send({succes:false,message:'Invalid Password'})
          }
          let userSession = new UserSession()
          userSession.id = user._id
          userSession.save((err,doc)=>{
              if(err){
                  return res.send({succes:false,message:'Internal Server Error'})
              }
              return res.send({
                  succes:true,
                  message:'Sign in Succesfully',
                  token:doc._id
              })
          })
  
  
      })
  
  })
  };