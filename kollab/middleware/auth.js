const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * Authentication middleware to get jwt token from
 * user logging in.
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {next} next 
 */
module.exports = function (req, res, next)
{
    const token = req.session.userToken;
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try 
    {
        const decoded = jwt.verify(token, 'topsecret');
        req.user = decoded;
        next();
    }
    catch (ex)
    {
        res.status(400).send('Invalid token.');
    }
}