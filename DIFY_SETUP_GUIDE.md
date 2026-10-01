# HƯỚNG DẪN CẤU HÌNH & TRIỂN KHAI DIFY CHO DỰ ÁN CCU

Hệ sinh thái CCU đã được tích hợp sẵn tầng kết nối AI Engine với **Dify** cho 2 trợ lý ảo:
1. **SUPPI**: AI Sourcing & Khảo sát tiêu chuẩn kỹ thuật (đóng vai trò phân tích nhu cầu, tra cứu danh bạ doanh nghiệp/nhà xưởng KYC).
2. **CHAINY**: AI Điều phối & Khớp nối giao thương (đóng vai trò tạo nhóm 3 bên, nhắc tiến độ gửi mẫu, duyệt báo giá, kết nối Zalo OA).

---

## 1. Cơ Chế Hoạt Động (Web Bot vs Zalo OA)
- **Web Chatbot (Front-end CCU)**: Phục vụ khách hàng 24/7 trực tiếp trên website. Khách duyệt sàn tìm nhà xưởng, click vào mascot SUPPI hoặc CHAINY để mở chat ngay tại trang hiện tại mà không bị gián đoạn.
- **Zalo OA (Giao thương & Thông báo đẩy)**: Khi khách cần nhận báo giá chính thức, gửi mẫu thử hoặc tạo nhóm làm việc 3 bên (**Buyer + Supplier + Điều phối viên CCU**), hệ thống sẽ kích hoạt nút **"Chuyển tiếp sang Zalo OA"**.
- **Bộ não chung (Dify AI Engine)**: Cả Web Bot và Zalo OA đều được cấp nguồn tri thức từ **Dify Knowledge Base** (Dữ liệu doanh nghiệp, KCN, Tiêu chuẩn ngành của CCU).

---

## 2. Cách Cấu Hình Dify Trong Dự Án (2 Phút)

### Cách A: Dùng Dify Cloud (Nhanh nhất & Miễn phí khởi tạo)
1. Đăng ký tài khoản tại [https://cloud.dify.ai](https://cloud.dify.ai)
2. Tạo 1 ứng dụng dạng **Chatbot / Agent**:
   - Tên App: `CCU AI Assistant`
   - Đặt System Prompt / Hướng dẫn: Nhập nội dung phân vai SUPPI & CHAINY (tham khảo file `CHATBOT.txt`).
   - Tải lên Knowledge Base: Các file danh mục sản phẩm, năng lực nhà máy, danh bạ KCN của CCU.
3. Vào menu **API Access** (góc trái giao diện Dify) -> Bấm **API Key** -> **Generate New API Key**.
4. Mở file `.env` trong dự án CCU (nếu chưa có thì tạo mới từ `.env.example`) và điền:
   ```env
   VITE_DIFY_API_URL=https://api.dify.ai/v1
   VITE_DIFY_API_KEY=app-xxxxxxxxxxxxxxxxxxxx
   ```
5. Khởi động lại server dev (`npm run dev`). Hệ thống sẽ tự động chuyển từ cơ chế Fallback nội bộ sang Dify API trực tiếp!

---

### Cách B: Triển Khai Dify Tự Host (Self-hosted Docker)
Nếu muốn chạy Dify trên máy chủ riêng (VPS / On-Premise) để bảo mật 100% dữ liệu nội bộ:
1. Cài đặt Docker trên Server (hoặc trên Mac: `brew install --cask docker`).
2. Clone repo Dify chính thức:
   ```bash
   git clone https://github.com/langgenius/dify.git
   cd dify/docker
   cp .env.example .env
   docker compose up -d
   ```
3. Truy cập vào `http://localhost/install` hoặc `http://IP_SERVER` để thiết lập tài khoản Admin.
4. Cấu hình Model Provider (Gemini API, OpenAI, Claude, hoặc DeepSeek) trong mục Cài đặt Dify.
5. Cập nhật `.env` của Web CCU trỏ về URL Dify server:
   ```env
   VITE_DIFY_API_URL=http://your-server-ip/v1
   VITE_DIFY_API_KEY=app-xxxxxxxxxxxxxxxxxxxx
   ```

---

## 3. Kiến Trúc Mã Nguồn Đã Tích Hợp
- **`src/services/difyService.js`**: Service chịu trách nhiệm gửi tin nhắn, duy trì hội thoại (`conversation_id`), tự động fallback thông minh sang Gemini Sourcing nội bộ nếu API key Dify chưa sẵn sàng.
- **`src/components/chat/DifyChatWidget.jsx`**: Khung chat nổi hiện đại, hỗ trợ chuyển đổi nhanh giữa SUPPI và CHAINY, gợi ý câu hỏi thông minh theo vai trò, tích hợp modal quét mã QR & mở Zalo OA.
- **`src/components/SuppliMascot.jsx`**: Linh vật tương tác góc màn hình. Nhấp vào SUPPI để mở SUPPI Sourcing; nhấp vào CHAINY để mở CHAINY Điều phối.
