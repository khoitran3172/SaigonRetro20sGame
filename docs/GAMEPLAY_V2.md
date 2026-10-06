# Thiết kế lại Gameplay — Bản V2 · vòng 2 (chờ duyệt)

> **Trạng thái:** đã chốt **G6–G9, G32, G53, G54**. Các ý còn lại vẫn là đề xuất — trả lời theo mã *"G42 ok, G54 chọn B"*.
> Ký hiệu: ✅ đã chốt · ✏️ đã sửa theo phản hồi vòng 1 · 🆕 ý mới · 🙈 tạm ẩn ở V2.
>
> Tài liệu liên quan: [ANIMATION_V2.md](ANIMATION_V2.md) · [INVENTORY_V2.md](INVENTORY_V2.md) · [ASSET_TODO.md](ASSET_TODO.md)

---

## 0. Hướng V2 (sau phản hồi)

Một **Sinh viên nam** ở Sài Gòn: **đi làm nhiều nghề bất kỳ lúc nào** để kiếm tiền → **nấu ăn, ngủ, trang trí phòng** để sống tốt hơn → mua bán đồ với người chơi khác ở **Sạp hàng hóa**. Giải trí tạm ẩn. Đường phố chỉ còn **xe buýt và taxi**.

---

## 1. Phạm vi

| Mã | Nội dung |
|---|---|
| **G1** | Tạo nhân vật **chỉ Sinh viên nam** (`sv_male`); lựa chọn khác hiện mờ "Sắp ra mắt". |
| **G2** ✏️ | Tạm đóng: TechCorp, Nhà đấu giá, Showroom. 🙈 Ẩn toàn bộ **giải trí**: Net cỏ, Bida, Băng đĩa, Vé số, ngồi cà phê tán gẫu. Quán cà phê vẫn mở nhưng làm **nơi làm việc** (J4). |
| **G3** | Bỏ **xe cá nhân**. Đi lại = đi bộ + xe buýt + taxi. |
| **G4** | Bỏ mọi animation ngồi; NPC ngồi vẽ lại tư thế đứng; chú sửa xe ngồi xổm giữ nguyên. |
| **G5** | 1 ngày game = 30 phút thực. |

---

## 2. Vòng lặp chính ✏️

```
      ┌──────────────── ĐI LÀM (bất kỳ lúc nào) ────────────────┐
      │ IT · Phục vụ · Trà sữa · Cà phê · Tờ rơi · Shipper ·     │
      │ Gia sư · Ve chai                                         │
      └───────────────┬──────────────────────────────────────────┘
                      │ tiền + kinh nghiệm nghề
                      ▼
   SIÊU THỊ / CHỢ ──► mua nguyên liệu ──► NẤU ĂN ở nhà ──► no bụng, tinh thần
   TT MUA SẮM ──────► mua nội thất ────► TRANG TRÍ phòng ──► điểm thoải mái
                                         NGỦ ──► hồi năng lượng (giường + phòng tốt hồi nhanh)
                      │
                      ▼
   SẠP HÀNG HÓA ◄──► bán món nấu / đồ thừa, mua đồ của người khác
                      │
                      ▼
   Cuối tuần: tiền trọ + học phí + tiền điện ──► nâng cấp: phòng trọ → chung cư, đồ cao cấp
```

| Mã | Nội dung |
|---|---|
| **G6** ✅ | 3 nhu cầu: 🍚 No bụng · ⚡ Năng lượng · 😊 Tinh thần. |
| **G7** ✅ | 3 nhiệm vụ mỗi ngày. |
| **G8** ✅ | Cuối tuần trả tiền trọ + học phí; nợ 2 tuần bị trả phòng. |
| **G9** ✅ | Mục tiêu dài hạn: trọ → trang trí → laptop → chung cư → tốt nghiệp. |
| **G42** 🆕 | Vì giải trí bị ẩn, **Tinh thần** hồi bằng: ăn món ngon tự nấu, ngủ ở phòng có điểm thoải mái cao, đồ trang trí, xem TV/nghe nhạc ở nhà. |

---

## 3. Việc làm — làm bất kỳ lúc nào ✏️ (G11 mở rộng)

| Mã | Nội dung |
|---|---|
| **G11** ✏️ | **Hệ thống nghề**: mở app **"Việc Làm"** trên điện thoại hoặc tới nơi làm → chọn nghề → **làm 1 ca** (một mini-game 30–90 giây). Không giới hạn giờ, chỉ tốn **Năng lượng** và làm đói. Mỗi ca nhận **lương cơ bản + thưởng theo điểm** mini-game. |
| **G43** 🆕 | **Cấp nghề 1–5**: mỗi nghề tích kinh nghiệm riêng; lên cấp tăng lương, mở đơn khó/thưởng cao. Có **yêu cầu đồ**: IT cần laptop/PC, Shipper cần điện thoại, Gia sư cần chứng chỉ (học ở trường). |
| **G10** ✏️ | **Trường học** chuyển thành nơi **học kỹ năng** (không bắt buộc): khóa ngắn trả học phí để tăng nhanh cấp nghề hoặc lấy chứng chỉ (chứng chỉ gia sư). Câu hỏi trắc nghiệm vẫn là mini-game. |

**Danh sách nghề (J1–J9, J7 đã bỏ):**

| Mã | Nghề | Nơi làm | Mini-game 1 ca | Yêu cầu | Lương / ca (cấp 1 → 5) |
|---|---|---|---|---|---|
| **J1** | 💻 **IT freelance** | Ở nhà (bàn + laptop/PC) | Sửa lỗi code: chọn khối lệnh đúng thứ tự / tìm dòng lỗi trước khi hết giờ | Laptop hoặc PC; máy tốt hơn = thêm thời gian | 40k → 150k |
| **J2** | 🍽️ **Phục vụ quán cơm** | Quán cơm tấm (tòa mới) | Nhận order ở bàn, bưng đúng món ra đúng bàn, không làm rơi khay | — | 20k → 60k |
| **J3** | 🧋 **Pha trà sữa** | Tiệm trà sữa (tòa mới) | Đọc đơn → chọn ly, trà, đường, đá, topping đúng | — | 25k → 70k |
| **J4** | ☕ **Pha cà phê** | Quán cà phê vỉa hè | Pha phin: đổ nước đúng lúc, thêm sữa/đá theo đơn | — | 25k → 70k |
| **J5** | 📄 **Phát tờ rơi** | Đi khắp phố | Đi tới **người đi đường** (NPC) và phát đủ 10 tờ trong thời gian; người đã nhận không nhận lại | — | 15k → 40k |
| **J6** | 📦 **Shipper** | Nhận đơn ở Bưu điện / Tạp hóa | Nhận gói + địa chỉ trên bản đồ, tự đi bộ / bắt buýt / taxi tới trước hạn | Điện thoại | 20k → 80k (theo quãng đường) |
| **J8** | 📚 **Gia sư** | Nhà học sinh (một căn nhà ống) | Giảng bài: trả lời câu hỏi của học sinh, chọn cách giải đúng | Chứng chỉ gia sư (học ở trường) | 40k → 120k |
| **J9** | 🥫 **Nhặt ve chai** | Ngoại ô | Cúi nhặt (anim `pickup_down`) rồi bán ở vựa | — | Theo số lượng |

> Phụ bán bánh mì cũ gộp vào **J2** (bà cụ bánh mì là một điểm làm phục vụ).

| Mã | Nội dung |
|---|---|
| **G54** ✅ | **Bỏ nghề chạy Grab** (J7) — không có xe máy, không có tư thế ngồi. |

---

## 4. Nấu ăn 🆕 (trọng tâm)

| Mã | Nội dung |
|---|---|
| **G44** | **Nguyên liệu** mua ở Siêu thị (trong TT Mua Sắm), Tạp hóa, hoặc từ người chơi khác ở Sạp hàng hóa. Nguyên liệu tươi hỏng nếu không bỏ tủ lạnh (I8). |
| **G45** | **Công thức**: 12 món khởi đầu (cơm trắng, trứng chiên, rau muống xào tỏi, canh chua, thịt kho trứng, cá kho tộ, mì xào, cơm chiên, đậu hũ sốt cà, cháo, mì gói trứng, bún xào). Mở thêm món bằng **sách công thức** mua ở siêu thị. |
| **G46** | **Nấu là mini-game** trên bếp: cho nguyên liệu đúng thứ tự, canh lửa / thời gian, nêm nếm. Kết quả: ⭐ Thường · ⭐⭐ Ngon · ⭐⭐⭐ Xuất sắc → hồi No bụng + Tinh thần khác nhau. |
| **G47** | **Dụng cụ quyết định món nấu được**: bếp gas 1 lò (món cơ bản) → bếp đôi (món kho, canh) → bếp từ cao cấp (+thời gian, +sao); nồi cơm điện, chảo, lò vi sóng (hâm lại đồ thừa). |
| **G48** | Món nấu xong **cất trong túi/tủ lạnh**, ăn sau, **mang đi bán** ở Sạp hàng hóa (món ⭐⭐⭐ bán được giá). |

## 5. Ngủ 🆕

| Mã | Nội dung |
|---|---|
| **G49** | Lên giường → chọn **ngủ đến giờ** (ví dụ 2 / 4 / 8 giờ game). Trong lúc ngủ nhân vật ẩn, giường hiện "Zzz"; người chơi khác ghé nhà thấy bạn đang ngủ. |
| **G50** | **Tốc độ hồi Năng lượng** = chất lượng giường × điểm thoải mái phòng × điều kiện (trời nóng không có quạt/máy lạnh hồi chậm, có báo thức → dậy đúng giờ đi làm). Ngủ ngoài đường / không có giường hồi rất chậm. |

## 6. Nhà ở & trang trí

| Mã | Nội dung |
|---|---|
| **G19** | Thuê phòng trọ 150k/tuần → **Vào nhà** → cảnh trong phòng. |
| **G20** | Chung cư thuê 600k/tuần hoặc mua 30 triệu; phòng rộng hơn. |
| **G21** | Chế độ **Sắp xếp**: đặt nội thất lên lưới sàn / tường, xoay, lật, cất lại. |
| **G22** ✏️ | **Nội thất có nhiều mẫu**: mỗi loại có **3 phân khúc** (Bình dân · Tầm trung · Cao cấp), mỗi phân khúc là một **mẫu riêng có tên hãng tự đặt**, hình riêng, giá & chỉ số riêng. Ví dụ ở bảng dưới. |
| **G51** 🆕 | **Chỉ số nội thất**: *Thoải mái* (cộng điểm phòng), *Công năng* (tùy loại: làm mát, dung tích, tốc độ nấu, tốc độ máy…), *Điện tiêu thụ / ngày*, *Độ bền*. Đồ điện cũ/hỏng phải sửa. |
| **G52** 🆕 | **Tiền điện** tính theo đồ điện đang cắm, cộng vào hóa đơn cuối tuần (G8) → máy lạnh xịn mát nhưng tốn điện, máy **Inverter** đắt hơn mà tiết kiệm. |
| **G23** | Mời bạn bè vào nhà (Khóa / Bạn bè / Mọi người). |

**Ví dụ danh mục (tên hãng hư cấu):**

| Loại | Bình dân | Tầm trung | Cao cấp |
|---|---|---|---|
| ❄️ Máy lạnh | **Gió Lùa** 1HP cũ — 1,2tr · làm mát 3 · điện 8k/ngày | **Sương Mai** Inverter 1HP — 6tr · mát 6 · điện 4k | **Bắc Cực** Inverter 2HP Wifi — 15tr · mát 10 · điện 5k · hẹn giờ |
| 🛏️ Giường | Nệm trải sàn — 300k · hồi NL ×1 | Giường gỗ đơn — 2tr · ×1,4 | Giường đôi nệm lò xo — 9tr · ×1,8 · +thoải mái |
| 🧊 Tủ lạnh | Tủ mini 50L — 2tr · 6 ô | Tủ 2 cửa 180L — 6tr · 15 ô | Side-by-side 500L — 20tr · 30 ô · làm đá |
| 🔥 Bếp | Bếp gas mini 1 lò | Bếp gas đôi | Bếp từ đôi cao cấp |
| 💻 Máy tính (cho J1) | Laptop cũ — +0s | Laptop văn phòng — +10s | PC gaming — +25s, +thưởng |

Danh sách đủ 24 loại × 3 mẫu nằm trong [ASSET_TODO.md](ASSET_TODO.md) nhóm "Nội thất 3 phân khúc".

---

## 7. Sạp Hàng Hóa ✏️ (G24 thiết kế lại)

| Mã | Nội dung |
|---|---|
| **G24** ✏️ | Tòa **Chợ Sạp Hàng Hóa** ở Khu 1. Bên trong là các dãy sạp. Mỗi người chơi **thuê 1 sạp** (theo tuần) → bày đồ từ túi lên, **tự đặt giá, sửa giá, thu hồi** bất kỳ lúc nào. |
| **G55** 🆕 | **Sạp mở cả khi bạn offline** (hàng gửi bán): server giữ hàng, ai mua thì tiền vào **tài khoản ngân hàng** của chủ sạp, có thông báo khi online. |
| **G56** 🆕 | **Màn hình chợ**: tab **Mua** — xem tất cả hàng đang bán của mọi người, tìm theo tên, lọc theo loại, sắp xếp theo giá, xem giá trung bình gần đây; bấm mua. Tab **Sạp của tôi** — danh sách đang bày, giá, đã bán, doanh thu. Đi dạo trong chợ cũng bấm vào từng sạp để xem. |
| **G57** 🆕 | Thuế bán 5%, phí thuê sạp tuần; giá đặt tối thiểu/tối đa theo giá gốc để chống rửa tiền. |
| **G53** ✅ | **Bày bán vỉa hè cũ** (ô quy hoạch, cảnh sát phạt, giang hồ, khách NPC) → **bỏ**, thay hoàn toàn bằng Sạp hàng hóa. |

---

## 8. Trung Tâm Mua Sắm

| Mã | Nội dung |
|---|---|
| **G25** | Tòa TT Mua Sắm ở Khu 2, vào trong có quầy & nhân viên. |
| **G26** ✏️ | 5 quầy: Gia dụng · **Nội thất** (đủ 3 phân khúc mỗi loại) · **Điện tử** (laptop, PC, điện thoại cho nghề) · **Thời trang + máy Gacha** (G60–G64) · **Siêu thị** (nguyên liệu nấu ăn, sách công thức). |
| **G27** | UI lưới thẻ sản phẩm, so sánh chỉ số 3 phân khúc cạnh nhau, xem trước nội thất. |
| **G28** | Đồ lớn giao tận nhà sau 1 giờ game. |

### Trang bị: mua ở quầy & Gacha 🆕

| Mã | Nội dung |
|---|---|
| **G60** | Quầy **Thời trang** bán trang bị cấp **Thường** và **Tốt** (giá cố định). Cấp **Hiếm** và **Giới hạn** chỉ có từ **Gacha** (hoặc mua lại của người chơi khác ở Sạp hàng hóa). |
| **G61** | **Máy Gacha** đặt ở quầy Thời trang: mỗi lượt **30.000đ** tiền trong game, quay ra 1 trang bị ngẫu nhiên (áo, quần, giày, nón, kính, đồng hồ, balo). **Tỉ lệ công khai** trên máy: Thường 60% · Tốt 28% · Hiếm 10% · Giới hạn 2%. Có hoạt ảnh viên nang lắc → nứt → lộ đồ, nền sáng theo màu độ hiếm. |
| **G62** | **Bảo hiểm (pity)**: quay 40 lượt chưa ra Hiếm → lượt kế chắc chắn Hiếm; 100 lượt chưa ra Giới hạn → chắc chắn Giới hạn. Bộ đếm hiện trên máy. |
| **G63** | **Đồ trùng** → **phân rã** thành *Mảnh lấp lánh*; đủ mảnh đổi một món Hiếm tự chọn. Hoặc mang đồ hiếm lên **Sạp hàng hóa** bán cho người khác. |
| **G64** | **Chỉ dùng tiền kiếm được trong game** để quay (không dùng Kim cương / tiền thật). Lý do: gacha trả bằng tiền thật bị luật nhiều nước hạn chế (loot box) — nếu sau này muốn bán bằng tiền thật cần xem lại pháp lý. *(Đồng ý?)* |

---

## 9. Giao thông ✏️

| Mã | Nội dung |
|---|---|
| **G29** | Tuyến buýt 01, 4 trạm, server điều khiển — mọi người thấy cùng một xe. |
| **G30** | Mỗi chiều 1 chuyến / 90 giây thực, dừng 8 giây; vé 7.000đ (SV 3.500đ). |
| **G31** | Taxi: gọi qua điện thoại hoặc điểm đón, tới sau 5–10 giây. |
| **G32** ✅ | **Bỏ toàn bộ xe máy** (cả xe chạy trang trí lẫn xe đậu ven đường). Trên đường chỉ còn **xe buýt (theo lịch)** và **taxi** chạy theo nhịp đều (20–30 giây một chiếc). |

---

## 10. Giao diện riêng có ảnh

| Mã | Tòa / tính năng | Giao diện |
|---|---|---|
| **G33** ✏️ | Trường học | Danh sách khóa học kỹ năng + màn câu hỏi bảng đen |
| **G34** ✏️ | Mini-game các nghề J1–J8 (trừ J7) | Mỗi nghề một màn chơi riêng (xem ASSET_TODO) |
| **G36** ✏️ | Bếp ở nhà | Mặt bếp nhìn từ trên + sách công thức |
| **G37** | TT Mua Sắm, Siêu thị, Tạp hóa | Lưới sản phẩm + banner quầy |
| **G38** | ATM / Ngân hàng | Màn ATM |
| **G39** | Bưu điện | Phong bì + nhận đơn ship |
| **G40** | Nhà trọ / Chung cư | Hợp đồng thuê, hóa đơn tuần (trọ + học phí + điện) |
| **G41** | Trạm xe buýt | Sơ đồ tuyến |
| **G58** 🆕 | Điện thoại | Khung điện thoại với các app: Việc Làm, Ngân hàng, Bản đồ, Gọi taxi, Chợ (xem sạp từ xa) |
| **G59** 🆕 | Chợ Sạp Hàng Hóa | Màn Mua / Sạp của tôi (G56) |

🙈 Ẩn ở V2: G14 (Net cỏ), G15 (cà phê tán gẫu), G18 (Vé số), Bida, Băng đĩa.

---

## 11. Thứ tự làm (sau khi chốt)

1. Thu hẹp phạm vi (G1–G5, G32) + 3 nhu cầu (G6) + túi đồ mới (INVENTORY_V2).
2. Xe buýt / taxi (G29–G31).
3. Hệ thống nghề (G11, G43) + 2–3 nghề đầu tiên có art sẵn: **J5 tờ rơi, J6 shipper, J9 ve chai** → sau đó các nghề cần art mini-game.
4. Nhà trọ: vào nhà, đặt nội thất, ngủ (G19, G21, G49–G50).
5. Nấu ăn (G44–G48) + TT Mua Sắm & Siêu thị (G25–G28) + nội thất 3 phân khúc, tiền điện (G22, G51–G52).
6. Chợ Sạp Hàng Hóa (G24, G55–G57).
7. Nhiệm vụ ngày, hóa đơn tuần, chung cư (G7–G9, G20).

Bước cần art sẽ chờ bạn vẽ theo [ASSET_TODO.md](ASSET_TODO.md); trong lúc chờ mình làm logic với ô vuông xám đánh dấu chỗ đặt art (không tự vẽ art).
