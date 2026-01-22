'use client'

import { useState } from 'react'
import styles from './styles.module.css'

const ClientComponent = () => {
  const [showForm, setShowForm] = useState(false)
  return (
    <>
      {/* Main content */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <section className={styles.infoSection}>
            <h2>CSS Environment Variables</h2>
            <p>
              CSS env() function allows you to access environment variables set
              by the user agent. This is particularly useful for mobile devices
              with notches, rounded corners, and virtual keyboards.
            </p>

            <div className={styles.envExamples}>
              <h3>Available Environment Variables:</h3>
              <ul>
                <li>
                  <code>safe-area-inset-top</code> - Top safe area (notch,
                  status bar)
                </li>
                <li>
                  <code>safe-area-inset-right</code> - Right safe area
                </li>
                <li>
                  <code>safe-area-inset-bottom</code> - Bottom safe area (home
                  indicator)
                </li>
                <li>
                  <code>safe-area-inset-left</code> - Left safe area
                </li>
                <li>
                  <code>keyboard-inset-height</code> - Virtual keyboard height
                </li>
              </ul>
            </div>

            <div className={styles.demoSections}>
              <div className={styles.demoCard}>
                <h4>Safe Area Demo</h4>
                <p>
                  This page uses safe area insets to ensure content doesn't get
                  hidden behind device UI elements.
                </p>
                <div className={styles.safeAreaVisual}>
                  <div className={styles.safeZone}>Safe Content Area</div>
                </div>
              </div>

              <div className={styles.demoCard}>
                <h4>Navigation Bar Demo</h4>
                <p>Fixed navigation that respects safe areas on all sides.</p>
                <div className={styles.navDemo}>
                  <nav className={styles.fixedNav}>
                    <span>🏠 Home</span>
                    <span>📱 Mobile Safe</span>
                    <span>⚙️ Settings</span>
                  </nav>
                </div>
              </div>

              <div className={styles.demoCard}>
                <h4>Full-Screen Content</h4>
                <p>
                  Content that extends to screen edges while avoiding notches.
                </p>
                <div className={styles.fullScreenDemo}>
                  <div className={styles.fullScreenContent}>
                    <div className={styles.contentArea}>
                      Full-screen content with safe padding
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.demoCard}>
                <h4>Bottom Action Bar</h4>
                <p>Action bar that adapts to home indicator area.</p>
                <div className={styles.actionBarDemo}>
                  <div className={styles.actionBar}>
                    <button type="button">❤️ Like</button>
                    <button type="button">💬 Comment</button>
                    <button type="button">📤 Share</button>
                  </div>
                </div>
              </div>

              <div className={styles.demoCard}>
                <h4>Side Panel Demo</h4>
                <p>Side navigation that respects left/right safe areas.</p>
                <div className={styles.sidePanelDemo}>
                  <div className={styles.sidePanel}>
                    <div className={styles.panelItem}>📋 Dashboard</div>
                    <div className={styles.panelItem}>📊 Analytics</div>
                    <div className={styles.panelItem}>👤 Profile</div>
                  </div>
                </div>
              </div>

              <div className={styles.demoCard}>
                <h4>Keyboard Inset Demo</h4>
                <p>
                  Click the button below to show a form that responds to virtual
                  keyboard.
                </p>
                <button
                  type="button"
                  className={styles.demoButton}
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Hide Form' : 'Show Form with Keyboard Demo'}
                </button>
              </div>
            </div>
          </section>

          {/* Form that demonstrates keyboard inset */}
          {showForm && (
            <section className={styles.formSection}>
              <div className={styles.formContainer}>
                <h3>Form with Keyboard Adaptation</h3>
                <p>
                  On mobile devices, this form will adapt when the virtual
                  keyboard appears.
                </p>

                <form className={styles.demoForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message">Message:</label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Enter your message"
                    ></textarea>
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    Submit
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* Code examples */}
          <section className={styles.codeSection}>
            <h3>CSS Implementation Examples</h3>

            <div className={styles.codeExample}>
              <h4>1. Basic Safe Area Usage:</h4>
              <pre>
                <code>{`/* Basic safe area padding */
.header {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

.main-content {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
}`}</code>
              </pre>
            </div>

            <div className={styles.codeExample}>
              <h4>2. Fixed Navigation with Safe Areas:</h4>
              <pre>
                <code>{`/* Fixed nav that respects safe areas */
.fixed-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  
  /* Add safe area padding */
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  
  /* Additional padding for content */
  padding-bottom: 1rem;
}

.nav-content {
  padding: 1rem;
}`}</code>
              </pre>
            </div>

            <div className={styles.codeExample}>
              <h4>3. Full-Screen Content with Safe Areas:</h4>
              <pre>
                <code>{`/* Full-screen container */
.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #667eea, #764ba2);
}

/* Content with safe area insets */
.full-screen-content {
  height: 100%;
  padding: env(safe-area-inset-top, 20px) 
           env(safe-area-inset-right, 20px) 
           env(safe-area-inset-bottom, 20px) 
           env(safe-area-inset-left, 20px);
  
  display: flex;
  align-items: center;
  justify-content: center;
}`}</code>
              </pre>
            </div>

            <div className={styles.codeExample}>
              <h4>4. Bottom Action Bar:</h4>
              <pre>
                <code>{`/* Bottom action bar with home indicator support */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e0e0e0;
  
  /* Respect bottom safe area (home indicator) */
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  
  /* Additional content padding */
  padding-top: 1rem;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  padding: 0 1rem 1rem 1rem;
}`}</code>
              </pre>
            </div>

            <div className={styles.codeExample}>
              <h4>5. Side Panel with Left/Right Safe Areas:</h4>
              <pre>
                <code>{`/* Side panel that respects landscape safe areas */
.side-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: #f8f9fa;
  
  /* Safe area padding for all sides */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  
  /* Transform based on safe area */
  transform: translateX(calc(-100% + env(safe-area-inset-left)));
}

.side-panel.open {
  transform: translateX(0);
}`}</code>
              </pre>
            </div>

            <div className={styles.codeExample}>
              <h4>6. Responsive with max() Function:</h4>
              <pre>
                <code>{`/* Use max() for minimum padding with safe areas */
.responsive-container {
  /* Ensure at least 1rem padding, more if safe area requires */
  padding: max(env(safe-area-inset-top), 1rem) 
           max(env(safe-area-inset-right), 1rem) 
           max(env(safe-area-inset-bottom), 1rem) 
           max(env(safe-area-inset-left), 1rem);
}

/* Specific for landscape orientation */
@media (orientation: landscape) {
  .responsive-container {
    padding-left: max(env(safe-area-inset-left), 2rem);
    padding-right: max(env(safe-area-inset-right), 2rem);
  }
}`}</code>
              </pre>
            </div>

            <div className={styles.codeExample}>
              <h4>7. CSS Custom Properties with env():</h4>
              <pre>
                <code>{`/* Define custom properties using env() */
:root {
  --safe-top: env(safe-area-inset-top);
  --safe-right: env(safe-area-inset-right);
  --safe-bottom: env(safe-area-inset-bottom);
  --safe-left: env(safe-area-inset-left);
  
  /* Combined values */
  --safe-x: env(safe-area-inset-left) env(safe-area-inset-right);
  --safe-y: env(safe-area-inset-top) env(safe-area-inset-bottom);
}

/* Use the custom properties */
.container {
  padding: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
}

.horizontal-safe {
  padding-left: var(--safe-left);
  padding-right: var(--safe-right);
}`}</code>
              </pre>
            </div>

            <div className={styles.codeExample}>
              <h4>8. Keyboard Adaptation (Optional):</h4>
              <pre>
                <code>{`/* Only use if keyboard adaptation is needed */
.form-container {
  padding-bottom: env(keyboard-inset-height, 0px);
  transition: padding-bottom 0.3s ease;
}

/* Viewport meta tag required for env() support */
<meta name="viewport" 
      content="width=device-width, initial-scale=1, viewport-fit=cover">`}</code>
              </pre>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default ClientComponent
