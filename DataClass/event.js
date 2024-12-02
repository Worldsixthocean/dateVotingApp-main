import { collection, doc, addDoc, updateDoc, arrayUnion, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes,deleteObject} from 'firebase/storage';
import { db, events, users, storage } from '../ContextAndConfig/firebaseConfig.js';
import {addOrganizeToUser, addAttendeesToUser, removeOrganizeToUser, removeAttendeesToUser, 
  addPendingToUser, fetchUser, removePendingToUser, lastUpdateTime} from './user.js';


export async function addEvent(user, name, details, attendees, dates, organizers, pending){

    const eventDocRef = await addDoc(collection(db, 'events'), {
        eventName: name,
        description: details,
        attendees: attendees,
        dates: dates.map((date)=> ({date: date, available: [], maybe: []})),
        organizers: organizers,
        pending: pending,
        imageformat: '',
        eventOption: {
          allowAddAttendees: false,
          allowRemoveAttendees: false,
          allowAddTime: false,
          allowRemoveTime: false,
          joinViaCode: false,
          joinViaEmail: false
        }
      });

    pending.forEach(async(pendingUser) => {
      addPendingToUser(user.uid, pendingUser.uid, eventDocRef.id);
    })
    attendees.forEach(async(attendee) => {
      addAttendeesToUser(attendee.uid, eventDocRef.id);
    });
    organizers.forEach(async(organizer) => {
      addOrganizeToUser(organizer.uid, eventDocRef.id);
    });
      

}

export async function uploadEventPic(eventID, uri, type){
  const response = await fetch(uri);
  const blob = await response.blob();
  const picRef = ref(storage, 'event/' + eventID + type);
  return new Promise((resolve) => {
  uploadBytes(picRef, blob).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  }).then(()=>resolve());
  });
}

export async function deleteEventPic(eventID, type){
  const picRef = ref(storage, 'event/' + eventID + type);
  return new Promise((resolve) => {
    deleteObject(picRef).then(() => {
    console.log('File deleted successfully');
  })
  .then(()=>resolve()).catch((e)=>{console.log(e)});
  });
}

export async function editEvent(user, eventID, name, details, attendees, dates, 
  organizers, removedAttenders, removedOrganizers, pending, removedPendings,imageformat,
  eventOption
){
  
    const docRef = doc(db, 'events', eventID)

    await updateDoc(docRef, {
        eventName: name,
        description: details,
        attendees: attendees,
        dates: dates,
        organizers: organizers,
        pending: pending,
        imageformat: imageformat,
        eventOption: eventOption
      });

      //removedAttenders: just storing the userID
      removedAttenders.forEach(async(attendee) => {
        removeAttendeesToUser(attendee, eventID)
          .catch((e)=>{console.log(e)});
      });
      removedOrganizers.forEach(async(organizer) => {
        removeOrganizeToUser(organizer, eventID)
          .catch((e)=>{console.log(e)});
      });
      removedPendings.forEach(async(pending) => {
        removePendingToUser(pending, eventID)
          .catch((e)=>{console.log(e)});
      });
      
      pending.forEach(async(attendee) => {
        addPendingToUser(user.uid, attendee.uid, eventID)
          .catch((e)=>{console.log(e)});
      });
      organizers.forEach(async(organizer) => {
        addOrganizeToUser(organizer.uid, eventID)
          .catch((e)=>{console.log(e)});
      });

      attendees.forEach(async(attendee) => {
        lastUpdateTime(attendee.uid, eventID)
          .catch((e)=>{console.log(e)});
      });

}

export async function fetchEvent(id){
  const docRef = doc(db, "events", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
      return docSnap.data();
  } else {
    console.log("No such document!");
  }
}

export async function newFetchEvent(id){
  const docRef = doc(db, "events", id);
  const docSnap = await getDoc(docRef);
  return new Promise((resolve, reject) => {
    if (docSnap.exists()) {
      resolve(docSnap.data());
    } else {
      reject(new Error("This event does not exist. Are you giving a wrong code?"));
    }
  })
}


export async function joinEvent(eventID, uid){

  return new Promise((resolve, reject) => {
    newFetchEvent(eventID).then((eDoc)=>{
      if(userInList(eDoc.attendees, uid)||userInList(eDoc.organizers, uid)){
        reject(new Error("You have already join this event!"));
      }
      else if (userInList(eDoc.pending, uid)||eDoc.eventOption.joinViaCode){
        fetchUser(uid).then((uDoc)=>{
          eNewPending = eDoc.pending.filter((p) => p.uid != uid);
          uNewPending = uDoc.pending.filter((p) => p.eventID != eventID);
          const uDocRef = doc(db, "users", uid);
          const eDocRef = doc(db, "events", eventID);

          updateDoc(eDocRef, {
            pending: eNewPending,
            attendees: arrayUnion({
              name: uDoc.user,
              email: uDoc.email,
              uid: uDoc.uid
            })
          }).then(()=> 
          updateDoc(uDocRef, {
            pending: uNewPending,
            events: arrayUnion(eventID)
          })).then(()=> 
          resolve('ok'))
        });
      }
      else {
        reject(new Error("The event is private; you need invitation to join this event."));
      }
    } ).catch((e)=>reject(e));
  })
}

export async function confirmInvitation(eventID, uid){
  invEvent = await fetchEvent(eventID);  
  if(userInList(invEvent.pending, uid)){
    invUser = await fetchUser(uid);

    eNewPending = invEvent.pending.filter((p) => p.uid != uid);
    const eDocRef = doc(db, "events", eventID);

    await updateDoc(eDocRef, {
      pending: eNewPending,
      attendees: arrayUnion({
        name: invUser.user,
        email: invUser.email,
        uid: invUser.uid
      })
    });
    
    uNewPending = invUser.pending.filter((p) => p.eventID != eventID);
    const uDocRef = doc(db, "users", uid);
    await updateDoc(uDocRef, {
      pending: uNewPending,
      events: arrayUnion(eventID)
    });
  }
  else{
    console.log('user not invited');
  }
}

export async function cancelInvitation(eventID, uid){
  invEvent = await fetchEvent(eventID);
  eNewPending = invEvent.pending.filter((p) => p.uid != uid);
  const eDocRef = doc(db, "events", eventID);
  await updateDoc(eDocRef, {
    pending: eNewPending
  });
  invUser = await fetchUser(uid);
  uNewPending = invUser.pending.filter((p) => p.eventID != eventID);
  const uDocRef = doc(db, "users", uid);
  await updateDoc(uDocRef, {
    pending: uNewPending
  });
}

export function userInList(list, userId){
  return list?.some(
    (item)=>(item.uid == userId));
}

export async function deleteEvent(eventID, attendees, organizers, pending, removedAttenders, removedOrganizers, removedPendings){
  const docRef = doc(db, 'events', eventID);
  pending.forEach(async(pending) => {
    removePendingToUser(pending.uid, eventID)
      .catch((e)=>{console.log(e)});
  });
  organizers.forEach(async(organizer) => {
    removeOrganizeToUser(organizer.uid, eventID)
      .catch((e)=>{console.log(e)});
  });
  attendees.forEach(async(attendee) => {
    removeAttendeesToUser(attendee.uid, eventID)
      .catch((e)=>{console.log(e)});
  });

  removedAttenders.forEach(async(attendee) => {
    removeAttendeesToUser(attendee, eventID)
      .catch((e)=>{console.log(e)});
  });
  removedOrganizers.forEach(async(organizer) => {
    removeOrganizeToUser(organizer, eventID)
      .catch((e)=>{console.log(e)});
  });
  removedPendings.forEach(async(pending) => {
    removePendingToUser(pending, eventID)
      .catch((e)=>{console.log(e)});
  });

  invEvent = await fetchEvent(eventID);
  if(invEvent.imageformat){
    await deleteEventPic(eventID, '.' + invEvent.imageformat).then().catch((e)=>{console.log(e)});
  }

  await deleteDoc(docRef).then(()=>{console.log('ok')}).catch((e)=>{console.log(e)});

  
}