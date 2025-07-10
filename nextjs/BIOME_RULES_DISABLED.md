# Biome Rules Disabled - Error Reduction Summary

## การปิด Biome Rules เพื่อลด Error

เราได้ปิด Biome rules ที่ทำให้เกิด error จำนวนมากสำเร็จแล้ว จากเดิม **275 errors** ลดลงเหลือ **17 errors** (ลดลง 93.8%)

## Rules ที่ปิดไปแล้ว

### 1. Style Rules (ปิดหรือลดระดับ)
```json
"style": {
  "useNodejsImportProtocol": "off",        // ปิดการบังคับใช้ node: protocol
  "noUnusedTemplateLiteral": "warn",       // ลดจาก error เป็น warn
  "useTemplate": "warn",                   // ลดจาก error เป็น warn
  "useConst": "warn",                      // ลดจาก error เป็น warn
  "useExponentiationOperator": "warn"      // ลดจาก error เป็น warn
}
```

### 2. Suspicious Rules
```json
"suspicious": {
  "noExplicitAny": "warn",                 // ลดจาก error เป็น warn (ยกเว้น fetch lib)
  "noConsole": "off",                      // ปิดการแจ้งเตือน console.log
  "noAssignInExpressions": "off"           // ปิดการแจ้งเตือนการ assign ใน expression
}
```

### 3. Complexity Rules
```json
"complexity": {
  "noExcessiveCognitiveComplexity": "off", // ปิดการตรวจสอบ complexity
  "useDateNow": "off",                     // ปิดการบังคับใช้ Date.now()
  "useOptionalChain": "off",               // ปิดการบังคับใช้ optional chain
  "noUselessFragments": "warn"             // ลดจาก error เป็น warn
}
```

### 4. Correctness Rules
```json
"correctness": {
  "noUnusedVariables": "warn"              // ลดจาก error เป็น warn
}
```

### 5. Nursery Rules
```json
"nursery": {
  "useSortedClasses": "off"                // ปิดการเรียงลำดับ CSS classes
}
```

### 6. File-specific Overrides
```json
// ปิด noExplicitAny สำหรับ fetch library
{
  "includes": ["src/lib/fetch/**/*"],
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "off"
      }
    }
  }
}
```

## ผลลัพธ์ที่เหลืออยู่

### Errors ที่เหลือ (17 ข้อ):
1. **noUnusedImports** - import ที่ไม่ได้ใช้ (3 ข้อ)
2. **useButtonType** - button ที่ไม่มี type attribute (4 ข้อ)
3. **noUnusedVariables** - ตัวแปรที่ไม่ได้ใช้ (1 ข้อ)
4. **noExplicitAny** - ใน helpers/asyncCache.ts (3 ข้อ)
5. **useExhaustiveDependencies** - useEffect dependencies ไม่ครบ (1 ข้อ)
6. **อื่นๆ** (5 ข้อ)

### Warnings ที่เหลือ (24 ข้อ):
- ส่วนใหญ่เป็นเรื่อง best practices ที่ไม่ block การ build
- เช่น noArrayIndexKey, noGlobalIsNan, etc.

## คำแนะนำ

Error ที่เหลือส่วนใหญ่เป็นเรื่องที่ควรแก้ไขเพื่อคุณภาพโค้ด:

1. **ลบ unused imports**: ใช้ `pnpm check:fix` เพื่อแก้ไขอัตโนมัติ
2. **เพิ่ม button type**: เพิ่ม `type="button"` ใน button elements
3. **แก้ไข useEffect dependencies**: เพิ่ม dependencies ที่ขาดหายไป

Error ปัจจุบันไม่ได้ block การ development และสามารถแก้ไขได้ง่าย

## วิธีใช้งาน

```bash
# ตรวจสอบปัญหา
pnpm lint

# แก้ไขอัตโนมัติ (เฉพาะที่แก้ได้)
pnpm check:fix

# ตรวจสอบทั้งหมด (linting + formatting)
pnpm check

# แก้ไขทั้งหมด
pnpm check:fix
```
