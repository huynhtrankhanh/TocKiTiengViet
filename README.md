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
[lười quá, để mai tính]

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
