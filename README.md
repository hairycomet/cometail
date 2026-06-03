# Cometail v8 Firebase Foundation

Cometail is an invite-only private English universe for students.

This version focuses on Priority 1:

- Firebase Auth service layer
- Firestore user profile structure
- invite code validation structure
- student profile creation with 1 invite ticket
- role based teacher/student structure
- admin menu remains hidden from students
- `/admin` is blocked for non-teachers
- Firestore rules draft included
- diary saving service prepared

## Run

```bash
npm install
npm run dev
```

## Firebase setup

See `docs/firebase-setup.md`.

## Deploy

```bash
git add .
git commit -m "Add Cometail v8 Firebase foundation"
git push
```


## v8.3 fixes
- Fixed React hook order errors on Login and Onboarding pages.
- Kept invite-code usage on usedCount.
- If Firebase says missing permissions, publish firestore.rules in Firebase Console.
