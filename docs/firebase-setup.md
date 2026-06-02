# Cometail Firebase Foundation Setup

This version prepares Cometail for real student accounts.

## 1. Environment variables

Create `.env.local` in the project root.

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ADMIN_EMAILS=hairycomet@gmail.com
```

Do not expose any admin hint in the UI. `VITE_ADMIN_EMAILS` is only for initial teacher profile bootstrapping.

## 2. Firestore collections

Required collections:

- users
- inviteCodes
- diaries
- feedbacks
- homeworks
- submissions
- items
- purchases
- equippedItems
- missions
- typingRecords
- universe
- planets
- notifications

## 3. First invite code

Create one Firestore document manually:

Collection: `inviteCodes`
Document ID: `COMET2026`

```json
{
  "code": "COMET2026",
  "label": "Initial teacher invite",
  "maxUses": 30,
  "used": 0,
  "active": true,
  "createdBy": "manual",
  "createdByRole": "teacher"
}
```

## 4. Teacher role

The first time `hairycomet@gmail.com` logs in, the app creates a teacher profile automatically if no profile exists.

For stronger production security, confirm this document in Firestore:

Collection: `users`
Document: teacher uid

```json
{
  "role": "teacher"
}
```

## 5. Security rules

Upload `firestore.rules` from the project root to Firebase Rules before sending the app to students.

