import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import app from "./init";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const firestore = getFirestore(app);
const storage = getStorage(app);

export async function retriveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
}

export async function retriveDataById(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(firestore, collectionName, id));
  const data = snapshot.data();
  return data;
}

export async function addData(
  collectionName: string,
  data: any,
  callback: Function
) {
  await addDoc(collection(firestore, collectionName), data).then((res) => {
    callback(true, res);
  });
}

export async function updateData(
  collectionName: string,
  id: string,
  data: any,
  callback: (success: boolean) => void
) {
  const docRef = doc(firestore, collectionName, id);
  try {
    await updateDoc(docRef, data);
    callback(true);
  } catch (error) {
    console.log(error);
    callback(false);
  }
}
export async function deleteData(
  collectionName: string,
  id: string,
  callback: (success: boolean) => void
) {
  const docRef = doc(firestore, collectionName, id);
  await deleteDoc(docRef)
    .then(() => callback(true))
    .catch(() => callback(false));
}

export async function uploadImage(id: string, image: any, callback: Function) {
  if (image)
    if (image.size < 10000000) {
      const newName = `profile.` + image.name.split(".")[1];
      const storageRef = ref(storage, `images/${id}/${newName}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            callback(downloadURL);
          });
        }
      );
    } else {
      return false;
    }
}
