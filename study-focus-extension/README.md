# PROJECT TITLE: STUDY FOCUS EXTENSION 

#### Video Demo: <https://www.loom.com/share/5cf62d36ac354e90b4bb5436e7b7144e>

#### Description:
Study Focus is a browser extension developed to help students and professionals minimize distractions and maintain productivity. By blocking access to high-distraction websites during scheduled focus sessions, the extension encourages users to stay on task. It features a modern, "glassmorphism" user interface and provides flexible, user-defined focus durations.

#### Files:
* `manifest.json`: The core configuration file. It declares the extension's metadata, Manifest V3 architecture, and the necessary permissions: `declarativeNetRequest` for site blocking, `storage` for persistent timing data, and `alarms` for background tracking.
* `popup.html`: The user interface structure. It contains the timer display, the custom duration selector (dropdown), and the control buttons.
* `style.css`: Implements a premium "glassmorphism" aesthetic using semi-transparent backgrounds, backdrop blurs, and radial gradients for the body.
* `popup.js`: Manages UI logic. It updates the timer display by reading from `chrome.storage.local`, sends "start" and "stop" messages to the background worker, and dynamically sets the focus duration based on the user's dropdown selection.
* `background.js`: The central service worker that manages the logic. It uses the `declarativeNetRequest` API to inject and remove blocking rules dynamically and handles alarms to ensure the timer functions correctly even if the browser is minimized.
* `blocked.html`: The landing page that users see when they attempt to visit a blocked site, featuring a clean design and a motivational quote.

### Design Choices:
The extension was built using **Manifest V3** to ensure compliance with modern Chrome standards. 

* **Glassmorphism UI:** I chose a glass-effect design to give the extension a modern, professional look that is visually appealing, making the tool feel more like a premium productivity app.
* **Declarative Blocking:** I utilized the `declarativeNetRequest` API rather than older, deprecated methods. This is more efficient for the browser and allows the extension to block sites instantly without needing to intercept every single web request, which improves performance.
* **Dynamic Timing:** Initially, the timer was hardcoded to 25 minutes. I redesigned the popup to include a `<select>` dropdown menu, allowing users to choose between 25, 50, and 90-minute sessions. This was achieved by passing the duration as a variable from the `popup.js` message listener to the `background.js` alarm creation function, providing much greater flexibility for different types of work tasks.
* **Persistent State:** I used `chrome.storage.local` to track the `endTime` of a session. This ensures that if the user closes the popup and reopens it, the timer continues to count down accurately rather than resetting to a default state.

#### How to Install:
1. Download this project folder.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top-right corner.
4. Click the "Load unpacked" button and select the project folder
#### Challenges and Solutions:
* **Content Security Policy (CSP) Errors:** Early in development, I attempted to link external JavaScript and CSS files to my `blocked.html` file. This triggered security errors because Chrome's Manifest V3 has strict rules against executing external inline scripts or loading unauthorized local resources. I resolved this by embedding all styles directly into the `blocked.html` file using internal `<style>` tags, ensuring a smooth user experience without security violations.
* **UI/UX Error Icons:** When I first implemented the popup, I received a red error icon in the Chrome browser because my `popup.js` was trying to interact with HTML elements before the DOM had fully finished loading. I learned to wrap my script logic within a `document.addEventListener("DOMContentLoaded", ...)` function, which guaranteed the HTML was fully rendered before the script tried to manipulate it, effectively fixing the error.
* **Persistent Timer State:** I initially struggled with the timer resetting whenever the extension popup was closed. I overcame this by switching from using a simple variable to `chrome.storage.local`. This allowed me to save the "end time" (the exact future timestamp) of the session, so the extension could calculate the remaining time correctly every time the popup was opened, regardless of whether the browser was refreshed or closed.
