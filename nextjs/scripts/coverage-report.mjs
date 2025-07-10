#!/usr/bin/env node
/**
 * Coverage Report Generator
 * Generates and displays test coverage information in a user-friendly format
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function colorize(text, color) {
  return `${color}${text}${colors.reset}`
}

function formatPercent(pct) {
  const rounded = pct.toFixed(2)
  const threshold = 80

  if (pct >= threshold) {
    return colorize(`${rounded}%`, colors.green)
  } else if (pct >= threshold - 20) {
    return colorize(`${rounded}%`, colors.yellow)
  } else {
    return colorize(`${rounded}%`, colors.red)
  }
}

function generateCoverageReport() {
  const coverageFile = path.join(
    path.dirname(__dirname),
    'coverage',
    'coverage-summary.json'
  )

  if (!fs.existsSync(coverageFile)) {
    console.error(colorize('❌ Coverage file not found!', colors.red))
    console.error('Run "pnpm test:coverage" first to generate coverage data.')
    process.exit(1)
  }

  try {
    const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'))
    const total = coverage.total

    console.log(
      colorize('\n📊 Test Coverage Report', colors.bright + colors.cyan)
    )
    console.log(colorize('═'.repeat(50), colors.cyan))

    // Coverage table
    console.log('\n📋 Coverage Summary:')
    console.log('┌─────────────┬─────────────┬─────────────┬─────────────┐')
    console.log(
      `│ ${colorize('Metric', colors.bright).padEnd(20)} │ ${colorize('Coverage', colors.bright).padEnd(20)} │ ${colorize('Threshold', colors.bright).padEnd(20)} │ ${colorize('Status', colors.bright).padEnd(20)} │`
    )
    console.log('├─────────────┼─────────────┼─────────────┼─────────────┤')

    const metrics = [
      { name: 'Lines', value: total.lines.pct },
      { name: 'Functions', value: total.functions.pct },
      { name: 'Branches', value: total.branches.pct },
      { name: 'Statements', value: total.statements.pct },
    ]

    metrics.forEach(metric => {
      const status =
        metric.value >= 80
          ? colorize('✅ PASS', colors.green)
          : colorize('❌ FAIL', colors.red)
      console.log(
        `│ ${metric.name.padEnd(11)} │ ${formatPercent(metric.value).padEnd(23)} │ ${'80%'.padEnd(11)} │ ${status.padEnd(23)} │`
      )
    })

    console.log('└─────────────┴─────────────┴─────────────┴─────────────┘')

    // Detailed breakdown
    console.log('\n📈 Detailed Breakdown:')
    console.log(
      `• Lines: ${colorize(total.lines.covered, colors.bright)}/${colorize(total.lines.total, colors.bright)} (${formatPercent(total.lines.pct)})`
    )
    console.log(
      `• Functions: ${colorize(total.functions.covered, colors.bright)}/${colorize(total.functions.total, colors.bright)} (${formatPercent(total.functions.pct)})`
    )
    console.log(
      `• Branches: ${colorize(total.branches.covered, colors.bright)}/${colorize(total.branches.total, colors.bright)} (${formatPercent(total.branches.pct)})`
    )
    console.log(
      `• Statements: ${colorize(total.statements.covered, colors.bright)}/${colorize(total.statements.total, colors.bright)} (${formatPercent(total.statements.pct)})`
    )

    // Overall status
    const allPassed = metrics.every(metric => metric.value >= 80)
    console.log('\n🎯 Overall Status:')

    if (allPassed) {
      console.log(colorize('✅ All coverage thresholds met!', colors.green))
      console.log(
        colorize(
          '🎉 Excellent work on maintaining high test coverage!',
          colors.green
        )
      )
    } else {
      console.log(colorize('❌ Some coverage thresholds not met', colors.red))
      console.log(
        colorize(
          '💡 Consider adding more tests to improve coverage',
          colors.yellow
        )
      )

      const failedMetrics = metrics.filter(metric => metric.value < 80)
      console.log('\n📋 Failed Metrics:')
      failedMetrics.forEach(metric => {
        console.log(
          `  • ${metric.name}: ${formatPercent(metric.value)} (need ${colorize((80 - metric.value).toFixed(2) + '%', colors.red)} more)`
        )
      })
    }

    // Tips section
    console.log('\n💡 Tips to improve coverage:')
    console.log('  • Add unit tests for uncovered functions')
    console.log('  • Test different code paths and edge cases')
    console.log('  • Use "pnpm test:coverage" to generate detailed reports')
    console.log('  • Open coverage/index.html for line-by-line analysis')

    // Files info
    console.log('\n📁 Generated Files:')
    console.log(
      `  • HTML Report: ${colorize('coverage/index.html', colors.cyan)}`
    )
    console.log(
      `  • JSON Report: ${colorize('coverage/coverage-final.json', colors.cyan)}`
    )
    console.log(
      `  • LCOV Report: ${colorize('coverage/lcov.info', colors.cyan)}`
    )
    console.log(
      `  • Summary: ${colorize('coverage/coverage-summary.json', colors.cyan)}`
    )

    console.log(colorize('\n═'.repeat(50), colors.cyan))

    // Exit with appropriate code
    if (!allPassed) {
      process.exit(1)
    }
  } catch (error) {
    console.error(
      colorize('❌ Error reading coverage data:', colors.red),
      error.message
    )
    process.exit(1)
  }
}

// Run the generator
generateCoverageReport()
