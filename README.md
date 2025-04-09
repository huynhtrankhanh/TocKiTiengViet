# Bộ gõ tốc kí tiếng Việt
Bộ gõ này lấy cảm hứng cực mạnh từ https://github.com/user202729/plover_vi của anh [Bùi Hồng Đức](https://vietnam.vnanet.vn/vietnamese/tin-tuc/bui-hong-duc-chang-trai-vang-voi-diem-so-tuyet-doi-tai-olympic-tin-hoc-quoc-te-244171.html).

Để sử dụng bộ gõ này, ta cần phải
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
