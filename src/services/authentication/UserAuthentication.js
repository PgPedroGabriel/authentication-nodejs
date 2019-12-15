import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send();
  }

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);

    req.authUserInfo = decoded;

    return next();
  } catch (err) {
    return res.status(401).send();
  }
};
