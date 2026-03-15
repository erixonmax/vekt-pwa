# vekt PWA

Mobile companion app for vekt — project and time tracking for small teams.

## Setup

1. Fork or upload this folder to a GitHub repository named `vekt-pwa`
2. Go to repository Settings → Pages → Source: Deploy from branch → main → / (root)
3. Your PWA will be live at: `https://yourusername.github.io/vekt-pwa/`

## How to use

1. Open the URL on your phone browser
2. Enter your team's 6-character invite code (from desktop vekt → Settings → Integrations → Real-time Sync)
3. Select your user account and enter your PIN
4. Tap "Add to Home Screen" to install as an app

## Requirements

- Team must have Real-time Sync (Supabase) set up on the desktop app
- Works on Chrome (Android) and Safari (iOS)
- Offline mode shows cached data read-only

## Features

- View and mark tasks done
- Add new tasks
- Add comments to tasks
- View tracker entries (auto-created when tasks are marked done)
- Add revisions to tracker entries
- View and add reminders & notes
- Client portal (approve/request revision)
- Real-time sync — changes appear instantly on desktop
- Offline support — cached data available without internet
