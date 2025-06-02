# 🪝 Blobhook

A lightweight, real-time webhook testing and monitoring service built with Next.js. Easily test webhooks, inspect payloads, and receive instant push notifications when your endpoints are hit.

## ✨ Features

- **Instant Webhook URLs**: Generate unique webhook endpoints in one click
- **Real-time Monitoring**: Watch webhook requests come in live
- **Push Notifications**: Get notified instantly when webhooks are received
- **Request Inspection**: View headers, body, method, and timestamp for each request
- **Mobile Friendly**: Works seamlessly on desktop and mobile devices
- **JSON Viewer**: Pretty-formatted JSON payload inspection
- **URL Management**: Copy webhook URLs or generate new ones easily

## 🚀 Quick Start

1. Visit the live service at [blobhook.com](https://blobhook.com)
2. Click "Start a Webhook" to generate a unique webhook URL
3. Use the generated URL as your webhook endpoint
4. Watch requests appear in real-time!

## 🛠 Local Development

### Prerequisites

- Node.js 18+ 
- Firebase project (for real-time data and push notifications)
- PocketBase instance (optional, for URL generation)

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd blobhook
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Generate VAPID keys for push notifications:
```bash
node generate-vapid-keys.js
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🌍 Deploy on Vercel

The easiest way to deploy blobhook is using the [Vercel Platform](https://vercel.com).

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/blobhook)

### Manual Deployment

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import your forked repository
4. Configure environment variables (see below)
5. Deploy!

## 🔧 Environment Variables

Configure these environment variables in your Vercel dashboard or `.env.local` file:

### Required - Firebase Configuration

```env
# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# Firebase Client (Browser-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Required - Application Configuration

```env
# Base URL for webhook generation
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# VAPID keys for push notifications (generated using generate-vapid-keys.js)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### Optional - PocketBase (if using alternative storage)

```env
POCKETBASE_URL=https://your-pocketbase-instance.com
NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-instance.com
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=your-admin-password
```

## 🔥 Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Enable **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Choose your preferred location

3. Enable **Cloud Messaging**:
   - Go to Project Settings > Cloud Messaging
   - Generate a new private key for service account
   - Download the JSON file and extract the required fields

4. Set up **Firestore Collections**:
   The app uses these collections (created automatically):
   - `requests` - Stores webhook request data
   - `subscriptions` - Stores push notification subscriptions

5. Configure **Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /requests/{document} {
         allow read, write: if true;
       }
       match /subscriptions/{document} {
         allow read, write: if true;
       }
     }
   }
   ```

## 📱 Push Notifications Setup

1. Generate VAPID keys:
```bash
node generate-vapid-keys.js
```

2. Add the public key to your environment variables as `NEXT_PUBLIC_VAPID_PUBLIC_KEY`

3. Update the Firebase configuration in `public/firebase-messaging-sw.js` with your project details

4. The service worker will handle background notifications automatically

## 🏗 Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Database**: Firebase Firestore for real-time data
- **Push Notifications**: Firebase Cloud Messaging with VAPID
- **Hosting**: Optimized for Vercel deployment
- **Real-time**: Firebase real-time listeners for instant updates

## 📡 API Endpoints

- `POST /api/generate-url` - Generate a new webhook URL
- `[ANY] /api/in/[uuid]` - Webhook endpoint that accepts any HTTP method

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Issues & Support

Found a bug or have a feature request? Please [open an issue](https://github.com/your-username/blobhook/issues) on GitHub.

---

Built with ❤️ for developers who need quick webhook testing.
