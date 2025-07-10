# GitHub Actions Unit Test Coverage Setup

## 🎯 ภาพรวม (Overview)

โปรเจกต์นี้ได้รับการตั้งค่า GitHub Actions workflow ที่ครอบคลุมสำหรับการรัน unit tests และสร้างรายงาน coverage อย่างอัตโนมัติ **โดยไม่ต้องใช้ codecov หรือ marketplace อื่น ๆ** เขียนโค้ดเองฉบับคนงบน้อย

## ✨ ฟีเจอร์หลัก (Key Features)

### 🔄 การทดสอบอัตโนมัติ (Automated Testing)
- **เริ่มทำงานเมื่อ**: Push ไปที่ `main`/`develop` และทุก Pull Request
- **Node.js**: ใช้ Node.js 20 พร้อม pnpm package manager
- **Caching**: ใช้ pnpm store caching เพื่อเร่งความเร็ว
- **Linting**: รัน Biome linting ก่อนทดสอบ
- **Testing**: ใช้ Vitest สำหรับ unit tests

### 📊 รายงาน Coverage
- **Provider**: ใช้ Vitest กับ V8 coverage provider
- **รูปแบบ**: สร้างรายงาน HTML, JSON, LCOV, และ JSON-summary
- **เกณฑ์**: กำหนด 80% coverage สำหรับ:
  - Lines (บรรทัดโค้ด)
  - Functions (ฟังก์ชัน)
  - Branches (กิ่งการทำงาน)
  - Statements (คำสั่ง)

### 💬 การคอมเมนต์ PR
- **อัตโนมัติ**: โพสต์สรุป coverage ลงใน PR comment
- **อัพเดทอัจฉริยะ**: อัพเดท comment เดิมแทนการสร้างใหม่
- **รูปแบบสวย**: มีตาราง emoji และรายละเอียดครบถ้วน
- **ไฟล์ดาวน์โหลด**: ให้ลิงก์ดาวน์โหลดรายงาน HTML

## 🔧 การตั้งค่า (Setup)

### ไฟล์ที่สำคัญ (Important Files)

#### 1. `.github/workflows/test-coverage.yml`
GitHub Actions workflow หลักที่ควบคุมกระบวนการทั้งหมด:

```yaml
name: Unit Tests & Coverage
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

#### 2. `vitest.config.ts`
การกำหนดค่า Vitest พร้อม coverage:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
  reportsDirectory: './coverage',
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

#### 3. `scripts/coverage-report.mjs`
สคริปต์สำหรับแสดงรายงาน coverage แบบสวยงามใน terminal

### Scripts ใน package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "coverage:report": "node scripts/coverage-report.mjs",
    "ci:test": "pnpm lint && pnpm test:coverage",
    "ci:coverage-report": "pnpm test:coverage && node scripts/coverage-report.mjs"
  }
}
```

## 🚀 วิธีใช้งาน (Usage)

### การพัฒนาในเครื่อง (Local Development)

```bash
# รันทดสอบพร้อม coverage
pnpm test:coverage

# รันทดสอบแบบ watch mode
pnpm test:watch

# ดูรายงาน coverage แบบสวยงาม
pnpm coverage:report

# ดูรายงาน HTML
open coverage/index.html
```

### GitHub Actions
Workflow จะทำงานอัตโนมัติเมื่อ:
- Push ไปที่ `main` หรือ `develop`
- สร้าง Pull Request มายัง `main` หรือ `develop`

## 📋 ตัวอย่างรายงาน Coverage

### 📊 ตารางสรุป Coverage
| Metric | Coverage | Threshold | Status |
|--------|----------|-----------|--------|
| 🌿 **Branches** | 66.66% | 80% | ❌ FAIL |
| 🔧 **Functions** | 65.21% | 80% | ❌ FAIL |
| 📝 **Lines** | 1.45% | 80% | ❌ FAIL |
| 📋 **Statements** | 1.45% | 80% | ❌ FAIL |

### 📈 รายละเอียดครบถ้วน
- **Total Lines:** 42/2887 (1.45%)
- **Total Functions:** 30/46 (65.21%)
- **Total Branches:** 32/48 (66.66%)
- **Total Statements:** 42/2887 (1.45%)

### 🎯 สถานะ
❌ **Some coverage thresholds not met**

## 🌟 จุดเด่น (Highlights)

### ✅ ไม่พึ่งพา External Services
- ใช้เฉพาะ GitHub's built-in features
- ไม่ต้อง codecov, coveralls หรือ services อื่น ๆ
- ควบคุมทุกอย่างเองภายใน repository

### 🚀 เร็วและมีประสิทธิภาพ
- ใช้ caching ลดเวลา build
- ทำงานแบบ parallel เมื่อเป็นไปได้
- อัพเดท comment อย่างอัจฉริยะ

### 📊 รายงานครบถ้วน
- หลายรูปแบบรายงาน (HTML, JSON, LCOV)
- แสดงรายละเอียดครบถ้วน
- เก็บประวัติผ่าน artifacts

### 🔒 ความปลอดภัย
- ใช้ official GitHub actions เท่านั้น
- ขอ permissions น้อยที่สุด
- ไม่ต้อง secrets หรือ tokens พิเศษ

## 🛠️ การแก้ไขปัญหา (Troubleshooting)

### Coverage ไม่ถูกสร้าง
- ตรวจสอบว่าติดตั้ง `@vitest/coverage-v8` แล้ว
- ตรวจสอบ `vitest.config.ts` ว่าตั้งค่าถูกต้อง
- ตรวจสอบว่า test files ทำงานได้

### Workflow ล้มเหลว
- ตรวจสอบความเข้ากันได้ของ Node.js version
- ตรวจสอบว่า dependencies ทั้งหมดอยู่ใน `package.json`
- ตรวจสอบว่า pnpm lockfile เป็นเวอร์ชันล่าสุด

### PR Comments ไม่ทำงาน
- ตรวจสอบว่า workflow มี `pull-requests: write` permission
- ตรวจสอบ comment template ว่าถูกต้อง
- ตรวจสอบว่า GitHub token มี permissions เพียงพอ

## 🎨 การปรับแต่ง (Customization)

### เปลี่ยนเกณฑ์ Coverage
แก้ไข `vitest.config.ts` และ `.github/workflows/test-coverage.yml` เพื่อปรับเกณฑ์ 80%

### เพิ่มการตรวจสอบเพิ่มเติม
สามารถขยาย workflow ให้รวม:
- Type checking
- Build verification
- Integration tests
- Performance benchmarks

### ปรับรูปแบบรายงาน
แก้ไข coverage parsing script ใน workflow เพื่อเปลี่ยนรูปแบบ markdown

## 🎯 Best Practices

1. **เขียนทดสอบไปพร้อม ๆ กัน**: รักษา coverage สูงตั้งแต่แรก
2. **ตรวจสอบรายงาน**: ใช้ HTML report หาจุดที่ยังไม่ครอบคลุม
3. **คุณภาพมากกว่าปริมาณ**: เน้นทดสอบที่มีความหมาย
4. **อัพเดทสม่ำเสมอ**: รักษา dependencies และ actions ให้เป็นเวอร์ชันล่าสุด
5. **ตรวจสอบประสิทธิภาพ**: ติดตามเวลาที่ใช้ใน workflow

## 📊 ผลการดำเนินงาน (Results)

การตั้งค่านี้ให้ผลลัพธ์:
- ✅ **Unit Tests**: 9/9 tests passed
- ✅ **Coverage Reporting**: ทำงานสมบูรณ์
- ✅ **PR Comments**: แสดงผลอัตโนมัติ
- ✅ **Artifacts**: เก็บรายงานสำหรับดาวน์โหลด
- ✅ **Threshold Enforcement**: ควบคุมคุณภาพโค้ด

## 💡 ข้อควรพิจารณาต่อไป

1. **เพิ่มการทดสอบ**: ปัจจุบัน coverage ยังต่ำ ควรเพิ่ม unit tests
2. **Integration Tests**: พิจารณาเพิ่ม integration testing
3. **Performance Monitoring**: ติดตามประสิทธิภาพของ workflow
4. **Documentation**: เพิ่มเอกสารการใช้งานสำหรับทีม

## 🔗 ไฟล์ที่เกี่ยวข้อง (Related Files)

- `GITHUB_ACTIONS_SETUP.md` - เอกสารการตั้งค่าทั้งหมด
- `UNIT_TEST_SETUP.md` - เอกสารการตั้งค่าทดสอบ
- `BIOME_RULES_DISABLED.md` - เอกสารการตั้งค่า Biome
- `MIGRATION_GUIDE.md` - คู่มือการ migrate จาก ESLint/Prettier

---

🎉 **สำเร็จแล้ว!** ตอนนี้โปรเจกต์มี GitHub Actions workflow ที่ครบถ้วนสำหรับการรัน unit tests และ coverage reporting อย่างอัตโนมัติ โดยไม่ต้องพึ่งพา external services ใด ๆ!
