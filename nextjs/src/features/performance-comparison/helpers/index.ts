import type { ListItem } from '../types'

// Generated by Copilot
export const generateMockData = (count: number): ListItem[] => {
  const categories = ['Technology', 'Design', 'Business', 'Science', 'Art']
  const statuses: ListItem['status'][] = ['Active', 'Inactive', 'Pending']

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
    description: `This is description for item ${
      index + 1
    }. It contains some random text to make it look realistic and test how the component handles longer content.`,
    category: categories[index % categories.length],
    status: statuses[index % statuses.length],
    date: new Date(2024, index % 12, (index % 28) + 1).toLocaleDateString(),
  }))
}

export const measurePerformance = async (fn: () => void): Promise<number> => {
  const startTime = performance.now()
  await new Promise(resolve => {
    fn()
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })
  const endTime = performance.now()
  return endTime - startTime
}
