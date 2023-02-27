const adminRoute = require("express").Router();
const { UserModel } = require("../model/user_model");
const { QRModel } = require("../model/qr.model");
const fs = require("fs");
const {BlacklistuserModel}=require("../model/blockusermodel");

const { adminAuthentication } = require("../middleware/adminAuthentication");
adminRoute.use(adminAuthentication);

adminRoute.get("/detail", async (req, res) => {
  try {
    let data = await UserModel.aggregate([
      {
        $lookup: {
          from: "qrs",
          localField: "email",
          foreignField: "email",
          as: "list",
        },
      },
    ]);
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

adminRoute.post("/block", async (req, res) => {
  try {
    // console.log("object");
    // let users=await UserModel.find()
    // let blacklistAcc = JSON.parse(
    //   fs.readFileSync("./blacklistuser.json", "utf-8")
    // );
    // console.log(req.body);
    // blacklistAcc.push(req.body.list[0].email);
    // console.log(req.body.list[0].email)
    // fs.writeFileSync("./blacklistuser.json", JSON.stringify(blacklistAcc));
    // console.log(req.body);
    console.log(req.body);
    let {block_email,name,password,_id} = req.body;
    console.log(block_email,name,password,_id);
    let data=new BlacklistuserModel({block_email,name,password,block_userId:_id});
    await data.save()
    res.send({ msg: `${req.body.list[0].email} has been blacklisted`});
  } catch (err) {
    console.log(err);
    res.send({"msg":'Cannot ',err});
  }
});

adminRoute.get("/block/details", async(req, res) => {
  try {
    let detail = await BlacklistuserModel.find()
    console.log(detail);
    res.send(detail);
  } catch (err) {
    console.log(err);
    res.send("can't find");
  }
});

adminRoute.post("/unblock",async(req,res)=>{
    let {usermail}=req.body;
    try{
      let data=await BlacklistuserModel.findOneAndDelete({block_userId:usermail});
        // let blacklistAcc = JSON.parse(
        //     fs.readFileSync("./blacklistuser.json", "utf-8")
        //   ); 
        //   let X=blacklistAcc.findIndex((el)=>{return el==data.usermail})
        //   blacklistAcc.splice(X,1)
        //   fs.writeFileSync("./blacklistuser.json", JSON.stringify(blacklistAcc));
        //  console.log(blacklistAcc)
         res.send({ msg: `${req.body.usermail} account has been Unblocked` });
    }catch(err){
        console.log(err)
        res.send("can't unblock")
    }
    // console.log(data)
    // res.send("ok")
})

adminRoute.delete("/delete",async (req,res)=>{
  var email;
  // console.log(typeof(req.body.list[0]))
  console.log("object");
  if( typeof(req.body.list[0]) == "string"){
    email=req.body.list[0]
    console.log("YES")
  }else{
    email=req.body.list[0].email;
  }

    try{
        await QRModel.findOneAndRemove({email})
        await UserModel.findOneAndRemove({email})
        res.send({msg:`${email} has been Deleted`})
    }catch(err){
        console.log(err)
        res.send("can't blacklist")
    }

})
module.exports = {
  adminRoute,
};

//"email": "abhi.jaiswal1494@gmail.com",
// "list" : 
// ["email": "abhi.jaiswal1494@gmail.com"
// "size":  150
// "url" : "https://github.com/abhishek1494k/tough-cheese-1567"
// "_id": "63fb176062dfe336d81d0c33"],
// "name": "Abhishek"
// "password":  "$2b$05$QD0H5mzCZchwVB1vgOnwZOc4WHWsrGZoEMAURTRf/dRa81VjRYVj2"
// "_id": "63fb173662dfe336d81d0c2f"

