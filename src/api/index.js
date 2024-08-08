import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { toast } from "react-toastify";

//? Get user detail
export const getUserDetail = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                const userData = userCred.providerData[0];

                // once the user is authenticated, push the user data to the firestore database
                const unsubscribe = onSnapshot(
                    doc(db, "users", userData?.uid),
                    (_doc) => {
                        if (_doc.exists()) {
                            resolve(_doc.data());
                        } else {
                            setDoc(
                                doc(db, "users", userData?.uid),
                                userData
                            ).then(() => {
                                resolve(userData);
                            });
                        }
                    }
                );

                return unsubscribe;
            } else {
                reject(new Error("User is not authenticated"));
            }

            // make sure to unsubscribe from the listener when the component unmounts to prevent memory leaks
            unsubscribe();
        });
    });
};

//? Get the templates info
export const getTemplates = () => {
    return new Promise((resolve, reject) => {
        const templateQuery = query(
            collection(db, "templates"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
            const templates = querySnap.docs.map((doc) => doc.data());
            resolve(templates);
        });

        return unsubscribe;
    });
};

//? function to add template to user's collection
export const saveToCollection = async (user, data) => {
    // first check if the template is already in the collection or not
    if (!user?.collections?.includes(data?._id)) {
        // if it does not have the template, push it to the collection

        // get the document reference of the user
        const docRef = doc(db, "users", user?.uid);

        await updateDoc(docRef, {
            // arrayUnion method is used to add the template to the collection and it will only add the template if it is not already in the collection
            collections: arrayUnion(data?._id),
        })
            .then(() => {
                toast.success("Saved To Collections");
            })
            .catch((err) => {
                toast.error(`Error: ${err.message}`);
            });
    } else {
        // if it already has the template, remove it from the collection
        const docRef = doc(db, "users", user?.uid);

        await updateDoc(docRef, {
            // arrayRemove method is used to remove the template from the collection if it is already in the collection
            collections: arrayRemove(data?._id),
        })
            .then(() => {
                toast.success("Removed From Collections");
            })
            .catch((err) => {
                toast.error(`Error: ${err.message}`);
            });
    }
};

//? function to add template to user's favorites
export const saveToFavourites = async (user, data) => {
    // first check if the template's favorites collection has user ID or not
    if (!data?.favourites?.includes(user?.uid)) {
        // if it does not have the user id inside favorite collection of template, push it to the template collection

        // get the document reference of the template
        const docRef = doc(db, "templates", data?._id);

        await updateDoc(docRef, {
            favourites: arrayUnion(user?.uid),
        })
            .then(() => {
                toast.success("Added To Favourites");
            })
            .catch((err) => {
                toast.error(`Error: ${err.message}`);
            });
    } else {
        // if favorites collection already has the user id, remove it from the favorites

        // get the document reference of the template
        const docRef = doc(db, "templates", data?._id);

        await updateDoc(docRef, {
            favourites: arrayRemove(user?.uid),
        })
            .then(() => {
                toast.success("Removed From Favourites");
            })
            .catch((err) => {
                toast.error(`Error: ${err.message}`);
            });
    }
};

//? function to get selected template details based on template ID
export const getTemplateDetails = async (templateID) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(
            doc(db, "templates", templateID),
            (doc) => {
                resolve(doc.data());
            }
        );

        return unsubscribe;
    });
};

export const getTemplateDetailEditByUser = (uid, id) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(
            doc(db, "users", uid, "resumes", id),
            (doc) => {
                resolve(doc.data());
            }
        );

        return unsubscribe;
    });
};

export const getSavedResumes = (uid) => {
    return new Promise((resolve, reject) => {
        const templateQuery = query(
            collection(db, "users", uid, "resumes"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
            const templates = querySnap.docs.map((doc) => doc.data());
            resolve(templates);
        });

        return unsubscribe;
    });
};
