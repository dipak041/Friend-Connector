# SocialApp / Friend Connector — v3

A colorful, responsive social app with Firebase email authentication, Firestore data, Cloudinary media uploads, reels and WebRTC video calls.

## Start

Run `npm start` or double-click `START-SOCIALAPP.cmd`, then open **http://127.0.0.1:5173/**.

The default app now uses the supplied **ad-connector-40cd0** Firebase project. The Web config is in `js/firebase-config.js`. It is public client configuration, not a server secret. Never add service-account private keys or long-lived TURN credentials to browser code.

Create an account using your Gmail address and a **new app password** (not your Gmail password). Confirm the password, submit registration, verify your email, then log in with the same Gmail and app password. Verification is required before Firestore access. Password reset and verification resend are available. Your signed-in session is per browser tab/session via Firebase session persistence.

## Required cloud setup — current blockers

On 17 October 2026, a read-only Auth configuration request returned `CONFIGURATION_NOT_FOUND`, and an unauthenticated Firestore collection read returned HTTP 200. No existing document contents were displayed or copied. Publish the supplied rules before storing real personal content.

Firebase CLI deployment was attempted against `ad-connector-40cd0`, but saved credentials were invalid/expired. These local rules have NOT been confirmed deployed to the cloud.

1. Open Firebase Console, select **ad-connector-40cd0**, then Authentication → Get started / Sign-in method → enable Email/Password. Confirm the Web app config belongs to this same project. If it is already enabled, copy a fresh Web config from this project and check for an API-key/project mismatch.
2. Open Firestore Database → Rules. Replace the rules with the full contents of `firestore.rules` and click Publish.
3. Media uploads use Cloudinary cloud `zlvzklj5` with unsigned preset `social_uploads`. No Firebase Storage setup is needed.
4. Add the actual hosting domain in Authentication settings → Authorized domains. For local development include localhost/127.0.0.1 as needed; for GitHub Pages include `dipak041.github.io`.
5. Reload the app and create two test accounts. Verify both email addresses, then test posts, messages and calls in separate browser profiles/devices.

Alternatively, after installing the official Firebase CLI, run `firebase login --reauth`, then from this folder:

```
firebase deploy --only firestore:rules --project ad-connector-40cd0
```

## Test modes

- **Cloud (default):** http://127.0.0.1:5173/ — uses the supplied Firebase project.
- **Browser-only test:** http://127.0.0.1:5173/?backend=local — local registration with salted PBKDF2 password hashes, sample profiles and browser-local content. This is not secure server authentication, email verification or cross-device sync. Use a unique test password.
- **Real Firebase emulators:** run `START-DATABASE.cmd` (Node 22/24 and Java 21+) alongside `npm start`, then open http://127.0.0.1:5173/?backend=emulator. Dashboard: http://127.0.0.1:4000. Verification links appear in the emulator terminal, not Gmail. A clean Ctrl+C exports local test data to `.firebase-data`; the next launch imports it. Do not expose the emulators publicly.

Local/emulator overrides are restricted to localhost/127.0.0.1. A deployed site always uses the cloud configuration. Old browser-demo data is not uploaded to Firebase automatically.

## Features

- Sunrise, Ocean and Midnight themes; polished gradients, responsive sidebar/mobile menu, refreshed profile and inbox.
- Login-first experience, Gmail registration, password confirmation, show/hide password, Firebase verification and reset.
- Feed, following feed, posts with captions/locations, image/video uploads with preview, editing, deletion, likes, comments, saves and share links that work from repository subpaths.
- Stories, 24-hour visibility, owner deletion; explore and name/caption search.
- Dedicated vertical reels view with playback controls, loop, likes, saves and comments; one feed video plays at a time.
- Profile editing and avatars, follow/unfollow, event-backed activity notifications.
- Direct messages, draft preservation during live updates and scroll-position preservation while reading older messages.
- Video calls: ringing, accept/decline, offer/answer and ICE signaling through Firestore, camera/mic controls, hangup, stream cleanup, timeout and permission-denial handling.

## Video call setup and limits

Open Messages, select a user, and click **Video call**. The recipient must be signed in with the app open. Camera/microphone need consent and HTTPS or localhost. Local mode calls are for two tabs on the same browser/origin; Firebase mode signals across devices.

`rtcConfig` currently uses a public STUN service. Reliable calls across restrictive/mobile networks require your own TURN relay with short-lived credentials supplied by a trusted backend. Do not commit permanent TURN passwords. Real camera-to-camera calls over different networks have not been verified; mocked signaling/lifecycle tests passed. Screen sharing, group calls and background call notifications are not implemented.

## GitHub deployment

The repository remote is https://github.com/dipak041/Friend-Connector. `.github/workflows/pages.yml` tests the app and packages only HTML/CSS/JS/assets before deploying. The repository owner must enable Settings → Pages → Source: GitHub Actions. A successful workflow publishes to the URL reported by GitHub Pages. Source changes are not live until pushed and deployment succeeds.

## Checks

`npm test` runs native Node tests. Additional DOM integration, mocked WebRTC and real Firestore/Storage emulator rules checks were run from the development workspace. See `TEST-REPORT.md` for exact scope.

## Remaining production work

This is a social-app starter, not complete Instagram parity. Missing: moderation/reporting/blocking, private profiles, push notifications, full-text search backend, pagination, video transcoding/music, account deletion/export and automated media/related-record cleanup. Likes/comments/notifications are currently client initiated. Notification rules validate the referenced actor/event, but do not enforce notification uniqueness. Add server-side timestamps, rate limiting/App Check and trusted notification generation before public production use.

Firestore listeners currently load all matching readable documents; this will need pagination. Expired stories are hidden, not physically deleted. Post deletion does not remove Cloudinary media or related records. Cloudinary media URLs are public. Configure cleanup/retention for call SDP and ICE records. Reels/media: 20 MB per upload in all modes. Media uploads always go to Cloudinary, including local/emulator testing; only metadata stays local in those modes. Display handles are not globally reserved.

References: https://firebase.google.com/docs/auth/web/manage-users · https://firebase.google.com/docs/firestore/security/get-started · https://webrtc.org/getting-started/turn-server

## Cloudinary upload migration

`js/media-upload.js` sends a multipart POST with `file` and `upload_preset` to the Cloudinary auto-upload endpoint. `store.upload()` returns `secure_url`; existing profile, post, reel and story handlers save it in their existing Firestore fields. Failed uploads stop the save and display an error. Existing media URLs are preserved; previously uploaded Firebase files are not migrated or deleted.

The unsigned preset is public browser configuration. Restrict allowed formats in the Cloudinary preset. Firebase authentication/rules protect database writes, not the unsigned Cloudinary endpoint. No API secret is used.

Reference: https://cloudinary.com/documentation/client_side_uploading
