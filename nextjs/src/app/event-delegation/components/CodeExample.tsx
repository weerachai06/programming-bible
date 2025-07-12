export const CodeExample = () => {
  return (
    <div className="mt-8 bg-gray-900 text-white rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-3">Event Delegation Code:</h3>
      <pre className="text-sm overflow-x-auto">
        <code>{`// Single event handler for all buttons
const handleListClick = (event) => {
  const target = event.target
  const button = target.closest('button')
  if (!button) return

  const action = button.dataset.action
  const itemId = button.dataset.itemId
  
  // Handle different actions based on data attributes
  switch (action) {
    case 'toggle': /* toggle logic */ break
    case 'delete': /* delete logic */ break
    case 'edit': /* edit logic */ break
    case 'view': /* view logic */ break
  }
}

// Attach to parent container
<div onClick={handleListClick}>
  {items.map(item => (
    <button data-action="delete" data-item-id={item.id}>
      Delete
    </button>
  ))}
</div>`}</code>
      </pre>
    </div>
  )
}
