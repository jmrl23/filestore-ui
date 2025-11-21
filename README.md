# FileStore UI

A modern, responsive file management interface built with **Next.js 16**, designed to interact with the [filestore](https://github.com/jmrl23/filestore) backend service.

## ✨ Features

- 🗂️ **File Management**: View, upload, and delete files with ease
- ☁️ **Storage Providers**: Supports multiple storage backends (Google Cloud Storage, ImageKit)
- 🔍 **Advanced Filtering**: Search, filter, and sort files by name, type, size, date, and more
- 🎨 **Modern UI**: Responsive interface with Dark Mode support using Shadcn UI
- 🔒 **Secure Architecture**: API requests proxied through Next.js for enhanced security
- ⚡ **Performance**: Built with React 19, optimized with TanStack Query for efficient data fetching
- 🎯 **Type Safety**: Fully typed with TypeScript for better developer experience
- 🛡️ **Error Handling**: Comprehensive error boundaries and user-friendly error messages

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) with React 19
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest) for server state
- **Forms**: [TanStack Form](https://tanstack.com/form/latest) with [Zod v4](https://zod.dev/) validation
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **TypeScript**: Full type safety with latest ES2022 features


## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **Yarn** package manager
- A running instance of the [filestore](https://github.com/jmrl23/filestore) backend

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/jmrl23/filestore-ui.git
   cd filestore-ui
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Configure Environment Variables**:
   
   Create a `.env` file in the root directory:

   ```env
   FILESTORE_SERVICE_URL=http://localhost:3001
   ```
   
   - `FILESTORE_SERVICE_URL`: URL of your filestore service

4. **Run the development server**:

   ```bash
   yarn dev
   ```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

```bash
yarn dev      # Start development server
yarn build    # Build for production
yarn start    # Start production server
yarn lint     # Run ESLint
```

## 🎯 Development Practices

- **Type Safety**: All code is fully typed with TypeScript
- **Performance**: Uses React 19 features, `useCallback`, `useMemo` for optimization
- **Error Handling**: Comprehensive error boundaries and toast notifications
- **Code Quality**: ESLint with Next.js recommended rules
- **Modern CSS**: Tailwind CSS v4 with custom design tokens
- **Accessibility**: Semantic HTML and ARIA attributes

## 🔐 Security

- API keys are never exposed to the client
- All requests to the filestore backend are proxied through Next.js API routes
- Environment variables are validated at startup
- Proper error handling prevents information leakage

## 📝 License

[MIT](LICENSE)

---

Built with ❤️ using the latest web technologies
