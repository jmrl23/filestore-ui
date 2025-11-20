# FileStore UI

A modern, responsive file management interface built with Next.js, designed to interact with the [FileStore API](https://github.com/jmrl23/filestore).

## Features

- **File Management**: View, upload, and delete files.
- **Storage Providers**: Supports customizable storage backends (e.g., Google Cloud Storage, ImageKit).
- **Filtering & Sorting**: Search, filter, and sort files easily.
- **Interactive UI**: Modern, responsive interface with Dark Mode support.
- **Secure Architecture**: Proxied API requests for security.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **State & Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Forms & Validation**: [TanStack Form](https://tanstack.com/form/latest), [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js (v18+)
- Yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/jmrl23/filestore-ui.git
   cd filestore-ui
   ```

1. **Install dependencies**:

   ```bash
   yarn install
   ```

1. **Configure Environment**:
   Create a `.env` file in the root directory with the following variables:

   ```env
   FILESTORE_SERVICE_API_KEY=your_api_key_here
   FILESTORE_SERVICE_URL=http://localhost:3001
   ```

1. **Run the development server**:

   ```bash
   yarn dev
   ```

1. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/app/api`: API Route Handlers for proxying requests.
- `src/components/files`: File-related components (Table, Dialogs, Filters).
- `src/components/ui`: Reusable UI components (from Shadcn).
- `src/hooks`: Custom hooks (e.g., `useFileManager`, `useDebounce`).
- `src/lib`: Utilities and constants (API client, providers list).

## License

[MIT](LICENSE)
