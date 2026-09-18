import { jwtDecode } from "jwt-decode";

/**
 * Parses Google Credential Response or Google Access Token to extract actual Google User Details
 * @param {object} response - Credential response from @react-oauth/google
 * @returns {object} { fullname, email, profilePhoto, provider }
 */
export const processGoogleUserCredential = async (response) => {
    try {
        if (response.credential) {
            const decoded = jwtDecode(response.credential);
            return {
                fullname: decoded.name || decoded.given_name || "Google User",
                email: decoded.email,
                profilePhoto: decoded.picture || "",
                provider: "Google"
            };
        }
        
        if (response.access_token) {
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` }
            });
            const userInfo = await userInfoRes.json();
            return {
                fullname: userInfo.name || userInfo.given_name || "Google User",
                email: userInfo.email,
                profilePhoto: userInfo.picture || "",
                provider: "Google"
            };
        }

        throw new Error("No credential or access token returned from Google");
    } catch (error) {
        console.error("Error decoding Google credential:", error);
        throw error;
    }
};

/**
 * Checks if a real Google Client ID is configured in environment variables
 */
export const isGoogleClientIdConfigured = () => {
    const id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    return Boolean(id && id !== "YOUR_GOOGLE_CLIENT_ID" && !id.includes("demoappgoogleoauthid"));
};
