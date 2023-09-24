export const checkAuth = async(req,res,next) =>{
    if(req.session.isAuthenticated && req.session.user){
        return res.status(200).json({isAuthenticated:true,user:req.session.user})
    }
    return res.status(401).json({isAuthenticated:false,user:null})
}