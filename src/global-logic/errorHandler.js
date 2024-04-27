
export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'UnauthorizedError',
      details: error.details
    });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid token' 
    });
  }  

  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Token expired' 
    });
  } 
  
  if (err instanceof jwt.NotBeforeError) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Token not yet valid' 
    });
  } 
  
  if (err instanceof AuthenticationError) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Authentication failed' 
    });
  } 
  return res.status(500).send('Unexpected error occured');
};