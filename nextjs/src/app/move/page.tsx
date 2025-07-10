export default function Page() {
  return (
    <div>
      {/* Move up animation */}
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-4 shadow-md rounded-md">
          <h1 className="text-2xl font-bold">Move up animation</h1>
          <p className="text-gray-500 animate-spin">
            This is an example of a move up animation.
          </p>
        </div>

        <button
          type="button"
          className="fixed bottom-4 right-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-md"
        >
          Move up
        </button>

        <button
          type="button"
          className="fixed bottom-4 right-16 bg-red-500 text-white font-bold py-2 px-4 rounded-md"
        >
          Move down
        </button>
      </div>
    </div>
  );
}
