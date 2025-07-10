"use client";

import { useEffect, useState } from "react";

/**
 * Vulnerable Client Component - Contains intentional security vulnerabilities
 *
 * WARNING: This component contains intentional security vulnerabilities for testing purposes.
 * DO NOT use these patterns in production code!
 */
export default function VulnerableClientComponent() {
  const [data, setData] = useState<any>(null);
  const [userScript, setUserScript] = useState("");

  // VULNERABILITY 1: Unsafe use of localStorage with user input
  useEffect(() => {
    // CodeQL should flag this as potential XSS via localStorage
    const storedScript = localStorage.getItem("userScript");
    if (storedScript) {
      setUserScript(storedScript);
    }
  }, []);

  // VULNERABILITY 2: Unsafe postMessage handling
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // CodeQL should flag this as unsafe postMessage handling
      // Missing origin validation
      const { type, payload } = event.data;

      if (type === "EXECUTE_CODE") {
        try {
          // CodeQL should flag this as code injection
          const result = eval(payload); // eslint-disable-line no-eval
          console.log("Executed code result:", result);
        } catch (error) {
          console.error("Code execution failed:", error);
        }
      }

      if (type === "UPDATE_HTML") {
        // CodeQL should flag this as XSS vulnerability
        const element = document.getElementById("dynamic-content");
        if (element) {
          element.innerHTML = payload;
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // VULNERABILITY 3: Unsafe fetch with user-controlled URL
  const handleFetchData = async () => {
    try {
      // CodeQL should flag this as SSRF vulnerability
      const url = prompt("Enter URL to fetch:");
      if (url) {
        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          credentials: "include", // CodeQL should flag this as potentially unsafe
        });
        const data = await response.json();
        setData(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // VULNERABILITY 4: Unsafe cookie handling
  const handleSetCookie = () => {
    const cookieValue = prompt("Enter cookie value:");
    if (cookieValue) {
      // CodeQL should flag this as unsafe cookie handling
      document.cookie = `userPref=${cookieValue}; path=/`;
    }
  };

  // VULNERABILITY 5: Unsafe DOM manipulation
  const handleDOMManipulation = () => {
    const htmlContent = prompt("Enter HTML content:");
    if (htmlContent) {
      // CodeQL should flag this as XSS vulnerability
      const div = document.createElement("div");
      div.innerHTML = htmlContent;
      document.body.appendChild(div);
    }
  };

  // VULNERABILITY 6: Unsafe script injection
  const handleScriptInjection = () => {
    const scriptContent = prompt("Enter script content:");
    if (scriptContent) {
      // CodeQL should flag this as script injection
      const script = document.createElement("script");
      script.textContent = scriptContent;
      document.head.appendChild(script);
    }
  };

  // VULNERABILITY 7: Unsafe event handler
  const handleEventHandler = () => {
    const eventCode = prompt("Enter event handler code:");
    if (eventCode) {
      // CodeQL should flag this as code injection
      const button = document.createElement("button");
      button.textContent = "Click me";
      button.setAttribute("onclick", eventCode);
      document.body.appendChild(button);
    }
  };

  // VULNERABILITY 8: Unsafe window.open
  const handleWindowOpen = () => {
    const url = prompt("Enter URL to open:");
    if (url) {
      // CodeQL should flag this as unsafe window.open
      window.open(url, "_blank");
    }
  };

  // VULNERABILITY 9: Unsafe localStorage serialization
  const handleLocalStorageData = () => {
    const userData = prompt("Enter user data (JSON):");
    if (userData) {
      try {
        // CodeQL should flag this as unsafe deserialization
        const parsed = JSON.parse(userData);
        localStorage.setItem("userData", JSON.stringify(parsed));

        // CodeQL should flag this as potential XSS
        const userNameElement = document.getElementById("user-name");
        if (userNameElement && parsed.name) {
          userNameElement.innerHTML = `Welcome, ${parsed.name}!`;
        }
      } catch (error) {
        console.error("JSON parsing error:", error);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <strong>⚠️ WARNING:</strong> This component contains intentional
        security vulnerabilities for CodeQL testing.
      </div>

      <h2 className="text-2xl font-bold mb-6">
        Client-Side Security Vulnerabilities
      </h2>

      <div className="space-y-4">
        <button
          onClick={handleFetchData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Unsafe Fetch (SSRF)
        </button>

        <button
          onClick={handleSetCookie}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Unsafe Cookie Setting
        </button>

        <button
          onClick={handleDOMManipulation}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Unsafe DOM Manipulation
        </button>

        <button
          onClick={handleScriptInjection}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Script Injection
        </button>

        <button
          onClick={handleEventHandler}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Unsafe Event Handler
        </button>

        <button
          onClick={handleWindowOpen}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Unsafe Window Open
        </button>

        <button
          onClick={handleLocalStorageData}
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Unsafe localStorage
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div
          id="dynamic-content"
          className="border border-gray-300 p-4 rounded"
        >
          Dynamic content will appear here
        </div>

        <div id="user-name" className="border border-gray-300 p-4 rounded">
          User name will appear here
        </div>

        {data && (
          <div className="border border-gray-300 p-4 rounded">
            <h3 className="font-bold mb-2">Fetched Data:</h3>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold mb-2">Expected CodeQL Findings:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>XSS via innerHTML and DOM manipulation</li>
          <li>Code injection via eval() and script injection</li>
          <li>SSRF via user-controlled fetch URLs</li>
          <li>Unsafe postMessage handling without origin validation</li>
          <li>Unsafe cookie handling</li>
          <li>Unsafe localStorage operations</li>
          <li>Unsafe window.open operations</li>
          <li>Unsafe deserialization of user input</li>
        </ul>
      </div>
    </div>
  );
}
