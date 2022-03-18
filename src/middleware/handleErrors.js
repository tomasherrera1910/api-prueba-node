module.exports = (error, req, res, next) => {
    console.error(error.name)
    if(error.name === 'CastError'){
        res.status(400).end()
    }
    else if(error.name === 'MongoServerError'){
        res.status(406).json({
            error : "this username already exists"
        })
    }
    else if(error.name === 'JsonWebTokenError'){
        res.status(401).json({
            error : 'token missing or invalid'
        })
    }
    else{
        res.status(500).end()
    }
}