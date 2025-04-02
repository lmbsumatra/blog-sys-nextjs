const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET as string;

export const TokenManager = {
    generateToken: (payload: object, options = {}) => {
        try {
            const token = jwt.sign(payload, JWT_SECRET, options);
            return token;
        } catch (error) {
            return { message: "Failed token generation" };
        }
    },

    verifyToken: (token: string) => {
        try {
            const verify = jwt.verify(token, JWT_SECRET);
            return verify;
        } catch (error) {
            return { message: "Failed verification" };
        }
    },
};
