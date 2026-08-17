'use client'

import { useState } from 'react'

export default function SharePage() {
  const [status, setStatus] = useState<string | null>(null)

  const shareData = {
    title: 'Programming Bible',
    text: 'ลองดู Next.js app นี้สิ!',
    url: typeof window !== 'undefined' ? window.location.href : '',
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        setStatus('แชร์สำเร็จ')
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setStatus('แชร์ไม่สำเร็จ')
        }
      }
    } else {
      await navigator.clipboard.writeText(shareData.url)
      setStatus('เบราว์เซอร์นี้ไม่รองรับ Web Share API — คัดลอกลิงก์แล้ว')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Share Demo</h1>
      <p className="text-gray-500">ใช้ System Share ของเบราว์เซอร์/OS</p>
      <button
        type="button"
        onClick={handleShare}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        แชร์
      </button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </main>
  )
}
