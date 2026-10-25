import { openDB } from "idb";

const dbPromise = openDB("loop-db", 1, {
  upgrade(db) {
    db.createObjectStore("images");
  },
});

export async function saveImage(id, file) {
  const db = await dbPromise;
  await db.put("images", file, id);
}

export async function getImage(id) {
  const db = await dbPromise;
  return db.get("images", id);
}

export async function deleteImage(id) {
  const db = await dbPromise;
  await db.delete("images", id);
}

export async function saveStoryImage(id, file) {
  const db = await dbPromise;
  await db.put("images", file, `story-${id}`);
}

export async function getStoryImage(id) {
  const db = await dbPromise;
  return db.get("images", `story-${id}`);
}

export async function saveAvatarImage(file) {
  const db = await dbPromise;
  await db.put("images", file, "avatar-current");
}

export async function getAvatarImage() {
  const db = await dbPromise;
  return db.get("images", "avatar-current");
}
