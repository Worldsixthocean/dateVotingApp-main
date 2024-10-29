import { collection, doc, addDoc, updateDoc, arrayUnion,arrayRemove, getDoc } from 'firebase/firestore';
import { db} from '../ContextAndConfig/firebaseConfig.js'

export async function addPendingToUser(invite, uid, eventID){
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
        pending: arrayUnion({
            invite: invite,
            eventID: eventID
        })
    });
}

export async function removePendingToUser(uid, eventID){
    rmUser = await fetchUser(uid);
    uNewPending = rmUser.pending.filter((p) => p.eventID != eventID);
    const uDocRef = doc(db, "users", uid);
    await updateDoc(uDocRef, {
      pending: uNewPending
    });
}

export async function addOrganizeToUser(uid, eventID){
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
        organize: arrayUnion(eventID)
    });
}

export async function removeOrganizeToUser(uid, eventID){
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
        organize: arrayRemove(eventID)
    });
}

export async function addAttendeesToUser(uid, eventID){
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
        events: arrayUnion(eventID)
    });
}

export async function removeAttendeesToUser(uid, eventID){
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
        events: arrayRemove(eventID)
    });
}

export async function fetchUser(id){
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
      console.log("No such document!");
    }
}