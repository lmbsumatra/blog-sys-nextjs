export const authorizedRoles = (...allowedRoles: any) => {
  return (req: any, res:any, next:any) => {
    try {
      if (!allowedRoles.includes(req.token.userRole)) {
        return res.status(401).json({ message: "You have no access here." });
      }

      if (!req.token.userRole) {
        return res.status(401).json({ message: "Role is required." });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: error });
    }
  };
};

