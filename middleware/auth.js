export const checkAuth = async(req,res,next) =>{
    if(req.session.isAuthenicated && req.session.user){
        return res.status(200).json({isAuthenicated:true,user:req.session.user})
    }
    return res.status(401).json({isAuthenicated:false,user:null})
}