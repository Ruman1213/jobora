import jwt from 'jsonwebtoken';
import Company from '../models/company.js';

export const protectCompany = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.json({
            success: false,
            message: 'Not authorized, login again'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.company = await Company.findById(decoded.id).select('-password');

        if (!req.company) {
            return res.json({
                success: false,
                message: 'Company not found'
            });
        }

        next();

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};