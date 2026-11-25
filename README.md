# Strength Workout Program

A comprehensive workout tracking application with strength programming, analytics, and mobility routines.

## Features

- 📋 **Customizable Schedule**: Choose 2-4 workout days per week
- 💪 **4 Workout Protocols**:
  - Lower Power (Strength Foundation)
  - Upper Power (Push & Pull Strength)
  - Full Body Power (Combat Athleticism)
  - Conditioning (MMA Readiness)
- 🏋️ **Dual Modes**: Gym and home workout alternatives
- 📊 **Comprehensive Analytics**:
  - Daily progress tracking
  - Weekly session overview with charts
  - Monthly heatmap calendar
  - Weight progression tracking
  - Personal bests monitoring
- 🧘 **Daily Mobility**: Built-in stretching and mobility routine
- ⏰ **Workout Reminders**: Set custom reminder times
- 💾 **Local Data Storage**: All data saved to browser localStorage
- 🤖 **AI Training Suggestions**: Load progression ideas based on recent logged work, with alternatives for unavailable equipment

## Project Structure

```
strength-workout-program/
├── index.html                 # Main entry point
├── src/
│   ├── css/
│   │   └── styles.css        # All application styles
│   ├── js/
│   │   ├── data.js           # Workout and mobility data
│   │   ├── utils.js          # Utility functions
│   │   ├── storage.js        # LocalStorage helpers
│   │   ├── charts.js         # Chart.js utilities
│   │   └── app.js            # Main application logic
│   └── assets/               # (Future) Images, icons, etc.
├── package.json              # Project metadata
├── README.md                 # This file
└── .gitignore               # Git ignore rules

```

## Getting Started

### Option 1: Direct Browser Access
Simply open `index.html` in any modern web browser. No build step required!

### Run the App and AI Suggestions
The AI endpoint runs in the Node server so the provider key is not exposed to browser code. Use Node.js 18 or newer. Copy `.env.example` to `.env`, replace the placeholder with your newly generated provider key, save, then run `npm start`. The server loads `.env` automatically. Anthropic is selected when both provider keys are present:

```text
ANTHROPIC_API_KEY=your-new-anthropic-api-key
ANTHROPIC_MODEL=claude-haiku-4-5-20251001
```

On Windows, copy the example using:

```powershell
Copy-Item .env.example .env
notepad .env
```

Then start the app:

```powershell
npm start
```

For OpenAI, use `OPENAI_API_KEY` and optionally `OPENAI_MODEL` (default `gpt-4o-mini`). For Anthropic, use `ANTHROPIC_API_KEY` and optionally `ANTHROPIC_MODEL`. Open the URL printed at startup (normally `http://localhost:8000`; if that port is occupied, the server selects the next available port). The AI feature sends the active workout, up to eight weeks of matching logged load/reps, and substitute exercise options to your configured provider only when you request suggestions. The browser continues to store workout data locally.

Do not deploy the API server publicly without adding authentication and request rate limits. The default server binds to localhost.

To run without the AI server, you can still open `index.html` directly, but AI suggestions require the Node server and API key above.

## Usage

1. **Setup Phase**: Select 2-4 workout days from the week
2. **Workout Tracking**: 
   - Navigate between days using the schedule pills
   - Toggle exercises as you complete them
   - Log weights and reps for weighted exercises
3. **Analytics**:
   - **Today**: Current day's workout and progress
   - **Week**: Weekly overview with session dots and weight progression
   - **Month**: Monthly calendar heatmap and consistency metrics

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Responsive design with flexbox/grid
- **Vanilla JavaScript**: Pure JS, no frameworks
- **Chart.js**: Data visualization for analytics

## Data Storage

Workout data is stored locally in your browser's localStorage:
- `ppLog`: Workout log with completed exercises and weights
- `ppMobility`: Daily mobility tracking

When you request AI suggestions, the active workout, up to eight weeks of matching logged load/reps, and substitute exercise options are sent through the local Node server to the configured AI provider. The API key remains on the server and is not sent to the browser. Without requesting suggestions, workout data stays in browser storage.

## Customization

### Adding New Exercises
Edit `src/js/data.js` and add entries to the `WORKOUTS` array:

```javascript
{
  id: "ex-id",
  name: "Exercise Name",
  sets: "5x3",
  note: "Description",
  weighted: true/false
}
```

### Modifying Styles
Edit `src/css/styles.css`. The design uses CSS variables and follows a consistent color scheme:
- **Primary**: `#c8501a` (Orange)
- **Background**: `#0a0a0a` (Black)
- **Text**: `#e8e4dc` (Cream)

### Changing the Schedule
The default rotation is:
1. Lower Power
2. Upper Power
3. Full Body Power
4. Conditioning

Edit the `WORKOUTS` array order in `src/js/data.js` to change this.

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## Tips for Maximum Gains

1. **Consistency**: Stick to your chosen schedule
2. **Progressive Overload**: Log weights to track progression
3. **Mobility**: Complete daily stretches for injury prevention
4. **Recovery**: Use the data to identify patterns and optimize rest

## License

MIT License - Feel free to modify and use as needed!

## Future Enhancements

- [ ] Export workout data as CSV/PDF
- [ ] Cloud backup/sync
- [ ] Share workouts with training partners
- [ ] Advanced analytics and body composition tracking
- [ ] Integration with fitness wearables

---

**Build like Anatoli. Move like Baki.** 💪
Build like Anatoli, Move like Baki
