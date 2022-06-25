import { doc, updateDoc } from 'firebase/firestore';
import React from 'react'
import { db } from '../../firebase';

function typingstatus(user1) {
    document.addEventListener("keydown",async () => {
        console.log("typing === true");
        await updateDoc(doc(db, "users", user1), {
            isTyping: true,
        });
    });
    const type = async () => {
            console.log("typing === false");
        await updateDoc(doc(db, "users", user1), {
            isTyping: false,
        });
    }
    type()
}

export default typingstatus