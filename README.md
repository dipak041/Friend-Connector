# SocialApp

Instagram-inspired local social app with an explicit demo mode and an optional Firebase backend.

## Test now — no Firebase project required

1. Double-click `START-SOCIALAPP.cmd` in this folder. Keep its window open.
2. Open **http://127.0.0.1:5173** (use this exact address).
3. Click **Explore as Dipak**. No password is required for the demo.
4. Create a post, like/comment/save a sample post, and refresh. Data remains in this browser.
5. Open Messages, select Aarya, and send a test message. Use **Switch account → Aarya**, then Messages → Dipak to read and reply.
6. On a phone-size window, use the top-right **More options** menu for account switching, search, notifications, saved posts, and logout.

Node.js is required and is already present on the development machine. Alternatively, run `npm start` from this directory. Stop with Ctrl+C. Do not double-click index.html: JavaScript modules need the local HTTP server. If port 5173 is already in use, the existing preview may already be running.

Demo accounts share data within the same browser profile and origin; accounts are selected per tab. Separate devices, incognito windows, and browsers do not share demo data. `localhost` and `127.0.0.1` also have separate browser storage. Demo accounts are a playground, not secure authentication. Demo media: 2 MB per file, subject to browser storage quota. Never use demo mode for real private information. Clearing site data resets the demo.

## Implemented

- Responsive white/black interface with pink, orange, and purple accents; desktop sidebar and mobile navigation.
- Persistent posts with captions, locations, image/video uploads, caption editing and deletion.
- Likes, comments with author deletion, saves, copyable post links.
- Image/video stories hidden after 24 hours, story viewer and owner deletion.
- Video posts/reel feed with native playback controls.
- User search and caption search, explore view, follow/unfollow, following feed.
- Profile name, display username, bio and avatar editing; counts.
- Participant-filtered direct messages and activity notifications.
- Demo account switching; Firebase email/password registration, login and password-reset integration when configured.

## Connect a real Firebase project later

1. Create a project in https://console.firebase.google.com/ and register a Web app.
2. Enable Authentication → Email/Password. Add the hosting domain to authorized domains. For local testing, configure localhost/127.0.0.1 as appropriate in the console.
3. Create Cloud Firestore and Cloud Storage in your chosen region. Review Firebase's current plan/billing requirements before enabling Storage.
4. Replace `null` in `js/firebase-config.js` with the Web app's Firebase config object. These are client configuration values; never put service-account private keys in browser code.
5. Publish `firestore.rules` in the Firestore Rules editor and `storage.rules` in Storage Rules. The supplied `firebase.json` also supports the Firebase CLI: `firebase deploy --only firestore:rules,storage --project YOUR_PROJECT_ID` after installing the official CLI and signing in.
6. Reload. The app switches to Firebase mode, with email/password sign-in. Create two test accounts and repeat the checklist in separate browser profiles. Demo data is not uploaded or migrated automatically.

Firestore stores users, posts, stories, comments, follows, likes, saves, notifications and messages. Firebase Storage stores media; Auth handles passwords. Real-time listeners update the UI. Security rules restrict writes to owners and messages/saves/notifications to intended readers. Firebase SDK imports are pinned to 11.10.0 and loaded only in Firebase mode. Demo mode requires no remote scripts or fonts.

Official integration references: https://firebase.google.com/docs/firestore/query-data/listen and https://firebase.google.com/docs/storage/web/upload-files

## Verification

Run `npm test` for the model and demo-storage tests. Browser checks and limitations are in `TEST-REPORT.md`. Real Firebase authentication, Storage and deployed security rules have not been tested against a project because no project/configuration was supplied.

## Scope and production work still needed

This is a usable starter, not all of Instagram. Voice/video calls, live broadcasts, private accounts, block/report/moderation, push notifications, group chats, message encryption, account deletion, verification, algorithmic ranking, video editing/music, and commerce are not implemented. Usernames are display labels and are not globally reserved.

Before public production use: add pagination/search indexing (current collection listeners load all readable data), server-generated notifications and timestamps, rate limits/App Check, moderation, media cleanup/transcoding, and backend deletion cleanup. Notification text is restricted by rules but notifications are still client-generated and not authoritative. Deleting a post hides it but does not automatically remove its media or related database records. Story expiration hides stories; add a Firestore TTL policy/media cleanup for physical deletion. Uploaded Firebase download URLs are bearer links and should not be considered private media access. Public deployment requires a hosting setup and HTTPS.
