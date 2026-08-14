# Agnos Patient Registration & Real-Time Staff Dashboard

A modern patient registration system with a real-time staff monitoring dashboard built as a front-end assignment for the Agnos Front-end Developer evaluation.

## Overview

This application allows patients to fill out a registration form while staff members can monitor the form data in real time. Every change is synchronized instantly through WebSockets, enabling staff to track patient activity without refreshing the page.

The project demonstrates front-end development best practices, including real-time communication, form validation, component-based architecture, responsive design, and comprehensive testing.

## Live Demo

- Live Application: https://agnos-assignment-git-master-passon182546s-projects.vercel.app
- GitHub Repository: https://github.com/Passon182546/agnos-assignment

## Features

### Real-Time Synchronization

- Instant form synchronization using Pusher and WebSockets
- Sub-second updates between the patient form and the staff dashboard
- Support for multiple simultaneous users

### Patient Status Tracking

Staff members can monitor each patient's current status:

- **Actively filling in** — The patient is currently entering data
- **Inactive** — No activity has been detected for 3 seconds
- **Submitted** — The registration form has been completed

### Performance Optimization

- 500 ms debouncing to reduce unnecessary synchronization requests
- Optimized API communication
- Reduced server load during continuous typing

### Data Validation

Validation is implemented on both the client and server sides:

- Client-side validation using React Hook Form and Zod
- Server-side validation using Zod
- Protection against invalid or incomplete data

### Responsive User Interface

- Mobile-first design
- Split-screen layout for easier testing
- Modern medical dashboard interface
- Fully responsive across different screen sizes

### Testing

- 100% test coverage
- Unit testing with Jest
- Integration testing with React Testing Library
- Coverage for components, hooks, and asynchronous logic

## Tech Stack

| Technology | Purpose |
| --- | --- |
| Next.js 16 | Application framework |
| Tailwind CSS | Styling |
| Pusher | Real-time communication |
| React Hook Form | Form management |
| Zod | Data validation |
| Jest | Unit testing |
| React Testing Library | Integration testing |
| Vercel | Deployment |

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── pusher/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── form/
│   │   ├── PatientForm
│   │   ├── InputField
│   │   ├── SelectField
│   │   └── DatePickerField
│   └── staff/
│       ├── StaffDashboard
│       └── PatientCard
├── hooks/
│   └── useFormSync.ts
└── lib/
    ├── pusher/
    └── validation/
```

## Real-Time Data Flow

```text
Patient Input
      ↓
React Hook Form
      ↓
500 ms Debounce
      ↓
useFormSync Hook
      ↓
POST /api/pusher
      ↓
Zod Validation
      ↓
Pusher WebSocket Event
      ↓
Staff Dashboard
      ↓
Real-Time UI Update
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Passon182546/agnos-assignment.git
cd agnos-assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_PUSHER_APP_KEY=your_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
PUSHER_APP_ID=your_app_id
PUSHER_SECRET=your_secret
```

### 4. Start the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Running Tests

Run the test suite:

```bash
npm run test
```

Generate a coverage report:

```bash
npm run test -- --coverage
```

## Design Decisions

### Split-View Layout

The application displays both the patient form and the staff dashboard on the same page. This approach makes it easier to test and demonstrate the real-time synchronization feature.

### Mobile-First Development

The interface was designed with a mobile-first approach. On smaller devices, the layout automatically adjusts by stacking components vertically.

### Component-Based Architecture

The application separates responsibilities into reusable components and custom hooks, making the codebase easier to maintain, test, and extend.

## Future Improvements

- User authentication
- Database integration
- Persistent patient records
- Notification system
- Administrative dashboard
- Form history tracking

## License

This project was created as part of the Agnos Front-end Developer candidate evaluation.