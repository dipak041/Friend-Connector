# Verification — 16 October 2026

Story: enter a demo account → create/interact with content → save to browser storage → reload or switch account → see the saved result.

## Passed

- `node --check` on application JavaScript; 7 automated tests with `npm test`.
- HTTP server returned 200 at http://127.0.0.1:5173.
- Browser demo login as Dipak; switch to Aarya.
- Like count changed to 1 and persisted after reload.
- Save action persisted and Saved page showed the selected post.
- Comment rendered literal `<script>` text rather than executing it; comment deletion worked.
- Text post creation, reload persistence, caption editing and deletion through the final app confirmation dialog. Deleted test caption count was 0.
- Message sent from Dipak was visible to Aarya in the same browser profile.
- Like/comment notifications visible to Aarya.
- Follow changed button to Following and follower count to 1.
- Searching for rohan returned Rohan.
- Profile bio edit persisted and was visible from another profile.
- PNG upload as a story completed and added a story to the strip.
- Mobile view at 390 × 844: no horizontal overflow (document width 375, viewport width 390); More menu includes Search, Notifications, Saved, Switch account and Log out.
- Final browser warning/error log query returned an empty array.

## Not verified / limitations

- No live Firebase project exists; Firebase email authentication, deployed Firestore/Storage rules and multi-device sync were not exercised. Rules were written and reviewed statically, not emulator-tested.
- Video upload/playback, avatar upload, password reset, clipboard permissions and all browser/device combinations were not browser-tested.
- Story expiration boundary is unit-tested; a full 24-hour browser run was not performed.
- Standalone Playwright/Edge could not launch in this sandbox. Browser checks used the supported in-app browser instead. Native browser confirm caused automation timeouts, so deletion now uses an in-app dialog and was rechecked successfully.
- This is a starter social app, not full Instagram feature parity. See README for the explicit remaining scope and production requirements.

Demo tests use test accounts and browser-local data only. The original source was backed up in the task workspace before modification.
