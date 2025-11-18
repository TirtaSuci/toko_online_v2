import { deleteData, retriveData, updateData } from "@/lib/firebase/service";
import { NextApiRequest, NextApiResponse } from "next";
import { user } from "@/types/user.type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const users = await retriveData("products");
    const data = users.map((u: Partial<user>) => {
      const restObj = { ...(u as Record<string, unknown>) };
      return restObj as Partial<user>;
    });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Success",
      data,
    });
  }
}
