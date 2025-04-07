import { userServices } from "../../services/userServices";

export const deleteUser = async (req: any, res: any) => {
  const userId = req.params.userId;

  if (!req.params.userId || !userId) {
    res.status(400).json({ error: "userId is required." });
  }

  try {
    const deletedUser = await userServices.deleteUser(userId);

    res.status(201).json({
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Failed to create user",
      details: "Internal Server Error",
    });
  }
};
