import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Generate Service Worker with environment variables
 * Part of React Design Patterns Study Guide build process
 */
function generateServiceWorker() {
  console.log("🔧 Generating Service Worker...");

  // Get environment variables
  const environment = process.env.NODE_ENV || "development";
  const version = process.env.npm_package_version || "1.0.0";

  // Generate cache name with timestamp for unique versioning
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, "");
  const cacheName = `${version}-${timestamp}`;

  console.log(`📦 Cache Name: ${cacheName}`);
  console.log(`🌍 Environment: ${environment}`);
  console.log(`📋 Version: ${version}`);

  try {
    // Read template
    const templatePath = join(process.cwd(), "scripts", "sw.template.js");
    const template = readFileSync(templatePath, "utf8");

    // Replace placeholders
    const serviceWorkerCode = template
      .replace(/{{CACHE_NAME}}/g, cacheName)
      .replace(/{{VERSION}}/g, version)
      .replace(/{{ENVIRONMENT}}/g, environment);

    // Write to public directory
    const outputPath = join(process.cwd(), "public", "sw.js");
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
