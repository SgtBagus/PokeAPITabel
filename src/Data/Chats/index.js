import {
    collection, query, where, getDocs,
    doc, getDoc, updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";

export const OnSnapshotHandel = async (tableName) => {
    try {
        const data = await query(collection(db, tableName));
        const userData = await getDocs(data);
        const findData = userData.docs.map(doc => doc.data())[0];
        
        return findData;
    } catch (err){
        return err;
    }
}

export const OnSnapshotGetSingleUser = async (tableName, uid) => {
    try {
        const data = await query(collection(db, tableName), where("uid", "==", uid));
        const userData = await getDocs(data);
        const findData = userData.docs.map(doc => doc.data())[0];
        
        return findData;
    } catch (err){
        return err;
    }
}

export const OnSnapshotGetChatMessage = async (tableName, id) => {
    try {
        const docRef = doc(db, tableName, id);
        const data = await getDoc(docRef);
        
        return data.data();
    } catch (err){
        return err;
    }
};


export const changeAllowChatHandel = async (tableName, chatId, param) => {
    try {
        await updateDoc(doc(db, tableName, chatId), param);
    } catch (err) {
        return err;
    }
}
  