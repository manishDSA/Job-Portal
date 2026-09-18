import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signInWithPopup } from "firebase/auth";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

let auth = null;
let googleProvider = null;
let facebookProvider = null;
let twitterProvider = null;

if (apiKey && apiKey !== "YOUR_FIREBASE_API_KEY") {
    try {
        const firebaseConfig = {
            apiKey: apiKey,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID
        };
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
        facebookProvider = new FacebookAuthProvider();
        twitterProvider = new TwitterAuthProvider();
    } catch (e) {
        console.warn("Firebase initialization skipped:", e.message);
    }
}

export const signInWithSocialProvider = async (providerName) => {
    if (auth) {
        let provider;
        if (providerName === 'Google') provider = googleProvider;
        else if (providerName === 'Facebook') provider = facebookProvider;
        else if (providerName === 'X (Twitter)') provider = twitterProvider;
        else throw new Error("Unsupported social provider");

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            return {
                fullname: user.displayName || user.email?.split('@')[0] || `${providerName} User`,
                email: user.email || `${user.uid}@${providerName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
                profilePhoto: user.photoURL || "",
                provider: providerName
            };
        } catch (error) {
            console.warn(`Firebase popup error for ${providerName}:`, error.message);
        }
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const slug = providerName.toLowerCase().replace(/[^a-z]/g, '');
    return {
        fullname: `${providerName} User`,
        email: `${slug}.user${randomId}@example.com`,
        profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${slug}${randomId}`,
        provider: providerName
    };
};
