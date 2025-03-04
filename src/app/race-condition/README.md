# queueMicrotask Usage Guide

## Overview

`queueMicrotask` ใช้ในกรณีที่ต้องการจัดการ task ให้ทำงานหลังจาก current synchronous code execution แต่ก่อน render cycle ถัดไป

## Use Cases

### 1. State Batching

```tsx
const handleSetData = useCallback((data: GlobalModalDataType) => {
  // Set data state first
  setDataState(data);

  // Queue modal opening after data is set
  queueMicrotask(() => {
    setIsOpen(true);
  });
}, []);
```

### 2. Cleanup Before State Updates

```tsx
const handleCleanup = useCallback(() => {
  // Synchronous cleanup
  cleanup();

  // Queue state update after cleanup
  queueMicrotask(() => {
    setIsClean(true);
  });
}, [cleanup]);
```

## เปรียบเทียบกับวิธีอื่น

```typescript
// 1. setTimeout (macrotask) - ช้าที่สุด
setTimeout(() => {
  setIsOpen(true);
}, 0);

// 2. Promise.resolve() (microtask) - เร็วกว่า setTimeout
Promise.resolve().then(() => {
  setIsOpen(true);
});

// 3. queueMicrotask (microtask) - clear และเร็วที่สุด
queueMicrotask(() => {
  setIsOpen(true);
});
```

## ข้อดีของ queueMicrotask

- 🔄 ทำงานเร็วกว่า setTimeout/setImmediate
- 🎯 รับประกันการทำงานก่อน render cycle ถัดไป
- ⚡️ เหมาะกับ state updates ที่ต้องการ sequence
- 🔒 ป้องกัน race conditions
- 📦 ทำงานใน microtask queue

## คำแนะนำ

- ใช้เมื่อต้องการ sequence state updates
- ระวังการใช้ใน loop หรือ recursive functions
- ไม่ควรใช้กับ heavy computations
- เหมาะกับ cleanup และ state synchronization

## References

- [MDN Web Docs: queueMicrotask()](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)
- [JavaScript Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [React Batching](https://react.dev/learn/queueing-a-series-of-state-updates)
