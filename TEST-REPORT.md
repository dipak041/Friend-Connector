# Verification — 17 October 2026

## Passed

- 10 native Node tests: Gmail/password validation, salted password storage, normalized login, duplicate registration, bad-password cooldown, escaping, conversation IDs, story expiration, upload type/size restrictions, store listeners/filtering and quota rollback.
- DOM integration: login-first screen, mismatch feedback, local register → login, post create/like/save/delete, recipient messages, theme selection, reels composer, logout and sample profile switching.
- Mocked WebRTC lifecycle: outgoing/incoming ringing, accept, offer/answer exchange, mic/camera toggles, hangup media cleanup, decline and denied camera permission. No real camera/microphone was accessed by these tests.
- Firestore Emulator: rules compile; verified-user gate, user/post ownership, private saves, notification event ownership, private conversations, call participant checks, callee-only answer, immutable participants, ICE access and ended-call rejection.
- Storage Emulator: rules compile; verified upload, signed-in read, anonymous read denied, owner paths/deletion and MIME restrictions.

## Cloud state and limitations

- Actual Firebase Web config installed for ad-connector-40cd0.
- Live Auth configuration request returned CONFIGURATION_NOT_FOUND.
- Unauthenticated Firestore collection request returned 200: existing cloud rules permit this read. Document contents were not displayed or persisted. Publish the supplied rules before real data use.
- firebase deploy --only firestore:rules,storage --project ad-connector-40cd0 failed because saved Firebase CLI credentials were invalid/expired. No successful cloud rules deployment claimed.
- Browser automation could not initialize because runtime assets were missing, even after reset. New v3 appearance, real browser media playback, email delivery and camera-to-camera connectivity have not been visually/end-to-end verified. Previous v2 screenshots do not represent the new design.
- GitHub connector account still has push:false on dipak041/Friend-Connector; saved local Git credentials were unusable. Remote publishing remains blocked unless account access changes.

Do not interpret emulator or DOM tests as proof that live Firebase authentication, cloud storage, deployment or cross-network calls are working.

## Cloudinary migration verification

- Replaced Firebase Storage SDK/upload implementation with Cloudinary unsigned multipart uploads in every app mode.
- Removed storage.rules, Storage emulator configuration and storageBucket config fields.
- 14 Node tests passed, including image/video multipart request shape, secure URL handling, API/malformed-response/network failures and pre-request media validation.
- Existing avatar/post/story/reel handlers still await upload completion before saving the returned URL to their existing database fields.
- Live Cloudinary upload and the user-reported repaired Firestore connection were not exercised in this migration; upload tests use mocked responses. Earlier Storage emulator checks above describe the previous implementation only.
