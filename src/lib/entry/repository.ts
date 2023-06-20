import type { DocumentReference, DocumentData } from "firebase/firestore";
import { collection, addDoc, getDocs, query, where, orderBy, onSnapshot } from "firebase/firestore";
import type { Entry } from "./model";
import { db } from "$lib/client/firebase";
import { derived } from "svelte/store";
import { browser } from "$app/environment";
import { authUser } from "$lib/client/authStore";

const col = () => collection(db(), "entries");

export const entries = derived(authUser, ($authUser, set) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let unsubscribe = () => {}

  if (browser) {
    if ($authUser) {
      let q = query(col(), where("uid", "==", $authUser.uid));
      q = query(q, orderBy("date", "desc"));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((doc) => doc.data() as Entry);
        set(docs)
      })
    } else {
      set([])
    }
  }

  return unsubscribe
})

export async function createEntry(uid: string, entry: Entry): Promise<DocumentReference<DocumentData>> {
  console.log("createEntry", uid, entry);
  return addDoc(col(), entry)
}

export async function getEntries(uid: string): Promise<Array<Entry>> {
  console.log("getEntries", uid);
  const q = query(col(), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((doc) => doc.data() as Entry);
  console.log("docs", docs);
  return []
}
