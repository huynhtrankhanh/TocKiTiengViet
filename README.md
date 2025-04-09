# Bộ gõ tốc kí tiếng Việt
Bộ gõ này lấy cảm hứng cực mạnh từ https://github.com/user202729/plover_vi của anh [Bùi Hồng Đức](https://vietnam.vnanet.vn/vietnamese/tin-tuc/bui-hong-duc-chang-trai-vang-voi-diem-so-tuyet-doi-tai-olympic-tin-hoc-quoc-te-244171.html).

Để sử dụng bộ gõ này, ta cần phải
* Kiếm một bàn phím hỗ trợ NKRO (nhận nhiều phím cùng lúc)
  * Để kiểm tra, vô trang https://www.mechanical-keyboard.org/key-rollover-test/ rồi cố ấn nhiều phím xem thử nó nhận hết không. Nhớ đè nhiều phím vô nha.
  * Bàn phím cơ có khả năng cao đã có NKRO rồi, còn bàn phím mà ở trên laptop thì khả năng cao là không có NKRO.
* Cài Plover: https://github.com/openstenoproject/plover
* Cài plugin plover-python-dictionary: https://plover.readthedocs.io/en/latest/dict_formats.html#programmatic-dictionaries

Sau khi cài hai thứ này xong, tải file parse.py về rồi nạp vào.

Cơ chế ráp vần của bộ gõ này tuân theo quy tắc chính tả tiếng Việt. Để gõ một âm tiết, ta cần tách nó thành phụ âm đầu, âm đệm, nguyên âm, phụ âm cuối và thanh. Sau khi tách các phần xong, ta có thể xác định tổ hợp phím cần bấm.

## Phương pháp tách âm tiết thành các thành phần
Để xác định tổ hợp phím cần gõ cho một âm tiết tiếng Việt bằng bộ gõ tốc kí này, trước hết ta cần phân tích âm tiết đó thành 5 thành phần cơ bản theo cấu trúc ngữ âm và quy tắc chính tả tiếng Việt. Các thành phần này bao gồm:

1.  **Thanh điệu:** Là dấu thanh của âm tiết (sắc, huyền, hỏi, ngã, nặng). Nếu âm tiết không có dấu thanh, nó thuộc thanh ngang (không dấu). Thanh điệu thường được đặt trên hoặc dưới nguyên âm chính.
    * *Ví dụ:* Trong từ "tiếng", thanh điệu là thanh **sắc**. Trong từ "huyền", thanh điệu là thanh **huyền**. Trong từ "học", thanh điệu là thanh **nặng**. Từ "ba" có thanh **ngang**.

2.  **Phụ âm cuối:** Là phụ âm (hoặc bán nguyên âm) đứng cuối cùng của âm tiết, sau nguyên âm chính. Các phụ âm cuối trong tiếng Việt bao gồm *p, t, c, ch, n, m, ng, nh*. Ngoài ra, các bán nguyên âm cuối đóng vai trò như phụ âm cuối là *o/u* (như trong *ao, au, eo, êu, iu, ưu*) và *i/y* (như trong *ai, ay, oi, ôi, ơi, ui, ưi*).
    Trong hệ thống tốc kí này, dựa vào bảng Âm Cuối:
    * Âm cuối **o/u** được đại diện bởi mã 'w', gõ bằng tổ hợp phím **F**. Hàm `assemble` trong `parse.py` sẽ tự động quyết định dùng 'o' hay 'u' dựa vào nguyên âm chính đi trước (ví dụ: 'a' + 'w'/'F' -> "ao", nhưng 'ê' + 'w'/'F' -> "êu", 'ă' + 'w'/'F' -> "au").
    * Âm cuối **i/y** được đại diện bởi mã 'j', gõ bằng tổ hợp phím **FP**. Hàm `assemble` sẽ tự động quyết định dùng 'i' hay 'y' dựa vào nguyên âm chính đi trước (ví dụ: 'a' + 'j'/'FP' -> "ai", nhưng 'ă' + 'j'/'FP' -> "ay", 'â' + 'j'/'FP' -> "ây").
    * *Ví dụ:* Trong "bàn", phụ âm cuối là **n** (L). Trong "thích", phụ âm cuối là **ch** (RB). Trong "sông", phụ âm cuối là **ng** (G). Trong "kịp", phụ âm cuối là **p** (P). Trong "tay", âm cuối là **y** (dùng 'j'/FP kết hợp nguyên âm 'ă'/AE). Trong "tao", âm cuối là **o** (dùng 'w'/F kết hợp nguyên âm 'a'/A). Âm tiết "ba" không có phụ âm cuối.

3.  **Nguyên âm chính:** Là hạt nhân của âm tiết, có thể là nguyên âm đơn (a, ă, â, e, ê, i, o, ô, ơ, u, ư, y) hoặc nguyên âm đôi/ba (ai, ao, ưa, iê/ia, uô/ua, ươ/ưa,...). Khi tách, cần xác định nguyên âm gốc (không kèm dấu thanh). Lưu ý các biến thể như iê/ia, uô/ua, ươ/ưa phụ thuộc vào việc có phụ âm cuối hay không.
    * *Ví dụ:* Trong "tiếng", nguyên âm chính là **iê** (OEU). Trong "huyền", nguyên âm chính là **iê** (OEU), và âm tiết này có **âm đệm** (cần nhấn S trái). Trong "học", nguyên âm chính là **o** (O). Trong "ba", nguyên âm chính là **a** (A). Trong "tuân" (có âm đệm), nguyên âm chính là **â** (AO). Trong "chia", nguyên âm chính là **ia** (OEU).

4.  **Âm đệm:** Là bán nguyên âm /w/ xuất hiện ngay sau phụ âm đầu (nếu có) và trước nguyên âm chính. Trong chữ quốc ngữ, âm đệm thường được thể hiện bằng chữ 'o' (khi đi với a, ă, e, oe) hoặc 'u' (khi đi với các nguyên âm còn lại, và sau phụ âm 'q'). Trong bộ gõ này, sự có mặt của âm đệm được biểu thị bằng việc nhấn thêm phím **'S'** bên trái trong tổ hợp phím.
    * *Ví dụ:* Trong "hoa", "hòe", có âm đệm /w/ viết là **'o'** (cần nhấn S trái). Trong "tuần", "huệ", có âm đệm /w/ viết là **'u'** (cần nhấn S trái). Âm tiết "lan" không có âm đệm (không nhấn S trái).
    * Đặc biệt, các âm tiết bắt đầu bằng "qu-" trong tiếng Việt (ví dụ: "qua", "quê", "quý") luôn luôn có âm đệm /w/. Trong bộ gõ này, ta gõ chúng bằng cách kết hợp phím **K** (đại diện cho âm /k/ của chữ 'q') và nhấn thêm phím **S** bên trái (để biểu thị âm đệm /w/). Đây là quy ước của bộ gõ, dù cách phát âm có thể có khác biệt theo vùng miền.

5.  **Phụ âm đầu:** Là phụ âm đứng ở vị trí đầu tiên của âm tiết, trước âm đệm (nếu có) và nguyên âm chính. Có thể là phụ âm đơn (t, v, x,...) hoặc phụ âm ghép (ch, kh, ng/ngh, tr, gi,...). Một số âm tiết không có phụ âm đầu, bắt đầu trực tiếp bằng nguyên âm (ví dụ: "an", "yêu", "ông"). Lưu ý các biến thể chính tả như c/k/q, g/gh, ng/ngh phụ thuộc vào nguyên âm hoặc âm đệm đứng sau. Như đã đề cập ở phần Âm đệm, chữ 'q' (luôn đi với 'u') được xử lý bằng phím **K** + phím **S** trái.
    * *Ví dụ:* Trong "tiếng", phụ âm đầu là **t** (T). Trong "huyền", phụ âm đầu là **h** (H). Trong "học", phụ âm đầu là **h** (H). Trong "nghiêng", phụ âm đầu là **ngh** (TPW). Trong "qua", phụ âm đầu là /k/ được gõ bằng **K** (và có âm đệm S trái). Trong "yêu", không có phụ âm đầu.

**Quy trình tách âm tiết gợi ý:**

Ta có thể tách theo thứ tự sau:
1.  Xác định **Thanh điệu** (tra Bảng Thanh Điệu).
2.  Xác định **Phụ âm cuối** (tra Bảng Âm Cuối).
3.  Xác định **Nguyên âm chính** (sau khi bỏ dấu thanh và phụ âm cuối, tra Bảng Nguyên Âm).
4.  Xác định có **Âm đệm** hay không (dựa vào chữ 'o'/'u' sau phụ âm đầu, quy tắc với 'qu', hoặc nếu cần nhấn phím **S** bên trái).
5.  Xác định **Phụ âm đầu** (phần còn lại ở đầu âm tiết, nếu có, tra Bảng Âm Đầu).

Sau khi tách xong 5 thành phần này (một số thành phần có thể không có), ta có thể tra các bảng để tìm ra tổ hợp phím Plover tương ứng cần nhấn. **Hãy nhớ, nếu âm tiết có âm đệm, ta phải nhấn thêm phím 'S' ở bên trái vào tổ hợp phím.**

**Lưu ý về các trường hợp đặc biệt (ví dụ: "đau"/"đao", "thay"/"thai"):**

* **"đao" và "đau":**
    * "đao" = đ + ao = đ (TK) + a (A) + o/w (F). Tổ hợp phím: **TKAF**. (Logic: Nguyên âm 'a'/A + Âm cuối 'w'/F -> vần "ao").
    * "đau" = đ + au = đ (TK) + ă (AE) + u/w (F). Tổ hợp phím: **TKAEF**. (Logic: Nguyên âm 'ă'/AE + Âm cuối 'w'/F -> vần "au". Dùng phím AE cho 'ă' để tạo ra âm cuối 'u' thay vì 'o').

* **"thai" và "thay":**
    * "thai" = th + ai = th (TH) + a (A) + i/j (FP). Tổ hợp phím: **THAFP**. (Logic: Nguyên âm 'a'/A + Âm cuối 'j'/FP -> vần "ai").
    * "thay" = th + ay = th (TH) + ă (AE) + y/j (FP). Tổ hợp phím: **THAEFP**. (Logic: Nguyên âm 'ă'/AE + Âm cuối 'j'/FP -> vần "ay". Dùng phím AE cho 'ă' để tạo ra âm cuối 'y' thay vì 'i').

## Ráp thành tổ hợp phím

**Đầu tiên, nếu có âm đệm thì nhớ nhấn phím S ở bên trái trong tổ hợp phím.** Sau đó, với những thành phần khác của âm tiết, xem các bảng sau:

**Bảng Âm Đầu**

| Tổ hợp phím | Âm Tiếng Việt |
| :---------- | :------------ |
| PW          | b             |
| K           | c             |
| KH          | ch            |
| KWR         | d             |
| TK          | đ             |
| TP          | ph            |
| TKPW        | g             |
| H           | h             |
| KWH         | gi            |
| KHR         | kh            |
| HR          | l             |
| PH          | m             |
| TPH         | n             |
| TPR         | nh            |
| TPW         | ng/ngh        |
| P           | p             |
| R           | r             |
| KP          | s             |
| T           | t             |
| TH          | th            |
| TR          | tr            |
| W           | v             |
| WR          | x             |

**Bảng Nguyên Âm**

| Tổ hợp phím | Nguyên Âm Tiếng Việt |
| :---------- | :------------------ |
| OEU         | iê/ia               |
| AEU         | ua/uô               |
| AOE         | ưa/ươ               |
| AOU         | ư                   |
| OU          | ơ                   |
| OE          | ô                   |
| O           | o                   |
| AU          | ê                   |
| E           | e                   |
| EU          | i                   |
| A           | a                   |
| AE          | ă                   |
| AO          | â                   |
| U           | u                   |
| AOEU        | y                   |

**Bảng Âm Cuối**

| Tổ hợp phím | Âm Cuối Tiếng Việt |
| :---------- | :---------------- |
| FP          | j                 |
| F           | w                 |
| P           | p                 |
| R           | t                 |
| BG          | c                 |
| RB          | ch                |
| PB          | nh                |
| L           | n                 |
| PL          | m                 |
| G           | ng                |

**Bảng Thanh Điệu**

| Tổ hợp phím | Thanh Điệu Tiếng Việt |
| :---------- | :------------------- |
| T           | sắc                  |
| S           | huyền                |
| D           | hỏi                  |
| TS          | ngã                  |
| Z           | nặng                 |

# Gõ số
**Với những người dùng bàn phím bình thường:**
* Cứ gõ nó như lâu nay thôi, trên bàn phím QWERTY dùng phím gì cho số thì khi gõ tốc kí vẫn dùng phím đó.
* Cấu hình Plover mặc định nó gán hết mấy phím số thành phím #. Vô phần Configure, chọn Machine, chọn Keyboard rồi sửa Keymap, xóa hết mấy cái dấu # đi.
* Tại vì cái bộ gõ này có dùng phím # để viết hoa chữ cái đầu (xem phần sau), nên gán phím Q trên bàn phím QWERTY thành phím #. Vậy cho nó tiện.

**Với những người đã tốn tiền mua bàn phím tốc kí chuyên dụng:** nạp từ điển này: https://github.com/StenoHarri/Harri_numbers

# Viết hoa chữ cái đầu
Để viết hoa chữ cái đầu, ta bấm giữ thêm phím # trong tổ hợp phím.

# Gõ các kí tự đặc biệt
**Với những người dùng bàn phím bình thường:**
* Cứ gõ nó như lâu nay thôi, trên bàn phím QWERTY dùng phím gì cho kí tự đặc biệt thì khi gõ tốc kí vẫn dùng phím đó.
* Cấu hình Plover mặc định có vô hiệu hóa một số phím trên bàn phím. Vô phần Configure, chọn Machine, chọn Keyboard rồi sửa Keymap, xóa hết mấy cái no-op.

**Với những người đã tốn tiền mua bàn phím tốc kí chuyên dụng:** thôi cố tự định nghĩa tổ hợp phím cho mấy kí tự đặc biệt đi :)) hoặc là nạp từ điển này cho đỡ cay: https://github.com/EPLHREU/emily-symbols
