# Gaming Website

A web-based gaming platform featuring classic games Snake and 2048. The website includes user authentication, high score tracking, and mobile device support.

## Games

<table>
<tr>
<td align="center" width="50%">

### 2048
<img src="images/2048.png" width="150" height="150" alt="2048 Game Icon"/>

Classic tile-merging puzzle game
</td>
<td align="center" width="50%">

### Snake
<img src="images/snake.png" width="150" height="150" alt="Snake Game Icon"/>

Classic snake game with modern features
</td>
</tr>
</table>

## Features

### User Authentication
- User registration with username and email
- Secure login system with:
  - Email or username login options
  - Account lockout after 3 failed attempts (2-minute cooldown)
  - Session tracking
  - Last login timestamp

### Games

#### Snake Game
- Classic snake gameplay with modern features:
  - Dynamic difficulty levels (Easy, Medium, Hard)
  - Color-changing snake based on food collected
  - Score tracking
  - Responsive grid system
  - High score leaderboard for each difficulty level
- Controls:
  - Desktop: Arrow keys
  - Mobile: Swipe gestures
- Features:
  - Random food placement
  - Collision detection
  - Game over screen
  - Quick restart option

#### 2048 Game
- Classic 2048 gameplay mechanics:
  - 4x4 grid
  - Merge tiles with same numbers
  - Score tracking
- Features:
  - Undo move functionality (requires 256+ points)
  - High score system
  - Game over detection
- Controls:
  - Desktop: Arrow keys
  - Mobile: Swipe gestures

### Additional Features
- Responsive design for mobile and desktop
- Local storage for persistent data
- Session time tracking
- User-specific high scores
- Global leaderboards

## Technical Details

### Storage
The application uses localStorage to maintain:
- User credentials
- Game high scores
- Session information
- User statistics

### Data Structure
```javascript
userData: {
    username: {
        email: string,
        lastLogin: timestamp,
        totalTime: number,
        snakeHighScores: array,
        game2048HighScores: array
    }
}
```

## Getting Started

1. Clone the repository
2. Open `login.html` in your web browser
3. Register a new account or login with existing credentials
4. Navigate to either game from the main menu

## Browser Compatibility
- Supports all modern browsers
- Requires localStorage functionality
- JavaScript must be enabled

## Security Features
- Password protection
- Account lockout system
- Session management
- Secure data storage using localStorage

## Future Improvements
- Add more games
- Implement online multiplayer
- Add social features (friends list, challenges)
- Introduce achievements system
- Add sound effects and background music
- Implement user profiles with avatars

## Contributing
Feel free to submit issues and enhancement requests.
