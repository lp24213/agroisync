import { getFirestore, collection, addDoc } from 'firebase/firestore'

export async function registerWhitelistUser(email, wallet) {
  const db = getFirestore()
  const ref = collection(db, 'whitelist')
  await addDoc(ref, {
    email,
    wallet,
    timestamp: new Date().toISOString()
  })
}