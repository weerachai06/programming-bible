"use client";

import { Button } from "@/features/shared/components";
import { useState } from "react";
import {
  buildDeleteQuery,
  buildDynamicQuery,
  buildQuery,
  executeQuery,
} from "./utils";

export default function SecurityTestPage() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [htmlContent, setHtmlContent] = useState("");

  // XSS vulnerability - direct HTML injection
  const handleXSSTest = () => {
    const unsafeHTML = `<div>User says: ${userInput}</div>`;
    setHtmlContent(unsafeHTML);
  };

  // Code injection vulnerability - using eval
  const handleCodeInjection = () => {
    try {
      const result = eval(userInput); // eslint-disable-line no-eval
      setResult(String(result));
    } catch (error) {
      setResult("Error: " + (error as Error).message);
    }
  };

  // SQL injection test via API
  const handleSQLTest = async () => {
    try {
      const response = await fetch("/api/security-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userInput }),
      });
      const data = await response.json();
      setResult(JSON.stringify(data));
    } catch (error) {
      setResult("Error: " + (error as Error).message);
    }
  };

  // Direct SQL injection via utility functions
  const handleDirectSQLTest = () => {
    try {
      // Multiple SQL injection patterns
      const selectQuery = buildQuery("users", userInput);
      const deleteQuery = buildDeleteQuery("users", userInput);
      const dynamicQuery = buildDynamicQuery(userInput);

      // Execute raw SQL
      const rawQuery = `SELECT * FROM users WHERE id = ${userInput}`;
      executeQuery(rawQuery);

      setResult(
        `Executed queries: ${selectQuery}, ${deleteQuery}, ${dynamicQuery}, ${rawQuery}`
      );
    } catch (error) {
      setResult("Error: " + (error as Error).message);
    }
  };

  // Command injection
  const handleCommandInjection = () => {
    try {
      // Simulate command execution
      const command = `ls -la ${userInput}`;
      const grepCommand = `grep -r "${userInput}" /var/log/`;
      const findCommand = `find /home -name "${userInput}"`;

      setResult(`Commands: ${command}, ${grepCommand}, ${findCommand}`);
    } catch (error) {
      setResult("Error: " + (error as Error).message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>⚠️ WARNING:</strong> This page contains security
          vulnerabilities for testing purposes only!
        </div>

        <h1 className="text-3xl font-bold mb-6">Security Test Page</h1>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="userInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Test Input:
            </label>
            <input
              id="userInput"
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter test payload"
            />
          </div>

          <div className="space-x-4">
            <Button onClick={handleXSSTest}>Test XSS</Button>
            <Button onClick={handleCodeInjection}>Test Code Injection</Button>
            <Button onClick={handleSQLTest}>Test SQL Injection (API)</Button>
            <Button onClick={handleDirectSQLTest}>Test Direct SQL</Button>
            <Button onClick={handleCommandInjection}>
              Test Command Injection
            </Button>
          </div>

          {htmlContent && (
            <div className="border border-gray-300 p-4 rounded">
              <h3 className="font-semibold mb-2">XSS Result:</h3>
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          )}

          {result && (
            <div className="border border-gray-300 p-4 rounded">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
