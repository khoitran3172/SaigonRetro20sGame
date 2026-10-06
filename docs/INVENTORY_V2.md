# Túi đồ & Trang bị — Bản V2 (chờ duyệt)

> Mã ý: `I…`. Trả lời *"I1 ok, I11 chọn B"*.

## 1. Hiện tại

- Túi là **danh sách cuộn**, không giới hạn số món, mỗi món một dòng chữ + nút.
- Trang bị: 11 ô dạng ô chữ, bấm để tháo; không xem trước, không so sánh.
- Không có kho, không kéo thả, không phím tắt dùng nhanh.

## 2. Cơ chế mới

| Mã | Đề xuất |
|---|---|
| **I1** | **Túi dạng lưới ô**: 20 ô (5×4). Đeo **balo** +10 ô. Hết chỗ thì không nhặt / mua thêm được (có thông báo). |
| **I2** | **Giới hạn chồng**: đồ ăn 10/ô · nguyên liệu 20/ô · ve chai & vật liệu 50/ô · trang bị, nội thất 1/ô. |
| **I3** | **Tab lọc**: Tất cả · Ăn uống · Nguyên liệu · Trang bị · Nội thất · Khác. Nút **Sắp xếp** tự gom và xếp theo loại. |
| **I4** | **Thao tác**: bấm 1 lần = chọn + hiện thanh hành động (Dùng / Trang bị / Đặt vào nhà / Bán / Vứt) · bấm đúp = dùng/trang bị · **kéo thả** để đổi chỗ, kéo vào ô trang bị, kéo lên thanh dùng nhanh · Shift + kéo = tách đôi chồng. Điện thoại: chạm giữ thay cho bấm đúp. |
| **I5** | **Thanh dùng nhanh** 5 ô ở đáy màn hình, phím **1–5** (đồ ăn, nước uống, điện thoại). |
| **I6** | **Ô thông tin** khi rê chuột/chạm giữ: tên (màu theo độ hiếm), mô tả, công dụng, độ bền, giá bán lại; với trang bị hiện **so sánh với món đang mặc** (+xanh / −đỏ). |
| **I7** | **4 cấp độ hiếm**, viền ô theo màu: Thường (xám) · Tốt (xanh lá) · Hiếm (xanh dương) · Giới hạn (vàng, có ánh sáng). Thường/Tốt mua ở quầy, Hiếm/Giới hạn ra từ **Gacha** (GAMEPLAY_V2 G60–G64). Mỗi ô trang bị có đủ 4 mẫu theo độ hiếm, chỉ số tăng dần. |
| **I8** | **Đồ ăn tươi hỏng** sau 1 ngày game nếu để trong túi; bỏ **tủ lạnh** ở nhà thì giữ 7 ngày. Mì gói, nước đóng chai không hỏng. *(Có thể bỏ nếu thấy phức tạp.)* |
| **I9** | **Kho ở nhà** (rương / tủ quần áo / tủ lạnh, theo G22): mở ra hiện **2 lưới cạnh nhau** (Túi ↔ Kho), kéo qua lại. Đồ trong kho **không bị trộm**, không mất khi chết đói/ngất. |
| **I10** | **Server kiểm soát mọi lần di chuyển đồ** (đổi ô, tách chồng, kéo vào kho) — client chỉ gửi yêu cầu "từ ô A sang ô B", server kiểm tra rồi mới đổi → không thể nhân bản đồ. |

## 3. Trang bị

| Mã | Đề xuất |
|---|---|
| **I11** | **8 ô cho Sinh viên**: Áo · Quần · Giày/Dép · Nón · Kính · Đồng hồ · Balo · Điện thoại. Bỏ tạm: Khuyên tai, Đặc biệt, Phương tiện (theo G3). |
| **I12** | **Bố cục "búp bê giấy"**: hình nhân vật thật (đang chạy anim đứng thở) ở giữa, 8 ô xếp quanh đúng vị trí cơ thể (nón trên đầu, giày dưới chân…). |
| **I13** | **Trang bị có đổi ngoại hình trên nhân vật không?** **A.** Không — chỉ cộng chỉ số (V2 làm cái này; đổi ngoại hình cần vẽ mỗi món × mỗi frame × mỗi hướng — rất nhiều asset). **B.** Có, cho riêng **nón + balo** (vẽ thêm lớp phủ lên 9 dải animation). Đề xuất **A**. |
| **I14** | **Chỉ số hiển thị** cạnh búp bê giấy: Thu hút · Tốc độ đi · Tiết kiệm năng lượng · Sức chứa túi · Tổng giá trị đồ đang mặc. |
| **I15** | Giữ **độ bền & cường hóa** như cũ (sửa / cường hóa ở Chú Sửa Xe), hiển thị thanh độ bền và cấp `+N` ngay trên ô. |

## 4. Phác thảo giao diện

**Túi đồ (phím I):**
```
┌──────────────────────── 🎒 TÚI ĐỒ  18/30 ─────────────────── ✕ ┐
│ [Tất cả][Ăn uống][Nguyên liệu][Trang bị][Nội thất][Khác] [Sắp xếp]│
│ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐                                        │
│ │🥖││🧋││🍞││  ││  ││  │   ┌─ Ô THÔNG TIN ──────────────┐      │
│ │x3││x5││x4││  ││  ││  │   │ Bánh mì thịt     (Thường)  │      │
│ └──┘└──┘└──┘└──┘└──┘└──┘   │ No bụng +35                 │      │
│ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐   │ Hỏng sau: 18 giờ            │      │
│ │  ││  ││  ││  ││  ││  │   │ Bán lại: 7.500đ             │      │
│ └──┘└──┘└──┘└──┘└──┘└──┘   └─────────────────────────────┘      │
│  ...  (5 hàng × 6 ô khi có balo)                               │
│ [ Dùng ] [ Thêm vào thanh nhanh ] [ Vứt ]       💵 45.000đ     │
└────────────────────────────────────────────────────────────────┘
          ┌──┐┌──┐┌──┐┌──┐┌──┐   ← thanh dùng nhanh (phím 1–5)
          │1 ││2 ││3 ││4 ││5 │
          └──┘└──┘└──┘└──┘└──┘
```

**Trang bị (phím C):**
```
┌──────────── 👕 TRANG BỊ ─────────── ✕ ┐
│        [Nón]          [Kính]          │   Thu hút        12
│                                       │   Tốc độ        170
│ [Áo]   ( nhân vật  )  [Đồng hồ]       │   Tiết kiệm NL   8%
│        (  đang thở )                  │   Sức chứa      30
│ [Quần] (           )  [Balo]          │
│        [Giày]       [Điện thoại]      │   Độ bền thấp nhất: Giày 42%
└───────────────────────────────────────┘
```

**Kho ở nhà (bấm vào rương / tủ):** hai lưới *Túi* | *Kho* đặt cạnh nhau, kéo qua lại.

## 5. Art cần cho phần này

Danh sách đầy đủ kèm prompt nằm ở [ASSET_TODO.md](ASSET_TODO.md), mục **"Bộ giao diện (UI kit)"** và **"Icon vật phẩm mới"**. Tóm tắt:

- Khung panel lớn (dùng chung cho Túi / Trang bị / Cửa hàng), có thể co giãn
- Ô túi: trống · đang chọn · khóa · 4 viền độ hiếm
- 6 icon tab lọc, nút bấm 4 trạng thái, nút đóng
- Khung ô thông tin, khung thanh dùng nhanh
- Nền búp bê giấy + 8 icon ô trang bị trống (hình bóng mờ áo, quần, giày…)
- Icon cho các vật phẩm mới: đồ ăn siêu thị, nội thất, gia dụng, điện tử
