import { collection, getFirestore, query } from "firebase/firestore";
import { getDocs, addDoc, where } from "firebase/firestore";
import app from "@/lib/firebase/init";
import bcrypt from "bcryptjs";
import instance from "@/lib/axios/instance";
import { addData } from "@/lib/firebase/service";

const firestore = getFirestore(app);

export async function signUp(
  userData: {
    email: string;
    fullname: string;
    password: string;
    image?: string;
    role: string;
    updatedAt?: Date;
    createdAt?: Date;
  },
  callback: (success: boolean, message?: string) => void
) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", userData.email)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (data.length > 0) {
    callback(false);
  } else {
    if (!userData.role) {
      userData.role = "member";
    }
    userData.image = "";
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.createdAt = new Date();
    userData.updatedAt = new Date();
    await addDoc(collection(firestore, "users"), userData)
      .then(() => {
        callback(true, "Registration Berhasil.");
      })
      .catch(() => {
        callback(false, "Registration Gagal.");
      });
  }
}

export async function SignIn(email: string) {
  const q = query(collection(firestore, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (data) {
    return data[0];
  } else {
    return null;
  }
}

export async function loginWithGoogle(
  data: {
    id?: string;
    email: string;
    fullname: string;
    type: string;
    role: string;
    image?: string;
    updatedAt?: Date;
    createdAt?: Date;
  },
  callback: (data: any) => void
) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", data.email)
  );
  const snapshot = await getDocs(q);
  const user = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (user.length > 0) {
    callback(user[0]);
  } else {
    data.role = "member";
    data.createdAt = new Date();
    data.updatedAt = new Date();
    await addData("users", data, (status: boolean, res: any) => {
      data.id = res.path.replace("users/", "");
      if (status) {
        callback(data);
      }
    });
  }
}

export const authService = {
  registerAccount: (data: any) => instance.post("/api/user/register", data),
};
