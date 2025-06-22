import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Generate Service Worker with environment variables
 * Part of React Design Patterns Study Guide build process
 */
function generateServiceWorker() {
  console.log("🔧 Generating Service Worker...");

  // Get environment variables
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  const version = process.env.npm_package_version || "1.0.0";
  const cacheName = `react-design-patterns-${version}-${timestamp}`;

  try {
    // Read template
    const templatePath = join(process.cwd(), "scripts", "sw.template.js");
    const template = readFileSync(templatePath, "utf8");

    // Replace placeholders
    const serviceWorkerCode = template.replace(/{{CACHE_NAME}}/g, cacheName);

    // Write to public directory
    const outputPath = join(process.cwd(), "public", `/sw.js`);
    writeFileSync(outputPath, serviceWorkerCode, "utf8");

    console.log("✅ Service Worker generated successfully!");
    console.log(`📁 Output: ${outputPath}`);
  } catch (error) {
    console.error("❌ Failed to generate Service Worker:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateServiceWorker();
}

export { generateServiceWorker };
