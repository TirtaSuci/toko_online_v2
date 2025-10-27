import { retriveData } from "@/lib/firebase/service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const users = await retriveData("users");
    const data = users.map((user: any) => {
      const copy = { ...user };
      delete copy.password;
      delete copy.confirmPassword;
      return copy;
    });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Success",
      data,
    });
  }
}
