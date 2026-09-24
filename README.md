# QLDA_NHOM10_GODDY - PHẦN MỀM QUẢN LÝ HÓA ĐƠN / CÔNG NỢ TÍCH HỢP DASHBOARD DỮ LIỆU CHO TUYỂN DỤNG

> Phần mềm giúp các công ty dịch vụ tuyển dụng nhân sự (Headhunt) tự động hóa quy trình chốt hợp đồng tuyển dụng (Deal) ➔ Xuất hóa đơn VAT ➔ Theo dõi và thu hồi công nợ B2B ➔ Phân tích tài chính qua biểu đồ Dashboard.

---

## THÀNH VIÊN DỰ ÁN (NHÓM 10)
- **Huỳnh Nguyễn Vĩnh Phúc** (`phuchh9999-sketch`) 
- **Phạm Văn Sơn** (`phamson333zzz-sudo`) 
- **Nguyễn Hoàng Phước** (`phuoc801901-glitch`)
- **Nguyễn Hữu Phúc** (`nguyenhuuphuc22012005-rgb`)
- **Nguyễn Xuân Đoàn** (`xuandoan755-del`) 

---

## CÁC TÍNH NĂNG CỐT LÕI (8 MODULES)
1. **Module 1: CSDL & Kiến Trúc Dự Án**: CSDL SQLite zero-config, Sequelize ORM với 8 bảng quan hệ chặt chẽ.
2. **Module 2: Xác Thực & Phân Quyền (RBAC)**: Bảo mật JWT, mã hóa bcrypt, phân quyền Admin, Kế toán, Recruiter.
3. **Module 3: Khách Hàng Doanh Nghiệp B2B**: Quản lý hồ sơ công ty, mã số thuế, điều khoản Net Days (15/30/45/60 ngày).
4. **Module 4: Tuyển Dụng & Deal Placement**: Ghi nhận ứng viên onboard, tự động tính hoa hồng (% lương năm), theo dõi bảo hành 60 ngày.
5. **Module 5: Hóa Đơn & Invoicing**: Phát hành hóa đơn VAT 8%, mã số tự động, hạn thanh toán Net Days, in/xuất PDF chuẩn hóa đơn.
6. **Module 6: Công Nợ & Báo Cáo Tuổi Nợ (Aging Report)**: Phân loại tuổi nợ chuẩn kế toán (1-30, 31-60, >60 ngày nợ khó đòi), ghi nhận thu tiền trả nợ trừ dần.
7. **Module 7: Dashboard Thống Kê**: Thẻ KPI doanh thu, nợ AR, nợ quá hạn, tỷ lệ thu hồi, biểu đồ đường doanh thu 12 tháng, biểu đồ tròn cơ cấu ngành.
8. **Module 8: Audit Log & Kiểm Thử Tự Động**: Lưu vết toàn bộ hành động người dùng, bộ test tự động kiểm thử 100% API.

---

## HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### 1. Cài đặt thư viện:
```bash
npm install
```

### 2. Chạy ứng dụng:
```bash
npm start
```
Truy cập giao diện Web tại: **`http://localhost:3000`**

### 3. Chạy bộ kiểm thử tự động (Unit & Integration Tests):
```bash
npm test
```

---

## QUẢN LÝ TIẾN ĐỘ & TASK: huynhnguyenvinhphuc

