import { collection, getFirestore, query, doc, updateDoc } from "firebase/firestore";
import { getDocs, addDoc, where } from "firebase/firestore";
import app from "@/lib/firebase/init";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import instance from "@/lib/axios/instance";
import { addData } from "@/lib/firebase/service";

const firestore = getFirestore(app);

export async function signUp(
  userData: {
    email: string;
    fullname: string;
    password: string;
    image?: string;
    role?: string;
    phone?: string;
    updatedAt?: Date;
    createdAt?: Date;
  },
  callback: (
    success: boolean,
    message?: string,
    extra?: { verificationToken?: string; email?: string }
  ) => void
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
    callback(false, "Email already registered");
  } else {
    if (!userData.role) {
      userData.role = "member";
    }
    userData.phone = "";
    userData.image = "";
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.createdAt = new Date();
    userData.updatedAt = new Date();

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 jam

    const payload = {
      ...userData,
      emailVerified: false,
      verificationToken,
      verificationTokenExpires: tokenExpires,
    };

    await addDoc(collection(firestore, "users"), payload)
      .then(() => {
        callback(true, "Registration Berhasil.", {
          verificationToken,
          email: userData.email,
        });
      })
      .catch(() => {
        callback(false, "Registration Gagal.");
      });
  }
}

export async function verifyEmailToken(email: string, token: string) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", email)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return { success: false, message: "User tidak ditemukan." };
  }
  const userDoc = snapshot.docs[0];
  const user = userDoc.data() as {
    emailVerified?: boolean;
    verificationToken?: string;
    verificationTokenExpires?: number;
  };

  if (user.emailVerified) {
    return { success: true, message: "Email sudah terverifikasi." };
  }
  if (!user.verificationToken || user.verificationToken !== token) {
    return { success: false, message: "Token tidak valid." };
  }
  if (
    !user.verificationTokenExpires ||
    Date.now() > user.verificationTokenExpires
  ) {
    return { success: false, message: "Token sudah kedaluwarsa." };
  }

  await updateDoc(doc(firestore, "users", userDoc.id), {
    emailVerified: true,
    verificationToken: null,
    verificationTokenExpires: null,
    updatedAt: new Date(),
  });
  return { success: true, message: "Email berhasil diverifikasi." };
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
    phone?: string;
    updatedAt?: Date;
    createdAt?: Date;
  },
  callback: (data: Record<string, unknown>) => void
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
    data.phone = "";
    data.role = "member";
    data.createdAt = new Date();
    data.updatedAt = new Date();
    await addData("users", data, (status: boolean, res: unknown) => {
      data.id = (res as { path: string })?.path?.replace("users/", "");
      if (status) {
        callback(data);
      }
    });
  }
}

export const authService = {
  registerAccount: (data: Record<string, unknown>) => instance.post("/api/user/register", data),
};
