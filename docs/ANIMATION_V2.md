# Đánh giá độ mượt animation & đề xuất số frame (chờ duyệt)

> Mã ý: `A…`. Trả lời *"A1 ok, A3 chọn B"*.

## 1. Đo trên art hiện tại (`sv_male`, đã nhập vào game)

| Dải | Số frame | Tốc độ | Chiều cao các frame | Đầu lệch ngang giữa các frame |
|---|---|---|---|---|
| Đứng (idle_down) | 6 | 4 fps | 86px cả 6 frame | 0,2px |
| Đi ngang | 6 | 9 fps | 86px cả 6 frame | 1,9px |
| Đi xuống | 6 | 9 fps | 86px cả 6 frame | 1,4px |
| Đi lên | 6 | 9 fps | 86–87px | 0,3px |
| Đứng quay lưng / nhìn ngang | 3 + 3 (chung 1 ảnh) | 4 fps | 85–86px | 1,1px |

## 2. Vì sao nhìn chưa mượt

1. **Không có nhịp nhún.** Khi đi bộ thật, người cao lên ở pha "chân lướt qua" và thấp xuống ở pha "chân chạm đất" (2–3px ở cỡ 86px). Art hiện tại cao **đúng 86px ở mọi frame** → trông như trượt.
2. **Chân trượt trên mặt đất.** Vòng bước 6 frame × 9 fps = 0,67 giây cho 2 bước, trong khi nhân vật di chuyển 165px/giây → mỗi bước đi được ~55px, nhưng sải chân trong hình chỉ ~30px. Chân "chạy không kịp" người.
3. **6 frame chưa đủ pha** cho một vòng bước rõ ràng (chuẩn là 8: chạm đất – hạ thấp – lướt qua – nâng lên, × 2 chân). AI vẽ 6 frame thường lặp pha nên có frame "giật".
4. **Mỗi frame AI vẽ riêng** → đầu xê dịch 1–2px giữa các frame (rung nhẹ).
5. **Ảnh đứng quay lưng / nhìn ngang chỉ có 3 frame** và gộp chung một ảnh → nhịp thở không đều.

## 3. Đề xuất số frame mới

| Mã | Dải | Hiện tại | **Đề xuất** | Tốc độ | Ghi chú |
|---|---|---|---|---|---|
| **A1** | Đi xuống / Đi lên / Đi ngang (`walk_down`, `walk_up`, `walk_left`) | 6 | **8** | 10–12 fps | Liệt kê sẵn 8 pha trong prompt để AI vẽ đúng chu kỳ + nhún |
| **A2** | Đứng mặt trước (`idle_down`) | 6 | **4** | 4 fps | 4 frame thở là đủ mượt; 6 frame của AI hay lẫn động tác thừa |
| **A3** | Đứng quay lưng (`idle_up`), đứng nhìn ngang (`idle_left`) | 3+3 gộp | **4 mỗi dải, tách 2 ảnh** | 4 fps | Đồng bộ nhịp thở với `idle_down` |
| **A4** | Hành động mới: cúi nhặt (`pickup_down`) | — | **6** | 10 fps | Nhặt ve chai, nhặt đồ rơi |
| **A5** | Hành động mới: ăn/uống (`eat_down`) | — | **6** | 8 fps | Dùng đồ ăn trong túi |
| **A6** | Hành động mới: bấm điện thoại (`phone_down`) | — | **4** | 4 fps | Khi mở điện thoại / gọi taxi |
| **A7** | Bỏ `ride_left` (ngồi lái) — theo G3/G4 | 6 | **0** | — | |
| **A8** | NPC đi lại (Cảnh sát, Trộm, người đi đường): đi 3 hướng **8 frame** + đứng 4 frame | — | 8 / 4 | | Cùng chuẩn với người chơi |
| **A9** | NPC đứng làm việc (bà cụ bánh mì…) | 6 | **giữ 6** | 6 fps | Đứng tại chỗ, 6 frame đã đủ; chỉ vẽ lại các NPC đang ngồi sang tư thế đứng (G4) |

**Tổng cho `sv_male` bản V2:** 9 ảnh (3 dải đi × 8 frame, 3 dải đứng × 4 frame, 3 dải hành động).

> **Giới hạn của Gemini:** 8 frame/hàng là mức tối đa nên dùng. Ảnh xuất 1024px chia 8 = 128px/frame, đủ để thu về 86px trong game. Từ 10 frame trở lên AI rất hay vẽ sai số lượng. Prompt trong [ASSET_TODO.md](ASSET_TODO.md) đã đánh số từng pha.

## 4. Phần code sẽ làm (không cần art)

| Mã | Việc | Hiệu quả |
|---|---|---|
| **A10** | **Đồng bộ tốc độ animation theo tốc độ di chuyển** (fps = tốc độ ÷ độ dài sải chân đo từ art) | Hết trượt chân, kể cả khi đi chậm do đói / mưa |
| **A11** | **Căn frame theo đầu** thay vì theo khung bao (pipeline đo vị trí đầu từng frame rồi căn thẳng hàng) | Giảm rung 1–2px |
| **A12** | **Nội suy vị trí người chơi khác** theo bộ đệm 100ms thay vì "đuổi theo" vị trí mới | Người chơi khác đi mượt, không giật khi mạng chập chờn |
| **A13** | Khi dừng lại giữ **hướng nhìn cuối cùng** và chuyển sang dải đứng tương ứng (đã có một phần) | Không bị "quay mặt" đột ngột |
| **A14** | Làm tròn vị trí vẽ theo pixel khi camera đứng yên | Hết nhòe/nhấp nháy viền khi đứng |

## 5. Mẹo khi vẽ bằng Gemini để các frame khớp nhau

1. Vẽ **`idle_down` trước**. Các dải sau luôn **đính kèm ảnh `idle_down`** và viết "same character as the attached image".
2. Nếu ra sai số frame → tạo lại, **không cắt ghép tay**.
3. Kiểm tra nhanh: phóng to xem đỉnh đầu các frame có lên xuống nhẹ không (phải có nhún), chân có cùng đường nền không.
