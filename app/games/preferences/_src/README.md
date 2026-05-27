### Detailed Game Rules for "Preferences"

#### **Overview**
"Preferences" is a mobile-friendly, multiplayer party game played on a single device. The goal is to achieve the lowest score by accurately predicting the target player's preferences for a set of cards. The game promotes fun, honesty, and collaboration among players.

---

### **Game Setup**
1. **Player Registration:**
   - Players enter their names before the game begins.
   - The entered names will determine the turn order for the target player role.
   - The game accommodates a minimum of 2 players but is best with 5-10 players.

2. **Number of Rounds:**
   - Players can set the number of rounds before starting the game. The default is 5 rounds.

3. **Device Orientation:**
   - When the game starts, the app prompts the device to switch from vertical (portrait) to horizontal (landscape) orientation for optimal gameplay.
---
### **Gameplay**
#### **Round Structure**
1. **Target Player's Turn:**
   - The app highlights the current **target player’s name** as a header to indicate whose turn it is.
   - The target player is presented with 5 cards displayed in a row. Each card contains a word or topic.
   - The target player ranks the cards in secret from **1 (love) to 5 (loathe)** based on their personal preferences. 
   - Once finished, the target player presses the **"Submit"** button to lock in their rankings. 

   > **Note:** The target player cannot provide any hints or facial expressions while other players discuss their predictions.

2. **Group Prediction:**
   - The remaining players work together **out loud** in person to determine a consensus ranking for the same 5 cards.
   - The group enters their final rankings in the app and submits them.

3. **Scoring for the Round:**
   - For each card, the difference between the target player’s ranking and the group’s prediction is calculated.
     - **Example:** If the target player ranks a card as "2" and the group ranks it as "5", the score for that card is `|5 - 2| = 3`.
   - The round score is the sum of differences for all 5 cards.
   - The round score is added to each **non-target player’s cumulative score.**
   - The target player does not receive a score for their turn.

4. **Review:**
   - After submitting the group prediction, the app reveals:
     - The target player’s rankings.
     - The group’s predictions.
     - The total round score.
     - The updated cumulative scores for all players.
   - Players press **"Next"** to proceed to the next round.

5. **Next Target Player:**
   - The app rotates the target player to the next person in the player list. The device is handed to this player for their turn.

#### **Game Progression**
- The app continuously displays:
  - The **current round number**.
  - Each player’s **cumulative score.**
- Rounds continue until the pre-set number of rounds is completed.
---
### **End of the Game**
- After all rounds, the app announces the winner:
  - The player with the **lowest cumulative score** wins.
- If there is a tie, the app states, "It's a tie!"
---
### **Visual and Functional Features**
1. **Card Display:**
   - The 5 cards are displayed in a single horizontal row.
   - Cards can be dragged and dropped for ranking, with smooth animations.

2. **Animations:**
   - Submitting rankings triggers animations to reveal scores and transition to the next round.

3. **Scoring Screen:**
   - At the end of each round, scores are displayed with a breakdown:
     - The group’s prediction vs. the target player’s ranking.
     - Individual card differences and total round score.

4. **Minimal and Quirky Design:**
   - Clean UI with fun/quirky icons and colors to enhance the party atmosphere.

5. **Mobile-Friendly:**
   - Fully responsive design optimized for mobile devices in horizontal orientation.
---
### **Technical Considerations**
- **State Management:** React state hooks (e.g., `useState`, `useReducer`) will manage game data such as player names, rankings, scores, and round progression.
- **Local Game:** All data is stored locally in memory; no internet connection or backend is required.
- **Device Rotation:** Use the device orientation API to ensure proper display when switching to horizontal mode.
---
### **Adjustable Settings**
- Number of rounds (default is 5, adjustable before the game starts). 