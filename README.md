# Cometail v16 — Two Lights, One Universe

Mobile-first React + Vite prototype for the new Cometail direction:

- Invite-only signup
- Start with a friend, anonymous Diary Mate, or solo
- Both people answer the same daily English question
- Answers unlock only after both submit
- Photo prompts that focus on safe everyday moments
- Optional, lightweight English feedback
- Individual Comet growth and shared Pair Universe growth
- Pair Look, shared constellation, Pair Starlight
- Starlight Archive for answers, photos, expressions, and milestones

## Run

```bash
npm install
npm run dev
```

## Firebase

Existing Firebase Auth and invite-code signup are preserved. `firestore.rules` and `src/services/firestoreSchema.js` include the proposed production collections for `pairs`, `pairEntries`, and `memories`.

The new Pair experience currently works as a persisted product prototype in the browser, including a demo Mate and simulated Mate response. Before public release, connect Pair actions to Firestore/Cloud Functions, implement real matching, photo uploads, moderation, identity/age verification, and notification delivery.

## Mobile navigation

Home / Diary / Mate / Our Universe / My Comet
