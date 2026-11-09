# How Frontend and Backend Connect in Job Portal
*(Step-by-Step Architecture & Interview Guide)*

---

## 🌟 1. The Big Picture (How They Talk to Each Other)

In this project, the **Frontend** and **Backend** run as two separate, decoupled applications:
- **Frontend:** React (Vite) running on **`http://localhost:5173`**
- **Backend:** Node.js (Express) running on **`http://localhost:8000`**

Because they run on different ports, they communicate across the network via **HTTP REST APIs** using **Axios**, secured with **CORS** and **HttpOnly Cookies**.

```
+-------------------------------------------------------+
|             REACT FRONTEND (Port 5173)                |
|                                                       |
|  [Components / UI]  <--->  [Redux Toolkit Store]      |
|           │                         ▲                 |
|           ▼                         │ dispatch()      |
|  [Custom Hooks / Axios] ────────────┘                 |
+-------------------------------------------------------+
                           │
             HTTP Requests (GET, POST, PUT)
             Headers: Content-Type: application/json / multipart/form-data
             withCredentials: true (Sends JWT Cookie)
                           │
                           ▼
+-------------------------------------------------------+
|             EXPRESS BACKEND (Port 8000)               |
|                                                       |
|  [1. CORS (Checks Origin: localhost:5173)]            |
|  [2. Body Parser & Cookie Parser]                     |
|  [3. isAuthenticated Middleware (Checks JWT Cookie)]  |
|  [4. Route -> Controller Logic]                       |
|  [5. Prisma ORM <-> PostgreSQL Database]              |
|  [6. Cloudinary / Gemini AI APIs]                     |
|  [7. res.status(200).json({ success: true, data })]   |
+-------------------------------------------------------+
```

---

## 🏛️ 2. The 4 Pillars Connecting Frontend to Backend

---

### Pillar 1: Centralized API Endpoints ([`Frontend_1/src/components/utils/constant.js`](file:///d:/Job-Portal/Frontend_1/src/components/utils/constant.js))

Instead of hardcoding URLs inside individual components, all backend routes are centralized in one file:

```javascript
export const USER_API_END_POINT = "http://localhost:8000/api/v1/user";
export const JOB_API_END_POINT = "http://localhost:8000/api/v1/job";
export const Application_API_END_POINT = "http://localhost:8000/api/v1/application";
export const COMPANY_API_END_POINT = "http://localhost:8000/api/v1/company";
export const AI_API_END_POINT = "http://localhost:8000/api/v1/ai";
```
* **Why this matters in an interview:** If the backend moves from `localhost:8000` to a production domain (e.g. `https://api.myjobportal.com`), you only update this one file or replace it with `import.meta.env.VITE_BACKEND_URL`.

---

### Pillar 2: CORS & Credentials Configuration ([`Backend/index.js`](file:///d:/Job-Portal/Backend/index.js))

Because the browser blocks requests between different ports (`5173` -> `8000`) by default (Same-Origin Policy), the backend must explicitly authorize the frontend.

```javascript
const corsOptions = {
    origin: 'http://localhost:5173', // Only allow our React app
    credentials: true,               // Allow sending cookies & authorization headers
};
app.use(cors(corsOptions));
```

* **The golden rule of cookies:** For cookies to travel across different ports, `credentials: true` must be enabled on **both** the backend (in CORS) and the frontend (in Axios).

---

### Pillar 3: Axios Requests with `withCredentials: true`

Whenever the frontend talks to the backend, it uses **Axios** with `{ withCredentials: true }`.

#### A. Example: Normal JSON Request (Login) ([`Login.jsx`](file:///d:/Job-Portal/Frontend_1/src/components/auth/Login.jsx#L170-L185))
```javascript
const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true, // Tells browser to accept and store the "token" cookie
});

if (res.data.success) {
    dispatch(setUser(res.data.user)); // Save user in Redux
    navigate("/");
}
```

#### B. Example: File Upload Request (Update Profile / Resume) ([`UpdateProfileDialog.jsx`](file:///d:/Job-Portal/Frontend_1/src/components/UpdateProfileDialog.jsx))
When sending binary files (PDF resumes, avatars), standard JSON won't work. The frontend bundles data into `FormData`:
```javascript
const formData = new FormData();
formData.append("fullname", input.fullname);
formData.append("skills", input.skills);
if (input.file) {
    formData.append("file", input.file); // The PDF resume or image
}

const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
    headers: {
        "Content-Type": "multipart/form-data" // Informs Multer on backend
    },
    withCredentials: true
});
```

---

### Pillar 4: Connecting Backend Data to React UI via Redux & Custom Hooks

To prevent component clutter, data fetching logic is abstracted into **Custom Hooks**.

#### Example: [`useGetAllJobs.jsx`](file:///d:/Job-Portal/Frontend_1/src/hooks/useGetAllJobs.jsx)
```javascript
const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                // Fetch from Backend
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get?Keyword=${searchedQuery}`,
                    { withCredentials: true }
                );
                // Dispatch response data into Redux Store
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllJobs();
    }, [searchedQuery]);
};
```

1. **Custom Hook runs:** Executes `axios.get()` on component mount.
2. **Backend responds:** Returns `{ success: true, jobs: [...] }`.
3. **Redux Store updates:** `dispatch(setAllJobs(res.data.jobs))` stores the jobs globally.
4. **React Components re-render:** Any component (like `Jobs.jsx` or `Browse.jsx`) reads from Redux using `useSelector((state) => state.job.allJobs)` and displays the job cards!

---

## 🔒 3. How Authentication Flow Works Between Frontend and Backend

```
1. USER CLICKS LOGIN
   Frontend sends POST /api/v1/user/login with { email, password, role }
   
2. BACKEND PROCESSES
   Backend validates password with bcrypt.compare()
   Backend signs JWT token: jwt.sign({ userId }, SECRET_KEY)
   Backend sends cookie in HTTP response header:
   Set-Cookie: token=eyJhbG...; HttpOnly; SameSite=Strict; Path=/

3. BROWSER SAVES COOKIE
   Browser automatically stores the cookie for "localhost:8000".
   JavaScript cannot read this cookie (protects against XSS).

4. SUBSEQUENT PROTECTED REQUESTS (e.g. Apply for Job, Post Job)
   When frontend calls axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true })
   The browser automatically attaches the "token" cookie in request headers!
   
5. BACKEND MIDDLEWARE VERIFIES
   isAuthenticated middleware reads req.cookies.token
   Validates with jwt.verify() -> assigns req.id = decode.userId
   Passes control to controller -> Returns authorized data!

6. USER CLICKS LOGOUT
   Frontend calls GET /api/v1/user/logout
   Backend sets cookie maxAge: 0 (deletes the cookie)
   Frontend dispatches setUser(null) in Redux.
```

---

## 🎯 4. Top Interview Questions on Frontend-Backend Connection

### Q1: How do frontend and backend communicate in your project?
> **Answer:**
> *"They communicate over HTTP REST APIs. The React frontend uses **Axios** to send requests to Express backend endpoints. We use JSON for standard payloads and `multipart/form-data` with JavaScript `FormData` for file uploads like resumes and profile pictures."*

### Q2: What is `withCredentials: true` and why is it mandatory in your project?
> **Answer:**
> *"By default, browsers do not include credentials (like cookies or HTTP authentication headers) in cross-origin requests. 
> Because our frontend is on `localhost:5173` and backend is on `localhost:8000`, we must specify `withCredentials: true` in our Axios requests and configure `cors({ credentials: true })` on the backend. This enables the browser to automatically send and receive our JWT authentication cookie."*

### Q3: How do you handle file uploads from React to Node.js?
> **Answer:**
> *"In React, when a user selects a file (e.g., a PDF resume), we capture it using `e.target.files[0]` and append it to a `FormData` object. We send it via Axios with `Content-Type: multipart/form-data`.
> On the Express backend, **Multer** intercepts the incoming multipart stream in memory (`memoryStorage`), converts it to a DataURI, and uploads it to **Cloudinary CDN**, returning the secure URL to save in PostgreSQL."*

### Q4: How is state persisted when the user refreshes the page?
> **Answer:**
> *"We use **Redux Toolkit** combined with **redux-persist**. The authentication state (`authSlice`) is automatically synchronized to browser `localStorage` or `sessionStorage`. When the page reloads, `redux-persist` rehydrates the Redux store, so the user remains logged in seamlessly."*
