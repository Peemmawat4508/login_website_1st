# Next.js Login System

A modern login and registration system built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User registration and login
- MongoDB database integration
- Secure password hashing
- Responsive design
- TypeScript support
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js 14.x or later
- MongoDB (local or Atlas)

## Getting Started

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <your-project-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/login-app
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/
│   │       └── register/
│   │   └── page.tsx
├── components/
├── lib/
│   └── db.ts
├── models/
│   └── User.ts
└── public/
```

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- MongoDB
- bcryptjs
- React Icons

## License

MIT 