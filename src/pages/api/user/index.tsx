import { deleteData, retriveData, updateData } from "@/lib/firebase/service";
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
  } else if (req.method === "PUT") {
    const { id, data } = req.body;
    await updateData(`users`, id, data, (result: boolean) => {
      if (result) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Success",
        });
      } else {
        res.status(400).json({
          status: false,
          statusCode: 400,
          message: "Failed",
        });
      }
    });
  } else if (req.method === "DELETE") {
    const { user }: any = req.query;
    console.log("Method:", req.method);
    console.log("Query:", req.query);

    if (!user) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Missing user ID",
      });
    }

    await deleteData(`users`, user as string, (result: boolean) => {
      if (result) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Success",
        });
      } else {
        res.status(400).json({
          status: false,
          statusCode: 400,
          message: "Failed",
        });
      }
    });
  }
}
