# Agnos Patient Registration & Real-Time Staff Dashboard

This project is a front-end assignment for the Agnos Front-end Developer candidate evaluation. It features a responsive patient input form that synchronizes data in real-time with a staff monitoring dashboard.

## Live Demo & Links
* **Live Application:** [https://agnos-assignment-git-master-passon182546s-projects.vercel.app]
* **Repository:** [https://github.com/Passon182546/agnos-assignment]

---

## Key Features & Bonus Implementations
* **Real-time Synchronization:** Utilizes WebSockets (Pusher) for sub-second data syncing.
* **Smart Status Indicators:** Staff can see if a patient is "actively filling in", "inactive", or "submitted".
* **Debounce Optimization (Bonus):** Form data is debounced by 500ms before syncing to prevent unnecessary API calls and reduce server load.
* **100% Test Coverage (Bonus):** Comprehensive Unit and Integration tests using **Jest** and React Testing Library, covering all components, custom hooks, and complex asynchronous timer logic.
* **Double Validation:** Strict data validation using Zod on both the Client-Side (React Hook Form) and Server-Side (Next.js API Routes).
* **Responsive & Modern UI:** Designed with a clean, medical-tech aesthetic using Tailwind CSS.

---

## 🛠 Tech Stack
* **Framework:** Next.js 16 (App Router)
* **Styling:** Tailwind CSS
* **Real-Time Communication:** Pusher (WebSockets)
* **Form & Validation:** React Hook Form, Zod
* **Testing:** Jest, React Testing Library
* **Deployment:** Vercel

---

## Development Planning Documentation

### 1. Project Structure
The project utilizes the Next.js App Router paradigm for optimal performance and organization:
* `/src/app`: Contains the main layout, global styles, and the `/api/pusher` serverless route for handling WebSocket triggers.
* `/src/components`: Divided logically into:
  * `/form`: Contains the `PatientForm` and highly reusable UI components (`InputField`, `SelectField`, `DatePickerField`).
  * `/staff`: Contains the `StaffDashboard` and `PatientCard`.
* `/src/hooks`: Custom React hooks, notably `useFormSync.ts` which encapsulates the complex timer and synchronization logic.
* `/src/lib`: Configuration files for Pusher clients/servers and Zod validation schemas.

### 2. Design Decisions (UI/UX)
* **Split View Layout:** Designed to display both the Patient Form and Staff Dashboard on a single page (on large screens) to allow evaluators to easily test the real-time functionality without opening multiple tabs.
* **Mobile-First Approach:** On smaller screens, the layout gracefully stacks, prioritizing the patient form at the top.
* **Visual Hierarchy & Cues:** Used distinct colors (Blue for actively typing, Green for submitted) and a left-border accent on the staff cards to allow staff to quickly identify patient statuses at a glance.

### 3. Component Architecture
* **`PatientForm`**: The central data-entry component. It registers fields, handles local validation errors, and passes the current form state to the custom hook.
* **`DatePickerField`**: A custom-built, fully tested calendar component providing a better UX than standard HTML date inputs.
* **`StaffDashboard`**: Manages the subscription to the Pusher channel. It utilizes a dictionary state (`Record<string, SyncPayload>`) keyed by `sessionId` to elegantly handle multiple patients simultaneously without data collision.

### 4. Real-Time Synchronization Flow
1. **Typing & Debouncing:** As the patient types, `React Hook Form` watches the inputs. The `useFormSync` hook debounces these rapid changes (500ms).
2. **Status Evaluation:** The hook evaluates if the user is typing ("actively filling in") or idle for 3 seconds ("inactive").
3. **API Routing & Validation:** The payload (including a unique `sessionId`) is sent to `POST /api/pusher`. The API validates the partial data using Zod to prevent garbage data from entering the stream.
4. **WebSocket Trigger:** If valid, the server triggers a 'form-update' event via `pusherServer`.
5. **Client Subscription:** The `StaffDashboard` receives the event via `pusherClient` and updates the UI instantly, matching the payload to the correct patient card via the `sessionId`.

---

## Getting Started (Local Setup)

1. **Clone the repository:**
   ```bash
   git clone [Insert your GitHub URL here]
   cd agnos-assignment