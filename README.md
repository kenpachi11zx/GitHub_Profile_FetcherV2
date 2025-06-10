
# 🔍 GitHub Profile Explorer

> A simple and elegant web app to fetch and display GitHub user profiles  
> Built using **Next.js**, **TypeScript**, and **Tailwind CSS**

---

## 🌐 Live Site

👉 [Visit Website](https://gitfetchprofile.netlify.app)

---

## ✨ Features

- 🔎 Search any GitHub username to fetch profile data
- 📂 View avatar, bio, location, followers, following
- 📘 Displays public repositories and their details
- 🌙 Dark-themed minimalistic UI
- ⚡ Instant API calls to GitHub REST API
- 📱 Responsive for mobile and desktop

---

## 🧰 Tech Stack

| Tech        | Description                           |
|-------------|---------------------------------------|
| Next.js     | React framework with SSR & routing    |
| TypeScript  | Static typing for safer development   |
| TailwindCSS | Utility-first CSS styling             |
| GitHub API  | Fetching real-time GitHub profile data|
| PNPM        | Fast package manager                  |

---

## 🧱 Folder Structure

```
GitHub_Profile_FetcherV2/
├── app/               # Next.js routing and pages
├── components/        # UI components (ProfileCard, SearchBar, etc.)
├── hooks/             # Custom React hooks
├── lib/               # API utilities
├── public/            # Static assets
├── styles/            # Global and Tailwind styles
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## 🚀 How It Works

1. User enters a GitHub username.
2. The app sends a GET request to the GitHub Users API.
3. Displays the fetched profile in a styled card layout.
4. If username is invalid or no data, shows an error or fallback state.

---

## 🧑‍💻 Author

**Kenpachi11zx**  
Frontend Developer | React & Next.js Enthusiast

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> ⭐ Star this repo if you found it useful!
