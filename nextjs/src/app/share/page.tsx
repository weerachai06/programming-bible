'use client'

import { useEffect, useState } from 'react'

const getBrowserName = (ua: string): string => {
  if (/FBAN|FBAV|FB_IAB|FB4AN|FBIOS/i.test(ua)) return 'Facebook (in-app browser)'
  if (/Instagram/i.test(ua)) return 'Instagram (in-app browser)'
  if (/Line\//i.test(ua)) return 'LINE (in-app browser)'
  if (/edg\//i.test(ua)) return 'Microsoft Edge'
  if (/opr\//i.test(ua) || /opera/i.test(ua)) return 'Opera'
  if (/firefox\//i.test(ua)) return 'Firefox'
  if (/chrome\//i.test(ua) && !/edg\//i.test(ua)) return 'Chrome'
  if (/safari\//i.test(ua) && !/chrome\//i.test(ua)) return 'Safari'
  return 'เบราว์เซอร์นี้'
}

export default function SharePage() {
  const [status, setStatus] = useState<string | null>(null)
  const [canShare, setCanShare] = useState<boolean | null>(null)
  const [browserName, setBrowserName] = useState<string>('')
  const [rawUa, setRawUa] = useState<string>('')

  useEffect(() => {
    const ua = navigator.userAgent
    setRawUa(ua)
    setBrowserName(getBrowserName(ua))
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  const shareData = {
    title: 'Programming Bible',
    text: 'ลองดู Next.js app นี้สิ!',
    url: typeof window !== 'undefined' ? window.location.href : '',
  }

  const handleShare = async () => {
    try {
      await navigator.share(shareData)
      setStatus('แชร์สำเร็จ')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setStatus('แชร์ไม่สำเร็จ')
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Share Demo</h1>
      <p className="text-gray-500">ใช้ System Share ของเบราว์เซอร์/OS</p>
      <p className="text-sm text-gray-400">
        เบราว์เซอร์ของคุณ: <span className="font-medium">{browserName || 'กำลังตรวจสอบ...'}</span>
      </p>
      {rawUa && (
        <details className="max-w-2xl text-xs text-gray-400">
          <summary className="cursor-pointer">User-Agent (debug)</summary>
          <code className="mt-2 block break-all rounded bg-gray-100 p-2 text-left">{rawUa}</code>
        </details>
      )}
      {canShare && (
        <button
          type="button"
          onClick={handleShare}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          แชร์
        </button>
      )}
      {canShare === false && (
        <p className="text-sm text-gray-500">
          {browserName} ไม่รองรับ Web Share API — ปุ่มแชร์ถูกซ่อน
        </p>
      )}
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </main>
  )
}
