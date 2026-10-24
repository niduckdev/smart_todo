# Smart Todo

เว็บแอปจัดการงานประจำวันภาษาไทย สร้างด้วย React และ Vite รองรับหน้าจอมือถือและบันทึกงานไว้ในเบราว์เซอร์ด้วย `localStorage`

## เริ่มต้นใช้งาน

ต้องติดตั้ง Node.js 18 ขึ้นไป จากนั้นเปิด Terminal ในโฟลเดอร์โปรเจกต์แล้วรัน:

```bash
npm install
npm run dev
```

เปิด URL ที่ Vite แสดงใน Terminal เพื่อใช้งานเว็บ

## คำสั่งที่ใช้ได้

- `npm run dev` — เปิดเซิร์ฟเวอร์สำหรับพัฒนา
- `npm run build` — สร้างไฟล์สำหรับ deploy ไว้ใน `dist`
- `npm run preview` — ทดลองเปิดไฟล์ build ในเครื่อง

## ฟีเจอร์

- เพิ่มงาน กำหนดหมวดหมู่ วันครบกำหนด และระดับความสำคัญ
- ค้นหา กรองงานตามสถานะ และเลือกดูตามหมวดหมู่
- ทำเครื่องหมายว่างานเสร็จแล้วหรือลบงาน
- แก้ไขชื่องาน หมวดหมู่ ความสำคัญ และวันครบกำหนดได้
- สรุปจำนวนงานและเปอร์เซ็นต์ความคืบหน้าประจำวัน
- เก็บข้อมูลงานในเบราว์เซอร์เครื่องที่ใช้งาน (ไม่มี backend)

## React component

`src/components/TodoItem.jsx` แสดงรายการงานหนึ่งรายการ โดยรับ props `title`, `piority`, `dueDate` และ `completed` พร้อม callback `onToggle` และ `onDelete` สำหรับปุ่มทำเครื่องหมายเสร็จ/ลบ และรับ `onEdit` เพื่อแสดงปุ่มแก้ไขได้ด้วย

## อัปโหลดขึ้น GitHub

สร้าง repository แล้วเปิด Terminal ในโฟลเดอร์นี้ จากนั้นใช้:

```bash
git init
git add .
git commit -m "Build Smart Todo app"
git branch -M main
git remote add origin https://github.com/<username>/<repository>.git
git push -u origin main
```

เปลี่ยน `<username>` และ `<repository>` ให้ตรงกับ repository ของคุณ
