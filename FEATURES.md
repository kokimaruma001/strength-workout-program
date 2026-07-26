# New Features - Strength Workout Program

## 1. ✅ Completion Checkboxes
- **Location**: Each exercise in the TODAY tab
- **How to use**: Click the checkbox on the left side of any exercise to mark it as completed
- **Visual feedback**: 
  - Completed exercises show a green checkmark (✓)
  - The exercise name becomes strikethrough and grayed out
  - Session progress updates in real-time

## 2. 📋 Copy from Previous Week
- **Location**: Progress section at the top of your exercises (when data exists from last week)
- **How to use**: 
  1. Go to TODAY tab
  2. Look for the "↻ COPY FROM LAST WEEK" button
  3. Click it to automatically populate today's weights with last week's data
  4. This saves you from having to check your previous week's entries
- **Note**: Only appears if you have workout data from the same day last week

## 3. 🔄 Alternative Exercises (Exercise Database)
- **Location**: Below each exercise name in the TODAY tab
- **How to use**:
  1. Click the "🔄 CHANGE EXERCISE" button next to any exercise
  2. A modal will appear showing similar alternative exercises
  3. Click any alternative to swap it with the current exercise
  4. The exercise name will show as "★ ALTERNATIVE" to indicate substitution
  5. Click the ↩ (undo) button to revert to the original exercise

### Exercise Alternatives Available:
- **Squats**: Barbell Back Squat ↔ Belt Squat ↔ Jump Squats ↔ Lateral Lunges
- **Deadlifts**: Conventional Deadlift ↔ Rack Pull ↔ Single-Leg RDL
- **Posterior Chain**: Reverse Hyperextension ↔ Glute Bridge ↔ Hip Thrust
- **Pressing**: Bench Press ↔ Push-Ups ↔ Pike Push-Ups ↔ Weighted Dips ↔ Overhead Press
- **Pulling**: Pull-Ups ↔ Inverted Row ↔ Isometric Pull ↔ Dumbbell Row
- **Explosive**: Medicine Ball Slam ↔ Kettlebell Swing ↔ Burpee Box Jump ↔ Heavy Object Throw
- **Conditioning**: Heavy Bag ↔ Sprint Intervals ↔ Rope Jumps ↔ Shadow Boxing ↔ HIIT Circuit

## How Data is Saved
- All substitutions are automatically saved to your browser
- Previous week's data is automatically copied (just weights, not completion status)
- No internet connection needed - everything is local storage
- Data persists across browser sessions

## Examples

### Example 1: Reusing Previous Week's Weights
```
Week 1 - Monday: Barbell Back Squat at 140kg x 5
Week 2 - Monday: You click "↻ COPY FROM LAST WEEK"
Result: The weight field automatically shows 140kg from last week
```

### Example 2: Swapping to Alternative Exercise
```
Scenario: You don't have access to a Barbell Back Squat today
Action: Click "🔄 CHANGE EXERCISE" → Select "Belt Squat"
Result: The exercise switches to Belt Squat
Display: Shows "Barbell Back Squat (struck through) Belt Squat ★ ALTERNATIVE"
Undo: Click the ↩ button to go back to Barbell Back Squat
```

### Example 3: Tracking Completion
```
Starting a workout session:
1. Your session progress shows "0/5 — 0%"
2. As you complete exercises, click their checkboxes
3. After completing all exercises, you'll see "✓ SESSION COMPLETE — LOGGED"
4. The session is automatically marked as done for that day
```

## Tips & Best Practices

1. **Weekly Planning**: Use the WEEK view to see your progress and plan which days need completion
2. **Alternative Selection**: If an exercise is unavailable, swap it immediately rather than skipping
3. **Data Reuse**: Always copy from last week at the start of a session to maintain consistency
4. **Mobile-Friendly**: The modal slides up from the bottom for easier mobile interaction
5. **No Data Loss**: Even if you swap exercises or modify data, your historical data is preserved

## 4. 🏠 Home Mode: KB + Medicine Ball Track
- **Location**: TODAY tab mode toggle (Gym/Home)
- **What changed**: Home mode now loads a full 4-protocol plan built around kettlebells, medicine balls, and bodyweight only.
- **Protocols included**: Lower Power, Upper Power, Full Body Power, and Conditioning
- **Notes**: Exercises show small equipment tags so it is easy to see if a movement uses KB, MB, or bodyweight, and substitutions stay within the active mode so gym and home alternatives do not mix.

## Troubleshooting

**"Copy from Last Week" button doesn't appear?**
- This only appears when you have workout data from the same day last week
- Make sure you completed that day's workout in the previous week

**Exercise substitution not saving?**
- All changes are automatically saved to local storage
- Try refreshing the page to confirm the data was saved
- Check browser console for any error messages (F12 > Console)

**Alternative exercises not appearing?**
- Not all exercises have alternatives (e.g., Face Pulls, unique exercises)
- The modal will show "No alternative exercises available" if none exist
- You can still proceed with the original exercise
