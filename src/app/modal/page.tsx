"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal/Modal";

const inputClasses =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Modal
      </button>

      <Modal.Root
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        duration={300}
      >
        <Modal.Overlay />
        <Modal.Content title="Example Modal">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Welcome</h2>
            <p>This modal is accessible and animated.</p>
            <form className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input type="text" id="name" className={inputClasses} />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input type="email" id="email" className={inputClasses} />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea id="message" rows={3} className={inputClasses} />
              </div>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-800 text-white hover:bg-gray-700 h-10 px-4 py-2">
                Submit
              </button>
            </form>
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
            >
              Close
            </button>
          </div>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}
