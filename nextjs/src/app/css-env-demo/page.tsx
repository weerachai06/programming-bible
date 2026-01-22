import ClientComponent from './client'
import styles from './styles.module.css'

export default function CssEnvDemoPage() {
  return (
    <div className={styles.cssEnvDemo}>
      {/* Header with safe area */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>CSS env() Demo</h1>
          <p>Safe Area & Keyboard Inset</p>
        </div>
      </header>

      <ClientComponent />
    </div>
  )
}
