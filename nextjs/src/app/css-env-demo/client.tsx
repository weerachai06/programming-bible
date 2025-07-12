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
                    <input type="text" id="name" placeholder="Enter your name" />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" placeholder="Enter your email" />
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
            <h3>CSS Implementation</h3>
            <div className={styles.codeExample}>
              <h4>Using Safe Area Insets:</h4>
              <pre>
                <code>{`/* Safe area padding */
.header {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

.main-content {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Fallback values */
.container {
  padding: env(safe-area-inset-top, 20px) 
           env(safe-area-inset-right, 20px) 
           env(safe-area-inset-bottom, 20px) 
           env(safe-area-inset-left, 20px);
}`}</code>
              </pre>
            </div>

            <div className={styles.codeExample}>
              <h4>Keyboard Inset Adaptation:</h4>
              <pre>
                <code>{`/* Keyboard adaptation */
.form-container {
  padding-bottom: env(keyboard-inset-height, 0px);
  transition: padding-bottom 0.3s ease;
}

/* Viewport meta tag required */
<meta name="viewport" 
      content="width=device-width, initial-scale=1, viewport-fit=cover">

/* CSS to enable safe area support */
body {
  padding: env(safe-area-inset-top, 0) 
           env(safe-area-inset-right, 0) 
           env(safe-area-inset-bottom, 0) 
           env(safe-area-inset-left, 0);
}`}</code>
              </pre>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default ClientComponent
