import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import app from "./init";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  listAll,
  deleteObject,
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

export function listenToCollection(
  collectionName: string,
  callback: (data: Array<{ id: string; [key: string]: any }>) => void
) {
  const unsubscribe = onSnapshot(
    collection(firestore, collectionName),
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    },
    (error) => {
      console.error("Error listening to collection:", error);
    }
  );
  return unsubscribe;
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

export async function uploadImage(
  id: string,
  image: any,
  collection: string,
  newName: string,
  callback: Function
) {
  // validate presence
  if (!image) return callback(false, undefined, "No file provided");

  // accept only image mime types
  if (image.type && !image.type.startsWith("image/")) {
    return callback(false, undefined, "File must be an image");
  }

  // limit to 1 MB
  const MAX_SIZE = 1 * 1024 * 1024; // 1MB
  if (typeof image.size === "number" && image.size > MAX_SIZE) {
    return callback(false, undefined, "File size exceeds 1MB");
  }

  // proceed with upload
  try {
    //const newName = `${type}.${image.name.split(".")[1]}`;
    const storageRef = ref(storage, `images/${collection}/${id}/${newName}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        return callback(false, undefined, error?.message || "Upload error");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            callback(true, downloadURL);
          })
          .catch((err) =>
            callback(
              false,
              undefined,
              err?.message || "Failed to get download URL"
            )
          );
      }
    );
  } catch (err) {
    console.error(err);
    const e = err as { message?: string };
    return callback(false, undefined, e.message || "Unexpected error");
  }
}

export async function getAllImagesFromStorage(id: string) {
  try {
    const folderRef = ref(storage, `images/products/${id}`);
    const result = await listAll(folderRef);

    const images = await Promise.all(
      result.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url: downloadURL,
        };
      })
    );

    return images;
  } catch (error) {
    console.error("Error fetching images from storage:", error);
    throw error;
  }
}

export async function deleteFile(url: string, callback: Function) {
  const fileRef = ref(storage, url);
  try {
    await deleteObject(fileRef).then(() => {
      callback(true);
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    callback(false);
  }
}

export async function deleteMultipleFiles(
  paths: string[],
  callback: (successCount: number, totalCount: number) => void
) {
  let successCount = 0;
  const totalCount = paths.length;

  try {
    await Promise.all(
      paths.map(async (path) => {
        try {
          const fileRef = ref(storage, path);
          await deleteObject(fileRef);
          successCount++;
        } catch (error) {
          console.error(`Error deleting file at ${path}:`, error);
        }
      })
    );
    callback(successCount, totalCount);
  } catch (error) {
    console.error("Error deleting multiple files:", error);
    callback(successCount, totalCount);
  }
}
