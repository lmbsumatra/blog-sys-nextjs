import { userServices } from "../../services/userServices";
export const getAll = async (req: any, res: any) => {
  try {
    const users = await userServices.selectAll();

    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


