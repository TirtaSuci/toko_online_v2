import WithAuth from "@/middlewares/withAuth";
import { NextResponse } from "next/server";

export function MainMiddleWare() {
  const res = NextResponse.next();
  return res;
}

export default WithAuth(MainMiddleWare, [`admin`, `auth`, `user`]);
