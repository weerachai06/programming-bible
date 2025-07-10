"use client";

import { Button } from "@/features/shared/components/button";
import { useState } from "react";
import VulnerableClientComponent from "./client-vulnerabilities";

/**
 * Security Test Page - Contains intentional vulnerabilities for CodeQL testing
 *
 * WARNING: This page contains intentional security vulnerabilities for testing purposes.
 * DO NOT use these patterns in production code!
 */
export default function SecurityTestPage() {
  const [userInput, setUserInput] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [evalResult, setEvalResult] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");

  // VULNERABILITY 1: XSS - Direct HTML injection without sanitization
  const handleXssTest = () => {
    // CodeQL should flag this as a potential XSS vulnerability
    const unsafeHTML = `<div>User input: ${userInput}</div><script>alert('XSS vulnerability!')</script>`;
    setHtmlContent(unsafeHTML);
  };

  // VULNERABILITY 2: Code injection - Using eval() with user input
  const handleEvalTest = () => {
    try {
      // CodeQL should flag this as code injection vulnerability
      const result = eval(userInput); // eslint-disable-line no-eval
      setEvalResult(String(result));
    } catch (error) {
      setEvalResult("Error: " + (error as Error).message);
    }
  };

  // VULNERABILITY 3: SQL injection pattern (simulated)
  const handleSqlTest = () => {
    // CodeQL should flag this as potential SQL injection
    const query = `SELECT * FROM users WHERE username = '${userInput}' AND password = '${userInput}'`;
    setSqlQuery(query);

    // Simulated database call with unsafe query construction
    fetch("/api/unsafe-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
  };

  // VULNERABILITY 4: Unsafe dynamic import
  const handleDynamicImport = async () => {
    try {
      // CodeQL should flag this as unsafe dynamic import
      const modulePath = userInput;
      const module = await import(modulePath);
      console.log("Loaded module:", module);
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

  // VULNERABILITY 5: Unsafe regex (ReDoS)
  const handleRegexTest = () => {
    // CodeQL should flag this as potential ReDoS vulnerability
    const unsafeRegex = new RegExp(`(a+)+b${userInput}`);
    const testString = "a".repeat(100) + "c"; // This will cause catastrophic backtracking
    try {
      const result = unsafeRegex.test(testString);
      console.log("Regex result:", result);
    } catch (error) {
      console.error("Regex error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>⚠️ WARNING:</strong> This page contains intentional security
          vulnerabilities for CodeQL testing. DO NOT use these patterns in
          production code!
        </div>

        <h1 className="text-3xl font-bold mb-6">
          Security Vulnerability Testing
        </h1>

        <div className="space-y-8">
          {/* User Input Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label
              htmlFor="userInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Test Input (Enter malicious payloads):
            </label>
            <input
              id="userInput"
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Try: <script>alert('XSS')</script> or ' OR '1'='1"
            />
          </div>

          {/* XSS Test */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">
              1. XSS Vulnerability Test
            </h2>
            <Button onClick={handleXssTest} className="mb-3">
              Test XSS (dangerouslySetInnerHTML)
            </Button>
            {htmlContent && (
              <div
                className="border border-red-300 p-3 rounded bg-red-50"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            )}
          </div>

          {/* Code Injection Test */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">
              2. Code Injection Test (eval)
            </h2>
            <Button onClick={handleEvalTest} className="mb-3">
              Execute Code with eval()
            </Button>
            {evalResult && (
              <div className="border border-orange-300 p-3 rounded bg-orange-50">
                <strong>Result:</strong> {evalResult}
              </div>
            )}
          </div>

          {/* SQL Injection Test */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">
              3. SQL Injection Test
            </h2>
            <Button onClick={handleSqlTest} className="mb-3">
              Generate Unsafe SQL Query
            </Button>
            {sqlQuery && (
              <div className="border border-purple-300 p-3 rounded bg-purple-50">
                <strong>Generated Query:</strong>
                <pre className="mt-2 text-sm">{sqlQuery}</pre>
              </div>
            )}
          </div>

          {/* Dynamic Import Test */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">
              4. Unsafe Dynamic Import
            </h2>
            <Button onClick={handleDynamicImport} className="mb-3">
              Dynamic Import (check console)
            </Button>
            <p className="text-sm text-gray-600">
              Try entering module paths like: ../../../package.json
            </p>
          </div>

          {/* ReDoS Test */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">
              5. ReDoS Vulnerability Test
            </h2>
            <Button onClick={handleRegexTest} className="mb-3">
              Test Catastrophic Backtracking
            </Button>
            <p className="text-sm text-gray-600">
              This will create a regex that causes catastrophic backtracking.
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold mb-2">Expected CodeQL Findings:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Cross-site scripting (XSS) vulnerability</li>
            <li>Code injection via eval()</li>
            <li>SQL injection vulnerability</li>
            <li>Unsafe dynamic import</li>
            <li>Regular expression denial of service (ReDoS)</li>
          </ul>
        </div>

        {/* Client-side vulnerabilities component */}
        <div className="mt-8 border-t pt-8">
          <VulnerableClientComponent />
        </div>
      </div>
    </div>
  );
}
