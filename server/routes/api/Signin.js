const User = require('../../models/User')
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
            
            const newUser = new User();
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
  };