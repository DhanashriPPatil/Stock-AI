# StockIntel AI - Full-Stack App

A full-stack stock analysis and intelligence application powered by Express and React (Vite).

## Local Setup & Installation

To run this application on your local machine, follow these instructions step-by-step:

### 1. Install Dependencies
Open your terminal in the project's root folder and install the required npm packages:
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory and add your API keys (refer to `.env.example` for reference):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the Application

You can run the application in two different modes:

#### Option A: Development Mode (Recommended for editing code)
Runs the TypeScript source codes directly using `tsx` (TypeScript Execute) without needing to compile beforehand:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

#### Option B: Production Mode (Recommended for deployments)
You must build the static files and compile the Express server before starting the app:
```bash
# Compile and build the project
npm run build

# Start the compiled production build
npm start
```

---

## Why did I get "Cannot find module '.../dist/server.cjs'"?

* **Reason**: The `"start"` script in `package.json` executes the production-ready server file `dist/server.cjs`.
* **Explanation**: Because build directories like `dist/` are (correctly) excluded via `.gitignore` to keep git repositories clean, this file does not exist when you first download/clone the project.
* **Solution**: You must compile the project first using `npm run build` before executing `npm start`. Alternatively, write `npm run dev` to start the applet in development mode immediately!
