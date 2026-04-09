# Bộ gõ tốc kí tiếng Việt

**Lưu ý:** Muốn tìm hiểu thêm hay có gì chưa hiểu thì nhắn tin mình nhé.

Bộ gõ này lấy cảm hứng cực mạnh từ https://github.com/user202729/plover_vi của anh Bùi Hồng Đức.

Để sử dụng bộ gõ này, ta cần phải
 * Kiếm một bàn phím hỗ trợ NKRO (nhận nhiều phím cùng lúc)
   * Để kiểm tra, vô trang https://www.mechanical-keyboard.org/key-rollover-test/ rồi cố ấn nhiều phím xem thử nó nhận hết không. Nhớ đè nhiều phím vô nha.
   * Bàn phím cơ có khả năng cao đã có NKRO rồi, còn bàn phím mà ở trên laptop thì khả năng cao là không có NKRO.
 * Cài Plover: https://github.com/openstenoproject/plover
 * Cài plugin plover-python-dictionary: https://plover.readthedocs.io/en/latest/dict_formats.html#programmatic-dictionaries

Sau khi cài hai thứ này xong, tải file parse.py về rồi nạp vào.

Cơ chế ráp vần của bộ gõ này tuân theo quy tắc chính tả tiếng Việt. Để gõ một âm tiết, ta cần tách nó thành phụ âm đầu, âm đệm, nguyên âm, phụ âm cuối và thanh. Quá trình xử lý một tổ hợp phím (stroke) diễn ra theo thứ tự ưu tiên rất chặt chẽ từ trái sang phải: **Phím viết hoa (#) -> Âm đệm (S) -> Phụ âm đầu -> Nguyên âm -> Phụ âm cuối -> Thanh điệu**.

Nếu một tổ hợp phím bị thiếu nguyên âm hoặc gõ sai quy tắc, tổ hợp đó sẽ bị bỏ qua hoàn toàn.

## Phương pháp tách âm tiết và xử lý chính tả tự động
Bạn cần phân tích âm tiết thành 5 thành phần sau:

 1. **Thanh điệu:** Dấu thanh của âm tiết được gõ bằng các ngón tay bên tay phải.
   * Trong hệ thống rút gọn này, thanh điệu quyết định luôn cả việc phụ âm cuối sẽ kết thúc bằng âm mũi (m, n, ng, nh) hay âm tắc (p, t, c, ch).
   * Các thanh thường: **Ngang** (không bấm), **Sắc** (L), **Huyền** (G), **Hỏi** (B), **Ngã** (LG), **Nặng** (BG).
   * Các thanh kết thúc cụt dành riêng cho các từ tận cùng bằng *p, t, c, ch*: **Sắc-Cụt** (BL) và **Nặng-Cụt** (BLG). Cấu trúc này mô phỏng quy tắc ngữ âm tiếng Việt (từ kết thúc bằng âm tắc chỉ có thể mang thanh sắc hoặc nặng).

 2. **Phụ âm cuối:** Layout rút gọn chỉ dùng 6 tổ hợp phím cho âm cuối:
   * Bán nguyên âm: **w** (F) và **j** (FP).
     * F sẽ tự động in ra u hoặc o tùy vào nguyên âm chính.
     * FP sẽ tự động in ra y (nếu đi sau ă/â) hoặc i (với các nguyên âm khác).
   * Phụ âm thực: **P**, **R**, **FR**, **RP**. Mặc định, các phím này in ra âm mũi tương ứng: m, n, ng, nh. Tuy nhiên, nếu bạn kết hợp với thanh Stop (BL hoặc BLG), bộ gõ sẽ tự động chuyển thành âm tắc: p, t, c, ch.
   * *Ví dụ:* Gõ vần "an" (A + R). Gõ vần "át" (A + R + BL). Gõ "ngang" (FR), gõ "ngạc" (FR + BLG).
 3. **Nguyên âm chính:** Là hạt nhân bắt buộc phải có, bao gồm 15 tổ hợp phím mô phỏng toàn bộ nguyên âm đơn và đôi trong tiếng Việt (a, ă, â, e, ê, i, o, ô, ơ, u, ư, y, iê/ia, ua/uô, ưa/ươ). Bộ gõ sẽ tự động chọn biến thể thích hợp (ví dụ iê hay ia) tùy thuộc vào việc từ đó có phụ âm cuối hay không.
 4. **Âm đệm:** Sự xuất hiện của bán nguyên âm /w/ (chữ *o* hoặc *u*) đứng trước nguyên âm chính.
   * Trong bộ gõ này, âm đệm được kích hoạt bằng cách nhấn thêm phím **'S'** ở bên trái (vị trí đầu tiên của tổ hợp).
   * Bộ gõ tự động xử lý chính tả:
     * Mặc định là thêm o (ví dụ: hoa, hòe).
     * Tự động chuyển thành u nếu đi kèm các nguyên âm như *â, ê*, hoặc nếu phụ âm đầu là *c* (chữ *q*).
     * Tự động biến đổi cấu trúc với các vần khó như *iê/ia* (thành *uy/uyê*) hoặc *i* (thành *uy/uy*).
 5. **Phụ âm đầu:** Là tổ hợp phím bên tay trái. Nhờ quy tắc chính tả tự động, bạn chỉ cần gõ theo âm thanh gốc, hệ thống sẽ tự động quyết định mặt chữ:
   * Để chia nhóm chính tả, tiếng Việt chia nguyên âm thành 2 nhóm: nhóm sau (a, ă, â, o, ô, ơ, u, ư, ua/uô, ưa/ươ) và nhóm trước (e, ê, i, iê/ia, y).
   * **ng / ngh (TPW):** Tự động ra ngh nếu đi với nguyên âm nhóm trước, ra ng với nhóm sau hoặc khi có âm đệm.
   * **g / gh (TKPW):** Tự động ra gh nếu đi với nguyên âm nhóm trước, ra g nếu đi với nhóm sau hoặc có âm đệm.
   * **c / k / q (K):** Tự động ra q nếu có âm đệm S. Ra k nếu đi với nguyên âm nhóm trước. Ra c với nguyên âm nhóm sau.
   * **gi / g (KWH):** Tự động ra g nếu đi kèm nguyên âm i hoặc iê/ia (ví dụ: *gì*, *giếng* thay vì *giì*, *giiếng*). Ra gi trong các trường hợp còn lại.
**Quy trình tách và gõ âm tiết:**
 1. Cần viết hoa chữ cái đầu không? (Nếu có thêm #).
 2. Có âm đệm (o/u) nằm ngay sau phụ âm đầu không? (Nếu có thêm S trái).
 3. Xác định **Phụ âm đầu** (Bảng Âm Đầu).
 4. Xác định **Nguyên âm chính** (Bảng Nguyên Âm). *Bắt buộc phải có*.
 5. Xác định **Phụ âm cuối** (Bảng Âm Cuối).
 6. Xác định **Thanh điệu** (Bảng Thanh Điệu). Nhớ dùng thanh cụt (BL/BLG) nếu từ kết thúc bằng p/t/c/ch.
**Lưu ý về các trường hợp đặc biệt (ví dụ: "đau"/"đao", "thay"/"thai"):**
 * **"đao" và "đau":**
   * "đao" = đ (TK) + a (A) + o/w (F). Tổ hợp phím: **TKAF**.
   * "đau" = đ (TK) + ă (AE) + u/w (F). Tổ hợp phím: **TKAEF**. (Phím F kết hợp với ă/AE sẽ tự in ra 'u' thay vì 'o').
 * **"thai" và "thay":**
   * "thai" = th (TH) + a (A) + i/j (FP). Tổ hợp phím: **THAFP**.
   * "thay" = th (TH) + ă (AE) + y/j (FP). Tổ hợp phím: **THAEFP**. (Phím FP kết hợp với ă/AE sẽ tự in ra 'y' thay vì 'i').
## Ráp thành tổ hợp phím
**Bảng Âm Đầu**
| Tổ hợp phím | Âm Tiếng Việt |
|---|---|
| PW | b |
| K | c / q / k |
| KH | ch |
| KWR | d |
| TK | đ |
| TP | ph |
| TKPW | g / gh |
| H | h |
| KWH | gi / g |
| KHR | kh |
| HR | l |
| PH | m |
| TPH | n |
| TPR | nh |
| TPW | ng / ngh |
| P | p |
| R | r |
| KP | s |
| T | t |
| TH | th |
| TR | tr |
| W | v |
| WR | x |
**Bảng Nguyên Âm**
| Tổ hợp phím | Nguyên Âm Tiếng Việt |
|---|---|
| OEU | iê / ia |
| AEU | ua / uô |
| AOE | ưa / ươ |
| AOU | ư |
| OU | ơ |
| OE | ô |
| O | o |
| AU | ê |
| E | e |
| EU | i |
| A | a |
| AE | ă |
| AO | â |
| U | u |
| AOEU | y |
**Bảng Âm Cuối (Rút gọn & Chuyển đổi qua Thanh điệu)**
| Tổ hợp phím | Âm Cuối (Thanh Thường) | Âm Cuối (Thanh Cụt: BL/BLG) |
|---|---|---|
| FP | j (i / y) | *(Không áp dụng)* |
| F | w (o / u) | *(Không áp dụng)* |
| P | m | p |
| R | n | t |
| FR | ng | c |
| RP | nh | ch |
**Bảng Thanh Điệu**
| Tổ hợp phím | Thanh Điệu | Ví dụ (với 'ma' và 'man') |
|---|---|---|
| *(Không)* | Ngang | ma, man |
| L | Sắc | má, mán |
| G | Huyền | mà, màn |
| B | Hỏi | mả, mản |
| LG | Ngã | mã, mãn |
| BG | Nặng | mạ, mạn |
| **BL** | **Sắc (Cụt)** | mát *(Gõ: PH + A + R + BL)* |
| **BLG** | **Nặng (Cụt)** | mạt *(Gõ: PH + A + R + BLG)* |
*(Lưu ý: Thanh Cụt BL/BLG bắt buộc phải đi kèm với 1 trong 4 âm cuối là P, R, FR hoặc RP. Nếu dùng sai, tổ hợp phím sẽ bị bỏ qua).*
# Gõ số
**Với những người dùng bàn phím bình thường:**
 * Cứ gõ nó như lâu nay thôi, trên bàn phím QWERTY dùng phím gì cho số thì khi gõ tốc kí vẫn dùng phím đó.
 * Cấu hình Plover mặc định nó gán hết mấy phím số thành phím #. Vô phần Configure, chọn Machine, chọn Keyboard rồi sửa Keymap, xóa hết mấy cái dấu # đi.
 * Tại vì cái bộ gõ này có dùng phím # để viết hoa chữ cái đầu, nên gán phím Q trên bàn phím QWERTY thành phím #. Vậy cho nó tiện.
**Với những người đã tốn tiền mua bàn phím tốc kí chuyên dụng:** nạp từ điển này: https://github.com/StenoHarri/Harri_numbers
# Viết hoa chữ cái đầu
Để viết hoa chữ cái đầu tiên của âm tiết, ta bấm giữ thêm phím # trong tổ hợp phím.
# Gõ các kí tự đặc biệt
**Với những người dùng bàn phím bình thường:**
 * Cứ gõ nó như lâu nay thôi, trên bàn phím QWERTY dùng phím gì cho kí tự đặc biệt thì khi gõ tốc kí vẫn dùng phím đó.
 * Cấu hình Plover mặc định có vô hiệu hóa một số phím trên bàn phím. Vô phần Configure, chọn Machine, chọn Keyboard rồi sửa Keymap, xóa hết mấy cái no-op.
**Với những người đã tốn tiền mua bàn phím tốc kí chuyên dụng:** thôi cố tự định nghĩa tổ hợp phím cho mấy kí tự đặc biệt đi :)) hoặc là nạp từ điển này cho đỡ cay: https://github.com/EPLHREU/emily-symbols
