# Lộ trình & đối chiếu GDD

## Đã có (vertical slice)

| GDD | Trạng thái |
|---|---|
| 3 tầng lớp + chỉ số riêng (Điểm danh / KPI / Uy tín) | ✅ |
| Thăng tiến nghề nghiệp 3 bậc, SV nộp CV thành NVVP | ✅ |
| 4 phân khu liền mạch (Đại học, Phố ẩm thực, CBD, Ngoại ô) | ✅ |
| Tiền mặt / Ngân hàng / Danh vọng / Kim cương | ✅ |
| ATM có phí, lãi ngày, chuyển khoản, lương 17:00 | ✅ |
| Bày sạp P2P (3 cấp sạp), ô quy hoạch, thuế 5%, khách NPC | ✅ |
| Chế biến (bánh mì, trà đá, nước mía) | ✅ |
| Cảnh sát tuần tra / phạt lấn chiếm / trấn áp trộm | ✅ |
| Ăn trộm nhắm người giữ nhiều tiền mặt / AFK, đuổi trộm | ✅ |
| Giang hồ đòi bảo kê: trả / gọi Cảnh sát / kêu gọi người chơi | ✅ |
| Bưu tá: thư, bưu phẩm, bản tin thành phố | ✅ |
| 10 slot + Điện thoại (chat thế giới, banking, định vị, đấu giá từ xa) | ✅ |
| Phương tiện: xe đạp, Cub, tay ga, phân khối lớn (mưa chậm 50%) | ✅ |
| Cường hóa (fail chỉ giảm cấp), độ bền & sửa chữa, hào quang +5 | ✅ |
| Chat gần theo cự ly, chat thế giới có cooldown + cước 4G, Loa LED RGB | ✅ |
| Đấu giá 20:00 (lô hệ thống + ký gửi) | ✅ |
| Ngày/đêm, mưa ngập, nắng gắt | ✅ |
| Nhà trọ (thuê, nghỉ hồi phục ×3), Net cỏ, Bida, Vé số | ✅ giản lược |
| Lưu trữ PostgreSQL + sổ cái đối soát | ✅ |

## Tiếp theo

**Gameplay**
- Ở ghép / trang trí phòng, mua căn hộ.
- Mini-game cờ tướng / caro có cược, đua xe đêm 23:00 ở Ngoại ô.
- Nghiệp đoàn / Công đoàn / Hội đồng hương.
- Class ẩn: Xe ôm công nghệ (chở người, giao hàng), Cò đất / quản lý trọ.

**Art** — xem [`ASSET_STATUS.md`](ASSET_STATUS.md)
- Bộ nhân vật NVVP & Tiểu thương (nam/nữ), `sv_female` đi xuống.
- Cảnh sát, Ăn trộm, Giang hồ, Bưu tá, người đi đường.
- Ngân hàng, TechCorp, đấu giá, showroom, thời trang, vựa ve chai, nhà ống.

**Kỹ thuật**
- Ghi từng giao dịch thẳng vào PostgreSQL thay vì theo lô 5s.
- Redis Pub/Sub cho chat thế giới + LED khi chạy nhiều server.
