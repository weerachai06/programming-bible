# Unit Test Setup Summary

## 🎯 **ภาพรวม**
ตั้งค่า unit testing สำหรับ Next.js project ด้วย **Vitest** และ **React Testing Library** พร้อมเขียน test สำหรับ Counter component ที่เป็น functional component แบบง่ายๆ

## 📦 **Dependencies ที่ติดตั้ง**
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
```

## ⚙️ **การตั้งค่า**

### 1. Vitest Configuration (`vitest.config.ts`)
- ใช้ jsdom environment สำหรับ DOM testing
- ตั้งค่า path alias `@` สำหรับ import
- เปิด globals เพื่อใช้ describe, it, expect โดยไม่ต้อง import

### 2. Test Setup (`test/setup.ts`)
- Import Jest DOM matchers
- ตั้งค่า cleanup หลังแต่ละ test
- Extend Vitest expect ด้วย Jest DOM matchers

### 3. Scripts ที่เพิ่มใน `package.json`
```json
{
  "test": "vitest",                    // รัน test แบบ watch mode
  "test:run": "vitest run",           // รัน test ครั้งเดียว
  "test:watch": "vitest --watch",     // รัน test แบบ watch mode
  "test:ui": "vitest --ui",           // รัน test พร้อม UI
  "test:coverage": "vitest run --coverage"  // รัน test พร้อม coverage
}
```

## 🧪 **Counter Component ที่ทดสอบ**

### Features:
- ✅ **State Management**: ใช้ useState สำหรับจัดการ counter value
- ✅ **Props**: รับ `initialValue` และ `step` เป็น optional props
- ✅ **Actions**: increment, decrement, reset functions
- ✅ **UI**: แสดงค่า counter และปุ่มควบคุม
- ✅ **Accessibility**: ใช้ data-testid และ proper button types

### Props Interface:
```typescript
interface CounterProps {
  initialValue?: number  // default: 0
  step?: number         // default: 1
}
```

## 🔬 **Test Cases (9 tests)**

### 1. **Rendering Tests**
- ✅ `renders with default initial value` - ทดสอบการ render ค่า default
- ✅ `renders with custom initial value` - ทดสอบการ render ค่าที่กำหนด

### 2. **User Interaction Tests**
- ✅ `increments counter when + button is clicked` - ทดสอบการเพิ่มค่า
- ✅ `decrements counter when - button is clicked` - ทดสอบการลดค่า
- ✅ `resets counter to initial value when reset button is clicked` - ทดสอบการ reset

### 3. **Custom Props Tests**
- ✅ `works with custom step value` - ทดสอบการใช้ step ที่กำหนด

### 4. **Accessibility Tests**
- ✅ `has correct button labels and types` - ทดสอบ labels และ button types

### 5. **Edge Cases Tests**
- ✅ `handles multiple clicks correctly` - ทดสอบการคลิกหลายครั้ง
- ✅ `can handle negative values` - ทดสอบค่าติดลบ

## 📊 **ผลการทดสอบ**
```
✓ src/components/Counter.test.tsx (9 tests) 144ms
  ✓ Counter Component > renders with default initial value 14ms
  ✓ Counter Component > renders with custom initial value 2ms
  ✓ Counter Component > increments counter when + button is clicked 33ms
  ✓ Counter Component > decrements counter when - button is clicked 10ms
  ✓ Counter Component > resets counter to initial value when reset button is clicked 16ms
  ✅ Counter Component > works with custom step value 22ms
  ✓ Counter Component > has correct button labels and types 2ms
  ✓ Counter Component > handles multiple clicks correctly 22ms
  ✓ Counter Component > can handle negative values 22ms

Test Files  1 passed (1)
Tests  9 passed (9)
```

## 🎮 **Demo Page**
สร้าง `/test-demo` page เพื่อแสดง Counter component ในรูปแบบต่างๆ:
- Default counter (initial: 0, step: 1)
- Custom initial value (initial: 100)
- Custom step (step: 10)
- Custom both (initial: 50, step: 5)
- Negative start (initial: -10, step: 3)
- Big steps (step: 25)

## 🚀 **การใช้งาน**

### รันเทส:
```bash
# Watch mode (รัน test อัตโนมัติเมื่อไฟล์เปลี่ยน)
pnpm test

# รันครั้งเดียว
pnpm test:run

# รันพร้อม UI
pnpm test:ui

# รันพร้อม coverage
pnpm test:coverage
```

### ดู Demo:
```bash
pnpm dev
# ไปที่ http://localhost:3000/test-demo
```

## ✨ **ข้อดีของการตั้งค่านี้**

1. **🔥 Fast**: Vitest เร็วกว่า Jest อย่างมาก
2. **🎯 Simple**: การตั้งค่าง่าย ไม่ซับซ้อน
3. **🔧 Modern**: ใช้ ESM และ TypeScript native
4. **🎨 UI**: มี UI สำหรับดู test results
5. **📱 Watch Mode**: Auto-run เมื่อไฟล์เปลี่ยน
6. **🎭 Coverage**: รองรับ test coverage
7. **🤝 Compatible**: ใช้ API เดียวกับ Jest (migration ง่าย)

## 📚 **Best Practices ที่ใช้**

1. **Proper JSDoc**: เขียน documentation ครบถ้วน
2. **Data Test IDs**: ใช้ `data-testid` สำหรับ selectors
3. **User Events**: ใช้ `userEvent` แทน `fireEvent`
4. **Cleanup**: Auto cleanup หลังแต่ละ test
5. **TypeScript**: Type safety ทุกที่
6. **Accessibility**: ทดสอบ button types และ labels
7. **Edge Cases**: ทดสอบ negative values และ multiple clicks

การตั้งค่านี้พร้อมใช้งานและสามารถขยายเพิ่ม test cases อื่นๆ ได้ทันที! 🎉
