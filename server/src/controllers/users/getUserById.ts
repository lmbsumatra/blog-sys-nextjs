import { userServices } from "../../services/userServices";

export const getUserById = async (req: any, res: any) => {
  const requiredFields = ["userId", "userRole"];
  const { userId, userRole } = req.token;

  if (
    !requiredFields.every(
      (field) =>
        field in req.token &&
        req.token[field] !== null &&
        req.token[field] !== ""
    )
  ) {
    const missingOrEmptyFields = requiredFields.filter(
      (field) =>
        !(field in req.token) ||
        req.token[field] === null ||
        req.token[field] === ""
    );
    return res.status(400).json({
      message: "Missing or empty required fields",
      details: missingOrEmptyFields,
    });
  }

  try {
    const user = await userServices.selectOne(userId, userRole)

    if (!user || user === undefined) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    return res.status(200).json({
      message: "Found user!",
      user: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error!",
      details: error.message,
    });
  }
};

