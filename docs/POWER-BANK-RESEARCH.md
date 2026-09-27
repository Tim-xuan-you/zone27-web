# 行動電源：開類目前的研究筆記（2026-09-27）

只寫官方來源讀到的。沒讀到的寫「沒寫」。

## 搭飛機（民航局）

- 2026-04-02 公告、04-08 生效：每人最多帶 2 個；飛行途中不能用、也不能充行動電源；只能手提，不能託運
  來源：https://www.caa.gov.tw/NewsPublish-Content.aspx?a=381&nid=2547&lang=1
- 100Wh／160Wh 的門檻：各家旅遊、賣場文章都這樣寫，**還沒在民航局自己的頁面讀到原文**（危險物品頁的海報是圖／PDF）。上網站前要讀到

## 「背面」的發現

1. **同一個牌子、同一個 10000mAh，額定容量寫法不一樣**
   - 小米 行動電源 10000 22.5W（PB100DPDZM）：電池 37Wh 3.7V 10000mAh；額定容量 5500mAh（5V/3A）
   - 小米 行動電源 10000 22.5W Lite（P16ZM）：電池（額定／一般）35.15Wh／37Wh、9500mAh／10000mAh；額定容量 5500mAh（5V/3A）；轉換率 74%（5V/3A）
   - 小米 自帶線 20000 22.5W（PB2020MI）：電池 20000mAh 3.7V 74Wh；額定容量 13000mAh（5V）
   → 包裝大字的 mAh 是電池本身（3.7V），手機拿到的是 5V 的，背面的額定容量才接近真的。**各家寫法不統一，不能一句話套全部**
2. **寫 22.5W，iPhone 只拿得到 20W**：小米那幾顆的 22.5W 是 10V⎓2.25A（不是 USB PD），USB PD 最高 9V⎓2.23A（20W）
3. **寫 45W，兩條一起插只剩 22.5W**：Anker Nano 10000 45W（A1638）官網：自帶線＋USB-C 孔一起用，總共 22.5W（線 15W、孔 7.5W）；三個一起用各 7.5W
4. **三星 25W 無線行動電源（EB-U2510）**：25W 只有接一台的時候；兩台有線各 10W；再加無線各 7.5W（三星英國／香港官網）

## 已讀到的官方規格

| 型號 | 電池 | 額定（5V） | 單孔最高 | 一起插 | 其他 |
|---|---|---|---|---|---|
| 小米 PB100DPDZM | 37Wh | 5500mAh | C／A 各 22.5W（PD 20W） | 三個一起 5V⎓3A | 147.8×73.9×15.3mm |
| 小米 P16ZM（Lite） | 35.15／37Wh | 5500mAh | 同上 | 同上 | 轉換率 74%；148.4×73×15mm |
| 小米 PB2020MI 自帶線 20000 | 74Wh | 13000mAh | 線／C／A 各 22.5W（PD 20W） | 多孔 5V⎓3A | 342g；128×73×32mm |
| Anker A1638 Nano 10K 45W 自帶伸縮線 | 官網沒寫 Wh（momo 標 36Wh，不是官方） | 沒寫 | 線、C 各 45W（PD 20V⎓2.25A）；A 22.5W | 線＋C：15＋7.5；三孔各 7.5 | 官方：iPhone 17 系列最高 40W 快充、三星最高 45W；BSMI R45351；台灣官網 $1,690 |
| Samsung EB-U2510 | 沒讀到 | 英國頁寫約 6,300mAh 可輸出（待確認） | 有線 25W（只有一台時） | 兩台各 10W；加無線各 7.5W | 有無線充 |

來源：
- https://www.mi.com/tw/product/xiaomi-22-5w-power-bank-10000/specs/
- https://www.mi.com/tw/product/xiaomi-power-bank-10000mah-22w-lite/specs/
- https://www.mi.com/tw/product/xiaomi-power-bank-20000/specs/
- https://www.anker.com/products/a1638-10k-45w-power-bank 、https://www.anker.tw/ANKER/moreinfo_177811.htm
- https://www.samsung.com/uk/mobile-accessories/25w-wireless-battery-pack-10-000mah-beige-eb-u2510xuegeu/

## 蝦皮上大家在買的（比價站熱門，2026-09-27）

磁吸 Qi2 的很多（Anker MagGo A1664、AUKEY MagFusion、Belkin Qi2 25W），標題常寫「具 Wh 標示」「可以上飛機」。
v1 先做有線（引擎直接沿用充電器那一套）；磁吸的無線速度要另外建裝置資料，v2 再做。

## 做法

- 沿用充電器的裝置清單和引擎（fit／rank）：行動電源就是「有電池的充電器」
- 讀者一進來：點手機 → 給一顆（多少錢、插上去多快、多重、可不可以帶上飛機）
- 商品頁「背面」：包裝寫幾 mAh、背面額定容量多少、Wh；寫幾 W、你的手機實際拿到幾 W
- 不寫「可以充幾次」：手機電池容量 Apple 官方沒公布，算不出可驗證的數字（品牌自己寫的才引用）
