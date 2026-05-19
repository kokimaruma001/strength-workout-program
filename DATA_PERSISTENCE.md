# Data Persistence System

Your Strength Workout Program now automatically saves all user progress and preferences to browser storage. This means your data is preserved across sessions.

## What Gets Saved

### 1. **Schedule Setup** (Saved when you confirm your workout days)
- Your selected workout days
- Your schedule (which workouts map to which days)
- Your mode preference (gym or home)
- Persisted in: `localStorage['ppSelectedDays']`, `localStorage['ppSchedule']`, `localStorage['ppMode']`

### 2. **Daily Workout Progress** (Saved automatically after each action)
- Which exercises you've completed each day
- Weight, reps, and other metrics you logged
- Persisted in: `localStorage['ppLog']`

### 3. **Mobility Routine Progress** (Saved after each action)
- Which mobility items you've completed each day
- Persisted in: `localStorage['ppMobility']`

## How It Works

1. **On App Load:**
   - All saved data is automatically loaded from browser storage
   - If you have a saved schedule, you skip the setup screen and go straight to tracking
   - Your last selected mode (gym/home) is restored

2. **During Use:**
   - Every time you check an exercise, log a weight, or mark mobility items—it saves automatically
   - No manual save needed—all changes persist immediately

3. **On Return:**
   - Close and reopen the app (or refresh the page)
   - Everything appears exactly as you left it
   - Your schedule, logs, weights, and preferences are restored

## Resetting Your Setup

If you want to change your workout days or schedule:
1. Click the **"EDIT DAYS"** button in the top right
2. Select new days
3. Click **"BUILD MY PROGRAM"**
4. Your new schedule is saved and replaces the old one

## Advanced: Clear All Data

If you need to completely reset the app (dangerous—this deletes everything):
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `clearAllData()`
4. Press Enter
5. Refresh the page

## Technical Details

- Storage Type: Browser's `localStorage` API
- Capacity: ~10MB per domain (varies by browser)
- Persistence: Permanent (survives browser restarts)
- Sync: Not synced across devices or browsers
- Privacy: Data stays on your device, not sent anywhere

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
Clear browser cache/cookies to wipe data permanently.
