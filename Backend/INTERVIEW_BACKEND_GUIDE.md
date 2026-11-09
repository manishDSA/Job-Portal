# Job Portal Backend Architecture & Interview Master Guide
*(Node.js, Express.js, PostgreSQL, Prisma ORM, and Gemini AI)*

---

## 🎯 1. 30-Second Elevator Pitch (Start Your Interview Like a Pro)

> **Interviewer:** *"Can you give me an overview of your backend project?"*
> 
> **Your Answer:**
> *"I built a scalable, RESTful backend for a full-stack **Job Portal & Recruitment Platform** using **Node.js** and **Express.js**. For the database layer, I used **PostgreSQL** paired with **Prisma ORM** for schema integrity, type safety, and efficient relationship management between Recruiters, Applicants, Companies, and Jobs.*
> 
> *For security, I implemented **JWT-based stateless authentication** stored in **HttpOnly Cookies** with **Bcrypt** password hashing and role-based access control (Student vs Recruiter). File uploads like resumes and company logos are handled in-memory using **Multer** and streamed to **Cloudinary**.*
> 
> *Additionally, I built an **AI Intelligence layer** integrated with **Google Gemini API** that handles automated ATS resume matching, interview preparation questions, applicant ranking, and job description generation."*

---

## 🏗️ 2. High-Level Architecture Overview

```
                      +---------------------------------------+
                      |       Client (React / Browser)        |
                      +---------------------------------------+
                                          |
                                HTTP / JSON Requests
                               (Cookies with JWT Token)
                                          v
                      +---------------------------------------+
                      |         Express.js HTTP Server        |
                      |            (Port: 8000)               |
                      +---------------------------------------+
                                          |
    +-------------------------------------+-------------------------------------+
    |                                     |                                     |
    v                                     v                                     v
[CORS Middleware]                [Body / Cookie Parser]              [Auth Middleware]
(Origin check & credentials)     (req.body, req.cookies)             (JWT verification & req.id)
    +-------------------------------------+-------------------------------------+
                                          |
                                          v
                                   [Route Handlers]
         +----------------+---------------+---------------+---------------+
         |                |               |               |               |
     /api/v1/user   /api/v1/company  /api/v1/job  /api/v1/application  /api/v1/ai
         |                |               |               |               |
         v                v               v               v               v
  userControllers  companyControllers jobControllers  applicationCtrl    aiControllers
         \                |               /               /               /
          \               |              /               /               /
           v              v             v               v               v
         +------------------------------------------------+       +--------------+
         |            Prisma ORM (Data Layer)             |       | Google Gemini|
         +------------------------------------------------+       |   GenAI SDK  |
                                  |                               +--------------+
                                  v                                      |
                      +-----------------------+                          v
                      | PostgreSQL Database   |                   ATS Analysis &
                      |   (JobDB on 5432)     |                  Job Description
                      +-----------------------+
```

---

## ⚙️ 3. Core Technologies & Why They Were Chosen

| Technology | Purpose in This Project | Why We Chose It (Interview Answer) |
| :--- | :--- | :--- |
| **Node.js** | Backend Runtime Environment | Fast, asynchronous, non-blocking I/O event loop; ideal for I/O-heavy operations like database queries and API calls. |
| **Express.js** | Web Framework | Lightweight, unopinionated, excellent middleware support, and makes building RESTful routing simple and modular. |
| **PostgreSQL** | Relational Database (RDBMS) | Strong ACID compliance, relational integrity (foreign keys between Users, Jobs, Companies, Applications). |
| **Prisma ORM** | Database Toolkit & ORM | Auto-generated type-safe queries, migration management, and automatic relationship joins (`include: { company: true }`). |
| **JWT (JsonWebToken)** | User Authentication | Stateless session management. No server-side session memory overhead; validated securely via cryptographic signature. |
| **Bcryptjs** | Password Hashing | One-way salted hashing algorithm to protect passwords against rainbow table and brute-force attacks. |
| **Multer & DataURI** | File Upload Handling | Intercepts `multipart/form-data` in memory buffer without writing temporary files to server disk. |
| **Cloudinary** | Cloud File Storage / CDN | Offloads heavy static assets (PDF resumes, profile images, logos) to a high-speed CDN. |
| **Google Gemini API** | AI / LLM Engine | Provides ATS resume score matching, recruiter job description generation, and candidate evaluation. |

---

## 🔍 4. Step-by-Step Request Lifecycle (How a Request Travels)

Let's understand how a request moves through the server when a user wants to view all applied jobs:

1. **Client Request:** 
   The React frontend sends `GET /api/v1/application/get` with HTTP cookies attached (`credentials: true`).
2. **Global Middlewares (`index.js`):**
   - **`cors()`**: Checks if the request came from `http://localhost:5173`.
   - **`express.json()`**: Parses incoming JSON payloads.
   - **`cookieParser()`**: Reads the cookie header and populates `req.cookies`.
3. **Route Matching (`routes/applicationRoute.js`):**
   - Express matches `/api/v1/application/get`.
4. **Authentication Middleware (`isAuthenticated.js`):**
   - Extracts `req.cookies.token`.
   - Verifies the signature using `jwt.verify(token, process.env.SECRET_KEY)`.
   - Attaches `req.id = decode.userId` to the request object and calls `next()`.
5. **Controller Execution (`applicationControllers.js` -> `getAppliedJobs`):**
   - Reads `const userId = req.id`.
   - Calls Prisma ORM: `prisma.application.findMany({ where: { applicantId: userId }, include: { job: { include: { company: true } } } })`.
6. **Data Formatting & Response (`format.js`):**
   - Normalizes data shape (`formatApplication`) for frontend compatibility.
   - Sends response: `res.status(200).json({ success: true, application: [...] })`.

---

## 📂 5. Deep-Dive into the Codebase Modules

### 1. The Server Entry Point: `index.js`
* **What it does:** Initializes Express app, registers middleware, mounts API routes, and starts the HTTP server.
* **Key Code Logic:**
  ```javascript
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

  // Routes registration
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/company", companyRouter);
  app.use("/api/v1/job", JobRouter);
  app.use("/api/v1/application", appicationRouter);
  app.use("/api/v1/ai", aiRouter);
  ```

---

### 2. Authentication & Authorization: `middlewares/isAuthenticated.js`
* **What it does:** Protects private endpoints from unauthorized access.
* **Why HttpOnly Cookies?** Storing JWT in `HttpOnly` cookies protects the token from Cross-Site Scripting (XSS) attacks because JavaScript running in the browser cannot access `document.cookie`.
* **Flow:**
  ```javascript
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "User not authenticated" });

  const decode = await jwt.verify(token, process.env.SECRET_KEY);
  req.id = decode.userId; // Makes user ID available to the next controller
  next();
  ```

---

### 3. File Upload Pipeline: `Multer` + `DataURI` + `Cloudinary`
* **Problem:** Saving files directly on a Node.js server disk is dangerous for scalable apps (server instances are ephemeral and can crash/restart).
* **Our Solution:**
  1. `multer({ storage: multer.memoryStorage() })`: Keeps the uploaded file in memory as a `Buffer`.
  2. `getDataUri(file)`: Formats the buffer into a 64-bit base64 data URI string.
  3. `cloudinary.uploader.upload(fileUrl.content)`: Streams the file to Cloudinary cloud storage and returns a secure public URL (`secure_url`).
  4. The secure URL is saved in PostgreSQL database.

---

### 4. Database Schema Design: `prisma/schema.prisma`
* **Key Entities & Relations:**
  1. **User:** Has `role` (`student` or `recruiter`).
     - A user can create multiple `Company` records.
     - A recruiter can post multiple `Job` records.
     - A student can create multiple `Application` records.
  2. **Company:** Belongs to a User (`userId`). Contains company details, website, and logo.
  3. **Job:** Belongs to a Company (`companyId`) and is created by a User (`createdById`). Contains requirements, salary, location, job type, and experience level.
  4. **Application:** Junction table between `Job` and `User` (Applicant).
     - Contains status (`pending`, `accepted`, `rejected`).
     - **Unique Constraint:** `@@unique([jobId, applicantId])` prevents a student from applying to the same job twice!
     - **Cascading Deletes:** `onDelete: Cascade` ensures clean data removal if parent records are deleted.

---

### 5. Unique AI Features: `aiControllers.js` & `gemini.js`
* **Google Gemini AI Integration:**
  - **ATS Resume Matcher:** Compares applicant skills/bio against job description, returning a match percentage score, missing skills, and improvement suggestions.
  - **Auto Job Description Generator:** Recruiter enters title & level; Gemini automatically writes comprehensive descriptions and requirement lists.
  - **Tailored Cover Letter Generator:** Generates custom cover letters matching candidate profile with job specs.
  - **Applicant Ranking:** Ranks all candidates who applied to a job using AI scoring.
  - **Interview Prep:** Generates role-specific behavioral and technical interview questions with sample answers for candidates.

---

## 💬 6. Top 10 Backend Interview Questions & Direct Answers

### Q1: What is Node.js and how does its Event Loop work?
**Answer (Simple & Impressive):**
> *"Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 engine. Unlike traditional multi-threaded servers (like Apache) that create a new thread for every request, Node.js operates on a **single-threaded, non-blocking, event-driven architecture** using `libuv`.
> 
> When an I/O operation occurs (like querying PostgreSQL or calling Cloudinary), Node.js offloads that task to the system kernel or thread pool. The main thread immediately continues executing other requests. Once the I/O task completes, its callback is placed in the event loop queue and executed. This makes Node.js lightweight and highly performant for I/O-intensive applications like our Job Portal."*

---

### Q2: Why did you use Express.js instead of building with pure Node HTTP?
**Answer:**
> *"Pure Node.js `http` module requires manually parsing URLs, reading streaming request body chunks, managing headers, and writing custom routing trees. Express.js is a minimalist web framework that gives us:
> 1. Clean RESTful routing (`Router`).
> 2. Middleware pipeline support (`app.use()`).
> 3. Built-in helpers for JSON response handling (`res.json()`, `res.status()`).
> 4. Easy integration of security headers, CORS, and cookie parsing."*

---

### Q3: How did you implement Authentication and why did you choose HttpOnly cookies?
**Answer:**
> *"When a user logs in, we verify the email, compare the hashed password using `bcrypt.compare()`, and generate a JSON Web Token signed with a secret key.
> 
> Instead of sending the token in the response body to be stored in browser `localStorage`, we set it inside an **`HttpOnly`, `SameSite: strict` Cookie**. 
> - **Why?** Tokens in `localStorage` can be stolen via Cross-Site Scripting (XSS) attacks by any injected malicious script. An `HttpOnly` cookie cannot be accessed by client-side JavaScript, significantly enhancing our app's security."*

---

### Q4: What is Middleware in Express? Can you name the ones you used?
**Answer:**
> *"Middleware in Express is a function that has access to the Request object (`req`), Response object (`res`), and the `next` function in the application's request-response cycle. It can execute code, modify `req` and `res`, end the request-response cycle, or call `next()` to pass control forward.
> 
> In this project, I used:
> 1. **Built-in Middleware:** `express.json()` and `express.urlencoded()` to parse request bodies.
> 2. **Third-party Middleware:** `cors()` for Cross-Origin Resource Sharing and `cookie-parser` to parse cookies.
> 3. **Custom Auth Middleware:** `isAuthenticated` to verify the JWT token and attach `req.id = decode.userId`.
> 4. **File Middleware:** `multer` (`singleUpload`) to intercept multipart file uploads in memory."*

---

### Q5: Why did you choose Prisma ORM with PostgreSQL?
**Answer:**
> *"Job Portals have strongly relational data: Users create Companies, Companies have Jobs, and Users submit Applications for Jobs.
> 1. **PostgreSQL** provides ACID transactions and foreign key constraints to maintain database consistency.
> 2. **Prisma ORM** provides:
>    - Declarative schema modeling in `schema.prisma`.
>    - Type-safety and auto-completion in controllers, preventing typo bugs.
>    - Easy relationship querying using `include` (e.g. fetching a Job with its Company and Applications in a single query).
>    - Automated migrations (`prisma migrate dev`)."*

---

### Q6: How do you prevent a student from applying to the same job multiple times?
**Answer:**
> *"We implemented a two-tier defense:
> 1. **Database Layer:** In `schema.prisma`, we added a compound unique constraint: `@@unique([jobId, applicantId])`. This guarantees at the database level that no duplicate row can ever exist.
> 2. **Application / Controller Layer:** In `applyJob` controller, we execute a query `prisma.application.findFirst({ where: { jobId, applicantId } })`. If an application is found, we return a `400 Bad Request` with message: `'You have already applied for this job'`."*

---

### Q7: How does search and filtering work in your Job search endpoint?
**Answer:**
> *"In `getAllJobs`, we accept a search query parameter `Keyword`. If a keyword is provided, we build a Prisma conditional filter using case-insensitive search (`mode: 'insensitive'`):
> ```javascript
> const whereCondition = Keyword.trim() !== "" ? {
>     OR: [
>         { title: { contains: Keyword, mode: 'insensitive' } },
>         { description: { contains: Keyword, mode: 'insensitive' } },
>         { location: { contains: Keyword, mode: 'insensitive' } },
>     ]
> } : {};
> ```
> This allows candidates to search across job titles, descriptions, or locations simultaneously in a single query."*

---

### Q8: What is `format.js` and why was it created in your backend?
**Answer:**
> *"When we migrated our database to PostgreSQL and Prisma ORM, Prisma models use standard `id` field names and flat relational structures, whereas our frontend React Redux state had legacy selectors expecting MongoDB formats like `_id` and nested `profile` objects.
> 
> Instead of breaking or rewriting dozens of frontend UI components, I implemented an **Adapter Pattern** via `format.js`. It shapes the Prisma response to include both `id` and `_id`, along with mapped profile structures. This decoupled the frontend from database schema migrations."*

---

### Q9: How did you handle file uploads without slowing down your Node server?
**Answer:**
> *"Instead of saving files to the server's local disk (which consumes disk space, causes disk I/O bottlenecks, and fails in containerized/serverless environments like Docker or Vercel), I configured Multer with `memoryStorage()`.
> 
> The incoming file is held temporarily in RAM as a buffer, converted into a DataURI, and uploaded directly to Cloudinary CDN via their SDK. We only store the resulting HTTPS CDN URL in PostgreSQL. This keeps the Node.js process lightweight and stateless."*

---

### Q10: How does the AI integration work in your backend?
**Answer:**
> *"We integrated the `@google/genai` SDK with Google Gemini models. In `utils/gemini.js`, we built a fallback architecture that iterates across reliable Gemini models (such as `gemini-flash-latest`, `gemini-2.5-flash`).
> 
> For ATS resume scoring, the controller fetches the candidate's skills and resume data alongside the job description requirements and prompts Gemini to perform semantic matching. The response is parsed as structured JSON containing a match score (0-100), key matched skills, missing skills, and actionable recommendations."*

---

## ⚡ 7. Quick Revision Checklist (Read 5 Minutes Before Interview)

1. **Port:** Server runs on port `8000`.
2. **CORS:** Accepts requests from `http://localhost:5173` with `credentials: true`.
3. **Database:** PostgreSQL named `JobDB` connected through Prisma ORM and `pg` client.
4. **Roles:** `student` and `recruiter`.
5. **Password Encryption:** Bcrypt with 10 salt rounds.
6. **Token:** JWT with 1-day expiration stored in HttpOnly cookie named `token`.
7. **Cloud Upload:** Multer (memoryStorage) -> DataURI -> Cloudinary.
8. **Main Models:** `User`, `Company`, `Job`, `Application`.
9. **AI Engine:** Google Gemini Flash for ATS matching, JD generation, and interview questions.
10. **Architecture Pattern:** MVC (Model via Prisma, View handled by React, Controller via Express Controllers).
