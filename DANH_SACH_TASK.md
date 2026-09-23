# DANH SÁCH 160 TASK DỰ ÁN QLDA - NHÓM 10
## Đề Tài: Phần Mềm Quản Lý Hóa Đơn / Công Nợ Tích Hợp Dashboard Dữ Liệu Cho Tuyển Dụng (GODDY Recruit)

---

### 📋 Hướng Dẫn Thực Hiện & Quy Ước Commit
Mỗi khi thành viên làm xong một task, tiến hành commit theo đúng cấu trúc:
- Bạn **Huỳnh Nguyễn Vĩnh Phúc**: `git commit -m "TênTask_huynhnguyenvinhphuc"`
- Bạn **Phạm Sơn**: `git commit -m "TênTask_phamson"`

Kiểm tra số lượng task đã hoàn thành bất kỳ lúc nào:
```powershell
(git log --grep="_huynhnguyenvinhphuc" --oneline | Measure-Object).Count
```

---

## 📁 PHÂN BỔ 160 TASK THEO 8 MODULE

### MODULE 1: Khởi Tạo CSDL & Cấu Trúc Dự Án (20 Tasks)
- [x] **Task 1: `KhoiTaoCauTrucThuMucDuAn_huynhnguyenvinhphuc`** – Thiết lập cấu trúc thư mục MVC chuẩn cho Node.js Express.
- [x] **Task 2: `KetNoiCoSoDuLieuSQLite_huynhnguyenvinhphuc`** – Cấu hình thư viện Sequelize kết nối file CSDL SQLite portable.
- [x] **Task 3: `ThietKeBangNguoiDungUser`** – Tạo model User với các trường username, email, password, role, isActive.
- [x] **Task 4: `ThietKeBangKhachHangClient`** – Tạo model Client gồm tên doanh nghiệp, mã số thuế, Net days, người liên hệ.
- [x] **Task 5: `ThietKeBangViTriTuyenDungJob`** – Tạo model Job gồm phòng ban, dải lương, % phí dịch vụ tuyển dụng.
- [x] **Task 6: `ThietKeBangUngVienCandidate`** – Tạo model Candidate lưu thông tin họ tên, email, sđt, vị trí ứng tuyển.
- [x] **Task 7: `ThietKeBangDonDealPlacement`** – Tạo model Placement ghi nhận deal tuyển dụng, lương, phí hoa hồng, ngày onboard.
- [x] **Task 8: `ThietKeBangHoaDonInvoice`** – Tạo model Invoice theo dõi mã hóa đơn, thuế VAT 8%, ngày đến hạn, tổng tiền nợ.
- [x] **Task 9: `ThietKeBangThanhToanPayment`** – Tạo model Payment lưu từng đợt thu hồi tiền công nợ.
- [x] **Task 10: `ThietKeBangNhatKyAuditLog`** – Tạo model AuditLog lưu vết toàn bộ hành động người dùng.
- [x] **Task 11: `ThietLapQuanHeClientVaJob`** – Cấu hình Client 1 - N Job trong Sequelize.
- [x] **Task 12: `ThietLapQuanHeJobVaPlacement`** – Cấu hình Job 1 - N Placement.
- [x] **Task 13: `ThietLapQuanHeClientVaPlacement`** – Cấu hình Client 1 - N Placement.
- [x] **Task 14: `ThietLapQuanHeCandidateVaPlacement`** – Cấu hình Candidate 1 - N Placement.
- [x] **Task 15: `ThietLapQuanHePlacementVaInvoice`** – Cấu hình Placement 1 - 1 Invoice.
- [x] **Task 16: `ThietLapQuanHeInvoiceVaPayment`** – Cấu hình Invoice 1 - N Payment.
- [x] **Task 17: `VietScriptDongBoCSDLTuDong`** – Viết script `sequelize.sync({ force: true })` tự động tạo bảng.
- [x] **Task 18: `VietScriptNapDuLieuMauEnterprise`** – Nạp dữ liệu doanh nghiệp mẫu FPT, VNG, Shopee, Viettel.
- [x] **Task 19: `CauHinhCorsVaExpressParser`** – Thiết lập middleware CORS và bộ phân giải JSON payload.
- [x] **Task 20: `CauHinhPhucVuStaticAssetsPublic`** – Cấu hình thư mục public phục vụ trang Web Dashboard.

---

### MODULE 2: Xác Thực & Phân Quyền Người Dùng (RBAC) (20 Tasks)
- [x] **Task 21: `VietHamMaHoaMatKhauBcrypt`** – Băm mật khẩu người dùng bằng bcryptjs độ muối 10 rounds.
- [x] **Task 22: `VietHamSoKhopMatKhauLogin`** – Kiểm tra mật khẩu mã hóa khi đăng nhập.
- [x] **Task 23: `API_DangNhapHeThong`** – Xây dựng endpoint `POST /api/auth/login`.
- [x] **Task 24: `TaoTokenXacThucJWT`** – Ký tạo JWT token chứa thông tin id, role, fullName thời hạn 7 ngày.
- [x] **Task 25: `MiddlewareXacThucBearerToken`** – Middleware `verifyToken` kiểm tra header Authorization.
- [x] **Task 26: `MiddlewarePhanQuyenTheoVaiTro`** – Middleware `requireRole` chặn truy cập trái quyền.
- [x] **Task 27: `API_DangKyNhanVienMoi`** – Endpoint `POST /api/auth/register` tạo tài khoản có mã hóa mật khẩu.
- [x] **Task 28: `API_LayDanhSachNhanVien`** – Endpoint `GET /api/auth/users` xem danh sách tài khoản (ẩn mật khẩu).
- [x] **Task 29: `KiemTraTrungLapUsernameKhiDangKy`** – Bắt lỗi 400 nếu tên tài khoản đã tồn tại.
- [x] **Task 30: `KiemTraTaiKhoanBiKhoaKhiDangNhap`** – Kiểm tra trường `isActive` từ chối người dùng bị khóa.
- [ ] **Task 31: `API_DoiMatKhauNguoiDung`** – Viết endpoint đổi mật khẩu với mật khẩu cũ và mới.
- [ ] **Task 32: `ValidateDinhDangEmailNhanVien`** – Regex kiểm tra định dạng email công ty hợp lệ.
- [ ] **Task 33: `ValidateDoDaiMatKhauToiThieu`** – Bắt buộc độ dài mật khẩu tối thiểu 6 ký tự.
- [ ] **Task 34: `API_KhoaMoKhoaTaiKhoan`** – Endpoint kích hoạt hoặc khóa tài khoản nhân viên.
- [ ] **Task 35: `API_LayThongTinCaNhanMe`** – Endpoint lấy thông tin profile của phiên đăng nhập hiện tại.
- [ ] **Task 36: `LuuTokenVaoLocalStorageClient`** – Client JS lưu JWT vào localStorage và tự động đính kèm request.
- [ ] **Task 37: `ChucNangDangXuatHeThong`** – Xóa phiên đăng nhập khỏi trình duyệt.
- [ ] **Task 38: `PhanQuyenGiaoDienTheoRole`** – Ẩn/hiện các nút chức năng trên giao diện theo Admin / Kế toán.
- [ ] **Task 39: `HienThiThongTinUserTrenHeader`** – Hiển thị tên và vai trò người dùng góc trên bên phải.
- [ ] **Task 40: `TuDongRefreshPhienLamViec`** – Tự động nhắc người dùng đăng nhập lại khi token hết hạn.

---

### MODULE 3: Quản Lý Khách Hàng Doanh Nghiệp (B2B) (20 Tasks)
- [x] **Task 41: `API_LayDanhSachKhachHang`** – Xây dựng endpoint `GET /api/clients` kèm thông tin Job và Hóa đơn.
- [x] **Task 42: `API_LayChiTietKhachHangTheoId`** – Endpoint `GET /api/clients/:id` lấy hồ sơ công nợ đối tác.
- [x] **Task 43: `API_TaoMoiKhachHangDoanhNghiep`** – Endpoint `POST /api/clients` thêm mới đối tác B2B.
- [x] **Task 44: `API_CapNhatThongTinKhachHang`** – Endpoint `PUT /api/clients/:id` cập nhật thông tin công ty.
- [x] **Task 45: `API_XoaKhachHangDoanhNghiep`** – Endpoint `DELETE /api/clients/:id` có kiểm tra an toàn công nợ.
- [x] **Task 46: `ValidateDinhDangMaSoThue`** – Kiểm tra mã số thuế hợp lệ 10 hoặc 13 chữ số.
- [x] **Task 47: `KiemTraTrungLapMaSoThueClient`** – Chặn tạo mới nếu mã số thuế đã tồn tại trong CSDL.
- [x] **Task 48: `ChanXoaKhachHangConNoChuaTra`** – Chặn xóa nếu đối tác vẫn còn hóa đơn nợ chưa tất toán.
- [x] **Task 49: `ThietLapChinhSachNetDaysThanhToan`** – Quản lý hạn mức ngày thanh toán (Net 15, Net 30, Net 45, Net 60).
- [x] **Task 50: `TimKiemKhachHangTheoTenVaMST`** – Lọc và tìm kiếm nhanh khách hàng trực tiếp trên UI và API.
- [x] **Task 51: `ThietKeBangDanhSachKhachHangUI`** – Dựng bảng hiển thị đối tác trên Web Dashboard.
- [x] **Task 52: `ThietKeModalThemKhachHangMoiUI`** – Popup thêm khách hàng với đầy đủ trường nhập liệu.
- [x] **Task 53: `XuLySubmitFormThemKhachHang`** – Bắt sự kiện gửi dữ liệu modal thêm khách hàng và reload bảng.
- [x] **Task 54: `XuatDanhSachKhachHangRaCSV`** – Chức năng xuất danh sách doanh nghiệp ra file CSV.
- [ ] **Task 55: `ThietKeModalChinhSuaKhachHangUI`** – Popup cập nhật thông tin đối tác.
- [ ] **Task 56: `PhanTrangDanhSachKhachHang`** – Phân trang bảng khách hàng nếu dữ liệu lớn hơn 10 dòng.
- [ ] **Task 57: `BoLocKhachHangTheoTrangThai`** – Lọc khách hàng Đang hoạt động hoặc Tạm dừng hợp tác.
- [ ] **Task 58: `HienThiLichSuGiaoDichCuaKhachHang`** – Xem tab thống kê các deal và hóa đơn của riêng khách hàng đó.
- [ ] **Task 59: `QuanLyHanMucCongNoCreditLimit`** – Thêm trường hạn mức công nợ tối đa cho mỗi doanh nghiệp.
- [ ] **Task 60: `CanhBaoVuotHanMucCongNo`** – Cảnh báo nếu số nợ của khách hàng vượt hạn mức cho phép.

---

### MODULE 4: Nghiệp Vụ Tuyển Dụng & Deal Placement (20 Tasks)
- [x] **Task 61: `API_LayDanhSachViTriTuyenDung`** – Endpoint `GET /api/recruitment/jobs` kèm tên doanh nghiệp.
- [x] **Task 62: `API_TaoViTriTuyenDungMoi`** – Endpoint `POST /api/recruitment/jobs` gắn với Client.
- [x] **Task 63: `API_CapNhatViTriTuyenDung`** – Endpoint `PUT /api/recruitment/jobs/:id`.
- [x] **Task 64: `API_LayDanhSachUngVien`** – Endpoint `GET /api/recruitment/candidates`.
- [x] **Task 65: `API_ThemHoSoUngVien`** – Endpoint `POST /api/recruitment/candidates`.
- [x] **Task 66: `API_LayDanhSachDealPlacement`** – Endpoint `GET /api/recruitment/placements` kèm liên kết hóa đơn.
- [x] **Task 67: `API_GhiNhanDealTuyenDungMoi`** – Endpoint `POST /api/recruitment/placements` khi ứng viên onboard.
- [x] **Task 68: `CongThucTinhPhiDichVuHeadhunt`** – Tính phí dịch vụ theo chuẩn % lương năm hoặc % thỏa thuận.
- [x] **Task 69: `TuDongTinhNgayHetHanBaoHanh`** – Tự động tính `warrantyEndDate = onboardDate + warrantyDays` (60 ngày).
- [x] **Task 70: `CapNhatTrangThaiUngVienKhiChotDeal`** – Tự động đổi trạng thái Candidate sang `Placed`.
- [x] **Task 71: `ValidateMucLuongThoaThuanHopLe`** – Kiểm tra mức lương ứng viên phải là số dương hợp lệ.
- [x] **Task 72: `ThietKeBangDanhSachDealUI`** – Bảng theo dõi deal tuyển dụng, lương, phí và hạn bảo hành.
- [x] **Task 73: `ThietKeModalChotDealPlacementUI`** – Hộp thoại chọn Khách hàng, chọn Job, chọn Ứng viên.
- [x] **Task 74: `TuDongLoadDanhSachJobTheoKhachHang`** – Tự động tải Job tương ứng khi người dùng chọn Khách hàng.
- [x] **Task 75: `TuDongUocTinhPhiDichVuTrenForm`** – Tính nhanh tiền phí dịch vụ ngay khi nhập lương và tỷ lệ %.
- [x] **Task 76: `NutXuatHoaDonNhanhTuDeal`** – Nút "Xuất HĐ" ngay trên từng dòng deal chưa có hóa đơn.
- [ ] **Task 77: `ChucNangHuyDealBaoHanhThatBai`** – Xử lý khi ứng viên nghỉ việc trong thời gian bảo hành.
- [ ] **Task 78: `BoLocDealTheoKhoangThoiGian`** – Lọc deal theo tháng/quý phát sinh doanh thu.
- [ ] **Task 79: `HienThiHuyHieuTrangThaiBaoHanh`** – Badge màu tím "Trong bảo hành" và màu xanh "Hết bảo hành".
- [ ] **Task 80: `XuatDanhSachDealRaCSV`** – Xuất báo cáo hiệu suất tuyển dụng ra file CSV.

---

### MODULE 5: Quản Lý & Phát Hành Hóa Đơn Invoicing (20 Tasks)
- [x] **Task 81: `API_LayDanhSachHoaDon`** – Endpoint `GET /api/invoices` kèm thông tin khách hàng và thanh toán.
- [x] **Task 82: `API_LayChiTietHoaDonTheoId`** – Endpoint `GET /api/invoices/:id` kèm đầy đủ thông tin deal và ứng viên.
- [x] **Task 83: `API_PhatHanhHoaDonTuDealPlacement`** – Endpoint `POST /api/invoices/from-placement`.
- [x] **Task 84: `ChanPhatHanhTrungHoaDonChoCung1Deal`** – Kiểm tra deal đã có hóa đơn hay chưa trước khi tạo.
- [x] **Task 85: `HamSinhMaHoaDonTuDong`** – Tự động tạo mã hóa đơn dạng `INV-YYYY-XXXX`.
- [x] **Task 86: `HamTinhTienThueVAT8PhanTram`** – Tính tiền thuế VAT: `vatAmount = subtotal * (vatRate / 100)`.
- [x] **Task 87: `HamTinhTongTienPhaiThanhToan`** – Tính tổng tiền: `totalAmount = subtotal + vatAmount`.
- [x] **Task 88: `TuDongGanHanThanhToanTheoNetDays`** – Cộng số ngày Net của khách hàng vào ngày phát hành để ra `dueDate`.
- [x] **Task 89: `API_HuyHoaDonDichVu`** – Endpoint `PUT /api/invoices/:id/cancel` (chặn hủy nếu đã trả tiền).
- [x] **Task 90: `ThietKeBangDanhSachHoaDonUI`** – Bảng quản lý hóa đơn, tổng tiền, đã trả, còn nợ và trạng thái.
- [x] **Task 91: `HienThiHuyHieuTrangThaiHoaDon`** – Badge hiển thị Chờ trả (Xanh dương), Trả một phần (Cam), Quá hạn (Đỏ), Đã tất toán (Xanh lá).
- [x] **Task 92: `ThietKeModalXemChiTietHoaDonUI`** – Modal hiển thị mẫu Hóa đơn Giá trị Gia tăng đầy đủ tiêu chuẩn.
- [x] **Task 93: `MauInHoaDonDienTuStandard`** – Trình bày thông tin đơn vị phát hành, đối tác, số thuế, chữ ký đại diện.
- [x] **Task 94: `ChucNangInHoaDonVaXuatPDF`** – Tích hợp lệnh `window.print()` in trực tiếp trang hóa đơn ra PDF.
- [x] **Task 95: `BoLocHoaDonTheoTrangThaiUI`** – Dropdown lọc hóa đơn: Tất cả, Sent, Partial, Paid, Overdue.
- [x] **Task 96: `XuatDanhSachHoaDonRaCSV`** – Nút xuất toàn bộ danh sách hóa đơn ra file CSV.
- [ ] **Task 97: `API_PhatHanhHoaDonThuCong`** – Cho phép xuất hóa đơn tùy chỉnh không bắt buộc theo deal.
- [ ] **Task 98: `HamTinhChietKhauHoaDon`** – Hỗ trợ giảm giá/chiết khấu thanh toán sớm cho khách hàng.
- [ ] **Task 99: `TimKiemHoaDonTheoMaVaTenKhach`** – Ô tìm kiếm nhanh hóa đơn theo mã hoặc tên doanh nghiệp.
- [ ] **Task 100: `ThongBaoPhatHanhHoaDonEmailMock`** – Giả lập gửi email hóa đơn điện tử tới khách hàng.

---

### MODULE 6: Quản Lý Công Nợ & Phân Tích Tuổi Nợ (Aging Report) (20 Tasks)
- [x] **Task 101: `API_BaoCaoTongHopCongNo`** – Endpoint `GET /api/debt/overview` tổng hợp số dư nợ của toàn bộ hóa đơn.
- [x] **Task 102: `PhanTichTuoiNo0Den30Ngay`** – Phân loại và tính tổng tiền nợ quá hạn từ 1 đến 30 ngày.
- [x] **Task 103: `PhanTichTuoiNo31Den60Ngay`** – Phân loại và tính tổng tiền nợ quá hạn từ 31 đến 60 ngày.
- [x] **Task 104: `PhanTichTuoiNoTren60Ngay`** – Phân loại và gom nhóm các khoản nợ khó đòi quá hạn > 60 ngày.
- [x] **Task 105: `TinhSoNgayQuaHanTuDong`** – Tự động so khớp ngày hiện tại với `dueDate` để đếm số ngày trễ hạn.
- [x] **Task 106: `API_GhiNhanThanhToanCongNo`** – Endpoint `POST /api/debt/payment` thu hồi nợ từng đợt.
- [x] **Task 107: `ValidateSoTienTraKhongVuotQuaNo`** – Kiểm tra số tiền trả không được lớn hơn số nợ còn lại (`remainingAmount`).
- [x] **Task 108: `ValidateSoTienTraPhaiDuong`** – Bắt buộc số tiền thanh toán phải lớn hơn 0.
- [x] **Task 109: `TuDongTruDanDuNoHoaDon`** – Cập nhật `paidAmount += pay` và `remainingAmount -= pay`.
- [x] **Task 110: `TuDongDoiTrangThaiPaidHoacPartial`** – Đổi trạng thái thành `Paid` nếu nợ về 0, hoặc `Partial` nếu còn nợ.
- [x] **Task 111: `LuuThongTinGiaoDichPayment`** – Lưu phương thức (Chuyển khoản, Tiền mặt), mã ủy nhiệm chi, ghi chú.
- [x] **Task 112: `API_GuiThongBaoNhacNo`** – Endpoint `POST /api/debt/remind` gửi lời nhắc hạn thanh toán cho khách hàng.
- [x] **Task 113: `ThietKe3CardTuoiNoAgingUI`** – 3 thẻ chỉ số nổi bật cho 3 nhóm tuổi nợ (1-30, 31-60, >60).
- [x] **Task 114: `ThietKeBangChiTietCongNoUI`** – Bảng chi tiết từng hóa đơn, số ngày quá hạn và phân loại tuổi nợ.
- [x] **Task 115: `ThietKeModalThuTienTraNoUI`** – Hộp thoại thu tiền nợ với số tiền còn lại hiển thị rõ ràng.
- [x] **Task 116: `XacNhanThuTienVaCapNhatGiaoDien`** – Gửi dữ liệu thanh toán và tự động cập nhật ngay trên giao diện.
- [x] **Task 117: `NutNhacNoTuDongTrenTungDong`** – Nút "Nhắc nợ" gửi thông báo tức thì đến đại diện doanh nghiệp.
- [x] **Task 118: `XuatBaoCaoTuoiNoRaCSV`** – Xuất báo cáo phân tích tuổi nợ Aging Report ra file CSV.
- [ ] **Task 119: `BoLocCongNoTheoKhachHang`** – Xem riêng công nợ của một doanh nghiệp được chọn.
- [ ] **Task 120: `LichSuCacLanTraTienCuaHoaDon`** – Hiển thị chi tiết từng đợt trả tiền của một hóa đơn.

---

### MODULE 7: Dashboard Thống Kê & Báo Cáo Trực Quan (20 Tasks)
- [x] **Task 121: `API_LaySoLieuTongHopDashboard`** – Endpoint `GET /api/dashboard/stats` lấy toàn bộ chỉ số KPI.
- [x] **Task 122: `TongHopTongDoanhThuDaThu`** – Tính tổng tiền đã thu thực tế từ CSDL.
- [x] **Task 123: `TongHopTongCongNoPhaiThuAR`** – Tính tổng số dư nợ còn lại của các hóa đơn hợp lệ.
- [x] **Task 124: `TongHopNoQuaHanCanThuHoi`** – Tính số tiền nợ đã vượt quá ngày đến hạn.
- [x] **Task 125: `DemSoDealTuyenDungThanhCong`** – Đếm tổng số vị trí đã tuyển và onboard thành công.
- [x] **Task 126: `TinhTyLeThuHoiCongNoPercent`** – Công thức tính tỷ lệ thu hồi: `(Đã thu / Tổng doanh thu) * 100`.
- [x] **Task 127: `TinhTyLeNoQuaHanPercent`** – Công thức tính tỷ lệ nợ xấu: `(Nợ quá hạn / Tổng nợ) * 100`.
- [x] **Task 128: `TinhDoanhThuThucTeTheo12Thang`** – Gom nhóm và tính toán doanh thu thực tế theo từng tháng từ các đợt thanh toán.
- [x] **Task 129: `ThongKeCoCauKhachHangTheoNganh`** – Thống kê tỷ lệ phân bổ đối tác theo ngành IT, Fintech, E-commerce, Viễn thông.
- [x] **Task 130: `Top5DoanhNghiepNoNhieuNhat`** – Xếp hạng 5 khách hàng có tổng dư nợ lớn nhất cần tập trung đòi nợ.
- [x] **Task 131: `ThietKe4CardKPIDashboardUI`** – 4 thẻ thống kê số liệu với icon và hiệu ứng hiện đại.
- [x] **Task 132: `ThietKe2TheTyLeThuHoiVaNoXau`** – Hiển thị trực quan 2 tỷ lệ tài chính quan trọng.
- [x] **Task 133: `TichHopThuVienChartJSTrenWeb`** – Nhúng Chart.js dựng biểu đồ tương tác cao.
- [x] **Task 134: `VeBieuDoDuongDoanhThuTheoThang`** – Line chart mượt mà thể hiện doanh thu theo 12 tháng.
- [x] **Task 135: `VeBieuDoTronCoCauNganhNghe`** – Doughnut chart thể hiện cơ cấu ngành nghề đối tác.
- [x] **Task 136: `ThietKeBangTop5DebtorsTrenDashboard`** – Bảng tóm tắt nhanh các con nợ lớn nhất kèm nút xem chi tiết.
- [x] **Task 137: `NutLamMoiDuLieuDashboard`** – Nút reload làm mới dữ liệu biểu đồ tức thì.
- [ ] **Task 138: `BoLocDashboardTheoThangQuyNam`** – Bộ chọn thời gian Tháng này, Quý này, Năm nay cho dashboard.
- [ ] **Task 139: `ToiUuGiaoDienDashboardResponsive`** – Hiển thị co giãn hoàn hảo trên màn hình laptop và mobile.
- [ ] **Task 140: `XuatToanBoDashboardRaPDF`** – In và xuất bản báo cáo dashboard tổng hợp.

---

### MODULE 8: Audit Log, Bảo Mật, Kiểm Thử & Đóng Gói (20 Tasks)
- [x] **Task 141: `API_LayLichSuAuditLog`** – Endpoint `GET /api/audit` lấy 100 thao tác gần nhất.
- [x] **Task 142: `GhiLogKhiDangNhapHeThong`** – Tự động ghi nhật ký khi người dùng đăng nhập.
- [x] **Task 143: `GhiLogKhiThemKhachHang`** – Tự động ghi nhật ký khi tạo mới đối tác B2B.
- [x] **Task 144: `GhiLogKhiChotDealTuyenDung`** – Tự động ghi nhật ký khi chốt deal ứng viên onboard.
- [x] **Task 145: `GhiLogKhiPhatHanhHoaDon`** – Tự động ghi nhật ký khi xuất hóa đơn VAT mới.
- [x] **Task 146: `GhiLogKhiThuTienCongNo`** – Tự động ghi nhật ký khi ghi nhận thanh toán trả nợ.
- [x] **Task 147: `GhiLogKhiNhacNoKhachHang`** – Ghi nhật ký khi gửi lời nhắc nợ đối tác.
- [x] **Task 148: `ThietKeGiaoDienBangAuditLogUI`** – Bảng nhật ký thao tác trực quan với nhãn hành động và phân hệ.
- [x] **Task 149: `ChongSQLInjectionQuaSequelize`** – Mọi truy vấn CSDL đều dùng cú pháp an toàn (Parameterized Query).
- [x] **Task 150: `BoKiemThuTuDong_KhoiTaoCSDL`** – Unit test kiểm tra kết nối CSDL và nạp dữ liệu mẫu.
- [x] **Task 151: `BoKiemThuTuDong_ThemKhachHang`** – Unit test kiểm tra tạo và chặn trùng mã số thuế.
- [x] **Task 152: `BoKiemThuTuDong_ChotDealPlacement`** – Unit test kiểm tra tính toán hoa hồng tuyển dụng.
- [x] **Task 153: `BoKiemThuTuDong_PhatHanhHoaDon`** – Unit test kiểm tra tính thuế VAT và tổng tiền hóa đơn.
- [x] **Task 154: `BoKiemThuTuDong_ThanhToanTruNo`** – Unit test kiểm tra trừ dần nợ và chuyển trạng thái Paid.
- [x] **Task 155: `BoKiemThuTuDong_PhanTichTuoiNo`** – Unit test kiểm tra phát hiện hóa đơn quá hạn.
- [x] **Task 156: `BoKiemThuTuDong_AuditLog`** – Unit test kiểm tra ghi nhận lịch sử thao tác.
- [x] **Task 157: `CauHinhLenhNpmTestTrongPackageJson`** – Thiết lập lệnh `npm test` chạy toàn bộ test suite.
- [x] **Task 158: `XuLyEncodingUTF8KhongLoiFont`** – Đảm bảo toàn bộ mã nguồn hiển thị tiếng Việt chuẩn 100%.
- [x] **Task 159: `SoanThaoTaiLieuDanhSachTask`** – Soạn tài liệu `DANH_SACH_TASK.md` hướng dẫn theo dõi tiến độ.
- [x] **Task 160: `CapNhatTaiLieuHuongDanReadme`** – Hoàn thiện `README.md` hướng dẫn chạy và mô tả đề tài.
