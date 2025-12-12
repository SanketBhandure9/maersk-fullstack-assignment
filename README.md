# 01-fullstack-vendor-onboarding

# Trusted Vendors Portal – Full-Stack Assignment

## Objective

Welcome to your application assessment assignment. This is a chance for you to show us your coding and problem solving skills.
You are applying for a fullstack position so this assignment requires you to solve both frontend and backend challenges.

Nobody expects anyone to know everything so if a particular assignment is outside of your realm of experience,
you may either skip it or propose a solution aligned with your experience..

In this repository, you'll find a basic demo implementation of the **Trusted Vendor Portal** application.
Your task is to enhance and deploy this application by completing specific requirements listed below.

The system currently allows users to:

- Register a vendor (name, contact person, email, partner type [Supplier/Partner])
- View a list of registered vendors

---

## Vendor Object Example

    {
      "id": "1",
      "name": "Acme Freight",
      "contact_person": "John Doe",
      "email": "john.doe@acme.com",
      "partner_type": "Supplier"
    }

## Existing Implementation

The repository contains:

- A Vue.js frontend application
- Two backend implementations (choose one):
  - Java (Spring Boot)
  - Node.js (TypeScript)

## Available Backends

You may choose which backend implementation to work with:

### Java (Spring Boot)

- Located in the `backend-java` directory
- Uses H2 in-memory database
- Includes basic create and list operations

### Node.js (TypeScript)

- Located in the `backend-node` directory
- Uses SQLite database
- Includes basic create and list operations

---

## Your Tasks

### 1. Frontend UI Polish

- Refresh the `frontend` layout to highlight your CSS skills. Arrange the form and vendor list in a responsive layout that presents as a single column on mobile and a tidy multi-column layout on desktop using modern CSS (flexbox and/or grid).
- Introduce a lightweight design system by defining CSS variables (colours, spacing, typography) in `src/style.css` and apply them across components.
- Enhance the vendor list with hover/focus states, zebra striping, and an accessible empty state.
- Add a small visual flourish such as a light/dark theme toggle (or similar motif) handled with CSS-first techniques.
- Document the layout approach, design tokens, breakpoints, and accessibility considerations in this README, including a quick before/after screenshot or Loom link if possible.

### 2. Delete vendor

- Implement a delete functionality to allow users to remove vendor entries from the system
- Include a confirmation dialog before deletion to prevent accidental removal.
- Update both frontend and your chosen backend to support this feature

### 3. Fix the UI bug

- Currently, clicking the "Add" button multiple times before the form resets can result in duplicate vendor entries.
- Prevent this behavior to improve the form UX

### 4. Unique Emails

- Ensure that vendor emails are unique across the system. If a user tries to register a vendor with a duplicate email, they should be informed of the conflict.
  Think about where this logic should live and how the constraint is best enforced (frontend, backend, data storage or all) and justify your approach
- Document your reasoning

### 5. Containerization & Deployment (Optional)

At maerks we host most of our backend services using pods and k8. If you have experience or find the challenge interesting, give this assignment a go.

Choose one of the following deployment approaches:

#### Option A: Docker Compose

- Containerize your chosen backend using Docker
- Create a Docker Compose configuration to run the entire system (frontend + backend)
- Include clear instructions to build and start the application

#### Option B (Advanced): Kubernetes/Minikube Deployment

- Create Kubernetes manifests (YAML files) for both frontend and your chosen backend
- Ensure services can discover and communicate (e.g., using `ClusterIP`)
- Use **Minikube** to test locally
- Provide clear documentation or scripts to:
  - Build and push Docker images to Minikube's Docker daemon
  - Apply Kubernetes configs to start the app

You're welcome to make UX improvements or add minor enhancements, as long as the core requirements are clearly addressed.

---

## Evaluation Criteria

- **Code clarity & organisation** – Is the code readable, modular, testable and well-structured?
- **Testing** - How did you use testing to support your development efforts
- **Full-stack ownership** – Can you deliver a cohesive, working system with the required enhancements?
- **Pragmatism** – Did you make thoughtful decisions and sensible trade-offs?
- **DevOps awareness** – Is the system easy to build, run, and maintain?
- **Deployment quality** – If completed, is your containerization strategy practical, reproducible, and well-documented?"

---

## Submission Instructions

1. **Copy** this repository into your own GitHub account.
2. Create a branch and complete the assigning in that branch
3. **Documentation**
   1. Ensure your repository includes setup instructions and an updated README.md.
   2. Provide a short description of your approach to solving each task
   3. Highlight any assumptions, trade-offs, or challenges encountered during development.
4. In your readme.md file, also answer the following questions:
   1. What do I love most about being a software engineer.
   2. What is most important to me when it comes to working in a team
   3. What is the worst part of being a software engineer.
5. Create a pull request to the main branch and share the link to the pull request with us.

---

We're excited to see how you approach these tasks — feel free to get creative, make reasonable trade-offs, and show us how you think as an engineer. We're particularly interested in your understanding of full-stack development and DevOps practices.

---

## Setup & Run (added)

Quick commands (PowerShell on Windows):

```powershell
# Backend
cd c:\Users\SBE54\Documents\maersk-assignment\01-fullstack-vendor-onboarding\backend-node
npm install
npm run dev

# Frontend (in a separate terminal)
cd c:\Users\SBE54\Documents\maersk-assignment\01-fullstack-vendor-onboarding\frontend
npm install
npm run dev
```

Open the frontend URL printed by Vite (typically `http://localhost:5173`). The backend listens by default on `http://localhost:3000/api`.

---

## What I changed & Approach to each task (short descriptions)

- Responsive layout and design tokens

  - Centralized CSS variables in `frontend/src/style.css` (colors, spacing, radius).
  - Implemented a responsive `.content-layout` in `App.vue` that stacks on mobile and becomes two-columns on desktop.

- Prevent double submissions

  - Added a synchronous `isSubmitting` guard in `VendorForm.vue` to disable the submit button and inputs immediately on submit.
  - Cleared inputs optimistically while keeping a copy of payload to restore on failure.

- Email uniqueness and duplicate handling

  - Implemented a three-layer approach: frontend pre-check, backend returns `409 Conflict` for duplicate emails, and a database-level `UNIQUE` constraint on `email`.
  - Frontend surfaces backend error messages and restores form values when an error occurs.

- Delete vendor

  - Added DELETE endpoint in backend and wired a confirmation + delete flow in the frontend list component.

- Background coverage and scrolling
  - Ensured `html` and `body` cover full viewport and set `overflow-y: auto` so mobile pages scroll normally.

Files touched (high level):

- `frontend/src/style.css`
- `frontend/src/App.vue`
- `frontend/src/components/VendorForm.vue`
- `frontend/src/components/VendorList.vue`
- `frontend/src/services/VendorService.ts`
- `frontend/src/stores/vendorStore.ts`
- `backend-node/src/routes/vendors.ts`
- `backend-node/src/db/database.ts`

---

## Assumptions, trade-offs & challenges

- Assumptions

  - The app targets small-to-medium datasets and uses SQLite for simplicity.
  - The user requested consistent typography across devices (responsive layout only).

- Trade-offs

  - Frontend checks improve UX but cannot guarantee uniqueness; we therefore enforce uniqueness server-side and in the database.
  - Implemented server-side ID allocation that fills deleted gaps — this keeps ids compact but introduces complexity under concurrency. Using DB autoincrement is simpler and more robust in high-concurrency environments.

- Challenges
  - Preventing mobile browser font scaling required disabling `text-size-adjust` and removing per-component font-size media overrides.
  - Ensuring the page background covers the viewport required setting both `html` and `body` backgrounds and proper height rules.

---

## Verification / Manual tests

- Start backend and frontend as shown above.
- Test duplicate email handling:
  - Try adding the same email twice from the UI: first should succeed, second shows an error.
  - Try two simultaneous POST requests with the same email; one should succeed, the other should receive `409`.
- Test double-submit prevention: rapidly click Add — only one submission should occur.
- Test responsiveness: resize to mobile width — form and list should stack and remain horizontally centered; typography should remain unchanged.

---

## Personal reflections (as requested)

- What I love most about being a software engineer

  - Solving problems and building things that help people. I enjoy turning vague requirements into reliable, maintainable systems and watching users interact with the results.

- What is most important to me when it comes to working in a team

  - Clear communication, psychological safety, and shared ownership. I value teammates who give honest feedback and collaborate to reach a common goal.

- What is the worst part of being a software engineer
  - Context switching and scope creep. Frequent interruptions and shifting priorities make it hard to finish thoughtful, high-quality work.

---

If you want me to wire up automated screenshots, add a migration script for enforcing the UNIQUE constraint safely, or revert the sequential id allocation to rely on DB autoincrement, tell me which option you'd prefer and I'll implement it next.
