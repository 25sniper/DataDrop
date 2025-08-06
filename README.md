# DataDrop 📁

A secure, modern file sharing application with drag-and-drop functionality built with React, Node.js, and PostgreSQL.

## ✨ Features

- 🎯 **Drag & Drop Interface** - Intuitive file uploads
- 🔐 **Secure File Sharing** - Password-protected downloads
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Real-time Updates** - WebSocket connections
- 🗄️ **Database Storage** - Persistent file metadata
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Radix UI components
- React Hook Form for form handling
- TanStack Query for data fetching

**Backend:**
- Node.js with Express
- TypeScript
- Drizzle ORM with PostgreSQL
- Passport.js for authentication
- Multer for file uploads
- WebSocket support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/25sniper/DataDrop.git
   cd DataDrop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/datadrop
   SESSION_SECRET=your-session-secret-here
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

## 🚀 Deployment

### Recommended Platforms

1. **Railway** (Recommended)
   - Built-in PostgreSQL database
   - Easy environment variable management
   - Automatic deployments from GitHub

2. **Vercel**
   - Excellent for React apps
   - Free custom domains
   - Easy GitHub integration

3. **Render**
   - Full-stack deployment
   - Built-in database options
   - Free tier available

### Environment Variables for Production

```env
DATABASE_URL=your-production-database-url
SESSION_SECRET=strong-random-session-secret
NODE_ENV=production
```

## 📁 Project Structure

```
DataDrop/
├── client/          # React frontend
│   ├── src/
│   └── public/
├── server/          # Express backend
│   └── index.ts
├── shared/          # Shared types and schemas
├── uploads/         # File storage (ignored in git)
├── package.json
├── vite.config.ts
└── drizzle.config.ts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or run into issues, please open an issue on GitHub.

---

⭐ Star this repository if you find it helpful!

## 🚀 Live Demo
Deployed on Vercel: **[https://data-drop-kr0nznh2e-25snipers-projects.vercel.app](https://data-drop-kr0nznh2e-25snipers-projects.vercel.app)**
