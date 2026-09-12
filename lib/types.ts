/**
 * ZONE 27 · 決策引擎型別
 *
 * 設計原則：
 * 1. 規格（spec）是靜態的，幾年不變 → 存在 repo 的 JSON，建置時直接讀
 * 2. 價格是易變的，但我們「不爬」→ 人工複查 + 誠實顯示 checkedAt 時間戳
 * 3. 引擎的輸出不只是「留下誰」，更重要的是「為什麼刪掉別人」
 */

/** 蛋白質來源。過敏排除的主要依據。 */
export type ProteinSource =
  | "chicken" | "beef" | "lamb" | "salmon" | "whitefish"
  | "duck" | "turkey" | "pork" | "venison" | "insect"
  /**
   * 成分表只寫「禽肉」「家禽肉類及副產品」，沒有指明是哪一種鳥。
   *
   * 這在平價糧非常常見，而且對排查過敏原的人是致命的 ——
   * 你不可能從標示上排除雞肉，因為它根本沒說。
   * 所以只要使用者要避開任何一種禽類，含這個的一律排除。
   */
  | "poultry"
  /**
   * 鮭魚、白魚以外的魚：沙丁魚、鯖魚、鯡魚、鮪魚這些。
   *
   * 貓飼料裡的魚種類比狗飼料多很多，全塞進 whitefish 會讓「白魚」
   * 這個字變成謊話。使用者說「對魚過敏」時，三種魚一起排除。
   */
  | "fish"
  /**
   * 成分表只寫「水解動物蛋白」「動物性蛋白」，連是哪一類動物都沒說。
   *
   * 比 poultry 更糟：poultry 至少知道是鳥，這個什麼都可能。
   * 所以使用者要避開任何一種肉，含這個的一律排除。
   */
  | "animal";

/**
 * 生命階段。puppy 在程式裡代表「幼年期」，狗是幼犬、貓是幼貓。
 * 名字不改是因為狗飼料的資料和網址早就用了這個字，改了只會多一堆遷移。
 * 畫面上的中文一律照物種換。
 */
export type LifeStage = "puppy" | "adult" | "senior" | "all";
export type BodySize = "small" | "medium" | "large";
export type Species = "dog" | "cat";

/**
 * 乾糧還是罐頭。
 *
 * 同一隻貓可以吃乾糧也可以吃罐頭，所以「類目」不等於「物種」。
 * 引擎第一刀按物種分，第二刀按這個分：問罐頭的人，不會拿到一包乾糧。
 * 沒填就是乾糧，狗飼料、貓飼料的資料不用改。
 */
export type Form = "dry" | "wet";

/** 商品規格。這一層是引擎判斷的依據，全部要可比較。 */
export interface Spec {
  /** 粗蛋白 % */
  protein: number;
  /** 粗脂肪 % */
  fat: number;
  /** 碳水化合物 %（建議 < 25） */
  carb: number;
  /** Omega-3 %。皮毛與關節相關。 */
  omega3: number;
  /** 磷 %。腎臟問題的關鍵指標。 */
  phosphorus: number;
  proteinSources: ProteinSource[];
  /** 單一蛋白源 = 過敏排查時最容易鎖定變因 */
  singleSource: boolean;
  grainFree: boolean;
  /**
   * 豆類（豌豆、扁豆、鷹嘴豆、各種 bean）在成分表前段的份量。
   *
   * 為什麼要記這個而不是只記無穀：
   *
   * 2018 年 FDA 開始調查無穀飼料跟犬隻擴張性心肌病（DCM）的關聯，
   * 2022 年 12 月結束，說沒有證據支持因果關係。但獸醫營養學界
   * （塔夫茨大學 2026 年 6 月的整理）的立場是：飲食相關的 DCM 是
   * 有紀錄的病例類型，三十幾篇研究，機轉還沒查清楚 —— 而且指向的
   * 不是「無穀」，是**豆類含量高**，含穀的飼料一樣可能豆類很高。
   *
   * 所以「無穀」這個欄位其實回答不了飼主真正該問的問題。
   * 這一欄才回答得了，而且台灣沒有人在標。
   *
   * high    = 成分表前段就出現豆類
   * low     = 有豆類（含黃豆粉），但排在油脂後面、份量不大
   * none    = 成分表裡沒有豆類（或品牌明確標示不含）
   * unknown = 還沒查。空著也不假裝。
   */
  pulses?: "high" | "low" | "none" | "unknown";
  lifeStage: LifeStage[];
  bodySize: BodySize[];
  /** 處方飼料需獸醫指示，引擎必須另外標記 */
  prescription: boolean;
  /**
   * 代謝能（大卡／公斤），包裝或官網有公布才填。
   *
   * 一天吃幾克是用熱量換算的。沒有這個數字只能拿 3,800 當中間值，
   * 但貓飼料從 3,400 到 4,400 都有，差到兩成多：
   * 同一隻 4 公斤的貓，一包 1.8 公斤可能吃 26 天，也可能吃 33 天。
   *
   * 罐頭一樣是每公斤（連水一起算），所以數字只有乾糧的四分之一上下。
   */
  kcal?: number;

  /* ---------------- 下面這幾欄只有罐頭有 ---------------- */

  /**
   * 主食罐（true）還是副食罐（false）。
   *
   * 副食罐是點心：鈣、牛磺酸、維生素沒有補齊，當正餐長期吃會出事。
   * 台灣很多人把「看得到肉絲」的湯罐當一餐，那多半是副食。
   * 這是罐頭類目的第一刀。
   */
  complete?: boolean;
  /** 水分 %，包裝上的數字 */
  moisture?: number;
  /**
   * 包裝上印的原始數字（原物基，連水一起算）。
   *
   * 罐頭的 protein、fat、carb、phosphorus、omega3 存的是扣掉水分之後的乾物基，
   * 不同水分的罐頭才比得起來。但畫面上要給讀者看的是罐子背面那個數字，
   * 他翻過來對得上，才會信我們。
   */
  asFed?: { protein: number; fat: number; fiber?: number; ash?: number; phosphorus?: number; carb?: number };
  /**
   * 碳水怎麼來的。
   *
   * published = 品牌自己公布
   * computed  = 用 100 減掉其他成分算的（包裝上蛋白、脂肪、纖維、灰分、水分都有）
   * unknown   = 包裝沒寫灰分，算不出來
   *
   * 罐頭的營養標示多半是保證值（蛋白質「最少」、水分「最多」），
   * 缺一個灰分硬去減，扣掉水分之後誤差會放大好幾倍。算不準的就不算。
   */
  carbBasis?: "published" | "computed" | "unknown";
}

/** 使用者回報。護城河 L2：這些數字爬不到，只能累積。 */
export interface Reports {
  /** 有效回報總數 */
  total: number;
  /** 反映適口性差的人數 */
  palatability: number;
  /** 反映軟便的人數 */
  looseStool: number;
}

/** 一個通路的售價與分潤連結。批次一次性產生，寫死在資料裡。 */
export interface Merchant {
  id: string;
  /** 顯示名稱，例如「官方旗艦館」 */
  label: string;
  amount: number;
  /** 給使用者看的差異，例如「15 天鑑賞」「4,200 則好評」 */
  note: string;
  /** 分潤連結。永遠不直接吐給前端，走 /go/ 端點。 */
  affiliateUrl: string;
  /** 錨點角色：安心 / 省錢 */
  anchor: "safe" | "value";
  /**
   * 這個通路賣的規格。沒填就沿用 price.unit。
   * 大包裝當「最省」時規格不同（4.5磅 vs 24磅），每公斤要各算各的。
   */
  unit?: string;
  /**
   * 這個賣場的連結失效了（下架、賣家關店、分潤連結過期）。
   *
   * 商品層級有 discontinued，那是「這款停產了」；這個是「這一家不能買了」。
   * 兩者要分開 —— 一家下架不代表這款買不到，換一家就好。
   *
   * 引擎完全跳過標記為 dead 的賣場：不排錨點、不算省幅、不做購買按鈕。
   * 一款商品所有賣場都 dead，它就不會出現在裁決結果裡。
   */
  dead?: boolean;
  /**
   * 這條連結跟另一款商品，其實落在同一個蝦皮商品頁。
   *
   * 短網址長得不一樣，看不出來。連結健檢（npm run links:check）會記下每條連結
   * 轉到哪個「賣場編號/商品編號」，匯入時對到兩款共用同一頁，就標上這個。
   * 畫面會在購買按鈕旁邊提醒讀者自己選對規格。
   * 例：歐睿健「鮮雞愛貓」和「鮮雞幼貓」在同一家是同一頁，名字只差一個字。
   */
  sharedPage?: boolean;
}

export interface Price {
  unit: string;
  /** 人工複查日期 YYYY-MM-DD。誠實顯示，不假裝即時。 */
  checkedAt: string;
  merchants: Merchant[];
}

export interface Product {
  id: string;
  species: Species;
  /** 沒填就是乾糧 */
  form?: Form;
  brand: string;
  name: string;
  spec: Spec;
  reports: Reports;
  price: Price;
  /** 這款的絕對紅線。卡片上最醒目的那一行。 */
  dealbreaker: string;
  /**
   * 飼主常提到的狀況，整理自公開評價與討論區。
   *
   * 這比「142 位中有 31 位反映適口性差」誠實 —— 那種數字我們拿不到，
   * 硬編就是說謊。質性描述查得到、標得出來源、而且更有用：
   * 「顆粒偏大，小型犬可能不好咬」比一個百分比實用得多。
   */
  knownIssues?: string;
  /** 停產或長期缺貨 → 引擎直接排除 */
  discontinued?: boolean;
  /**
   * 對照款：放進來是為了讓「刪掉」這件事有東西可刪，不是為了推薦。
   *
   * 這個站的說服力來自排除過程。但如果選品全是同一種好東西，
   * 任何規則都刪不到人，那張「怎麼刪的」就是一張空表 ——
   * 使用者什麼也沒學到。
   *
   * 所以主流雞肉配方、平價高碳水糧、大型犬專用這些「會被刪掉的」
   * 必須在池子裡。它們多半在前面幾刀就被砍掉；萬一撐到最後，
   * 引擎會用最後一刀把它砍掉，理由是「目前沒有我們查證過的購買通路」——
   * 那是實話，而且等通路查好了，這個旗標拿掉它就變成正常商品。
   */
  referenceOnly?: boolean;
  /**
   * 選好了、規格查好了、文案寫好了 —— 只差分潤連結。
   *
   * 跟 referenceOnly 是兩回事：對照款是**故意不賣**的，
   * 這個是**想賣但還拿不到連結**。分開才知道待辦是什麼：
   * 前者不用管，後者是一張採購清單。
   *
   * 引擎對兩者一視同仁（沒有通路就不能推），差別只在維護台上怎麼列。
   */
  awaitingLink?: boolean;
  /**
   * 在台灣通路實際會搜到的字串。
   *
   * 加這一欄是因為踩過坑：選品的時候用北美產品線挑，
   * 結果挑了一款台灣沒進的配方，Tim 在蝦皮找不到。
   * 台灣通路的商品名跟原廠配方名經常對不上（「六種魚」在台灣
   * 也寫成「無穀六種鮮魚犬」），所以選品當下就要把台灣的說法記下來，
   * 順便逼自己確認「這款台灣到底有沒有賣」。
   */
  searchAs?: string;
  /**
   * 一個台灣通路實際上架這個 SKU 的頁面網址。
   *
   * 這一欄是罰單。連續三次讓 Tim 去蝦皮找一款不存在的東西之後訂的規矩：
   *
   *   1. ACANA 豬肉+南瓜 —— 北美有，台灣沒進
   *   2. ORIJEN 幼犬 —— 台灣改名叫歐睿健，我給了搜不到的舊名
   *   3. ORIJEN 老犬 —— 台灣根本沒進
   *
   * 三次的根源都一樣：我把「這個詞出現在某個頁面上」當成「台灣買得到」。
   * momo 一個標題寫著「幼犬 成犬 老犬 室內犬」的多規格商品，
   * 不能證明老犬那個 SKU 有進。
   *
   * 新標準：**指得出一個台灣通路的頁面，上面有這個 SKU 和價格**，
   * 才可以放進待補清單。指不出來就不要放 —— 讓人白跑一趟的成本，
   * 比少收一款高得多。
   *
   * 這個網址只給我們自己用，**網站上任何地方都不能顯示或連出去**。
   * 它是別家通路的頁面，讀者點過去在那裡買，Tim 一毛都拿不到（2026-09-12 抓到過一次）。
   * 所以它只留在 CSV，匯入程式不寫進 JSON；scripts/outbound-check.ts 會在 build 後檢查。
   */
  twSource?: string;
}

/* ------------------------------------------------------------------ */
/* 約束                                                                */
/* ------------------------------------------------------------------ */

/**
 * 一條約束 = 一條排除規則。
 * label 是給人看的（會出現在裁決過程），tag 是那條規則的來源。
 */
export type Constraint =
  /** also：同一刀要一起刪的其他來源，例如「魚」= fish + salmon + whitefish */
  | { kind: "excludeProtein"; value: ProteinSource; also?: ProteinSource[]; label: string; tag: string }
  | { kind: "minProtein"; value: number; label: string; tag: string }
  | { kind: "maxCarb"; value: number; label: string; tag: string }
  | { kind: "maxPhosphorus"; value: number; label: string; tag: string }
  | { kind: "lifeStage"; value: LifeStage; label: string; tag: string }
  | { kind: "bodySize"; value: BodySize; label: string; tag: string }
  | { kind: "singleSourceOnly"; label: string; tag: string }
  | { kind: "grainFreeOnly"; label: string; tag: string }
  | { kind: "inStock"; label: string; tag: string }
  /** 罐頭：副食罐刪掉 */
  | { kind: "completeOnly"; label: string; tag: string }
  /**
   * 預算。kcalPerDay 有值就是罐頭：一天要吃掉幾罐才算得出一個月多少錢，
   * 拿一罐的價錢去跟月預算比，每一款都會過。
   */
  | { kind: "maxMonthly"; value: number; kcalPerDay?: number; label: string; tag: string };

/** 使用者的情境。自然語言入口會翻譯成這個。 */
export interface Situation {
  species: Species;
  /** 問的是乾糧還是罐頭。沒填就是乾糧 */
  form?: Form;
  /** 顯示用，例如「柴犬」 */
  breed?: string;
  /**
   * 品種推出來的體型。
   *
   * parse() 本來就算出來了，但一直沒放進 situation —— 算完就丟掉，
   * 所以「大型犬專用配方」那條規則對裁決器完全沒有作用，
   * 只有長尾頁走得到。跟物種那個 bug 是同一類：畫面說讀到了，程式沒用。
   */
  bodySize?: BodySize;
  ageYears?: number;
  weightKg?: number;
  /** 已經標記為過敏或想避開的蛋白源 */
  avoid: ProteinSource[];
  /** 使用者自己講的症狀，原文保留 */
  symptoms: string[];
  budgetMonthly?: number;
  constraints: Constraint[];
}

/* ------------------------------------------------------------------ */
/* 裁決結果                                                            */
/* ------------------------------------------------------------------ */

/** 一次排除。這是產品的靈魂 —— 使用者看的是這個，不是留下來那幾款。 */
export interface Cut {
  /** 這條規則刪掉幾款 */
  count: number;
  /** 給人看的理由，例如「主蛋白源含雞肉」 */
  why: string;
  /** 這條規則的來源，例如「你標記的過敏原」 */
  tag: string;
  /** 被刪掉的商品 id，供稽核與「為什麼沒有 X」查詢 */
  ids: string[];
}

/**
 * 硬停止：這一題我們不該賣你東西。
 *
 * 跟「條件太嚴格，沒有一款符合」不一樣 —— 那是選品不夠，
 * 這是**我們不該回答**。物種不對、或獸醫已經給了醫療條件而我們手上
 * 沒有一款符合，硬推一個就是拿別人的動物去換佣金。
 *
 * stop 一設，畫面上就不出現任何商品卡片。不是收起來，是不顯示。
 */
export interface Stop {
  /**
   * species  = 這個物種我們沒有飼料
   * soon     = 這個類目還在上架，成分表讀完了、購買連結還沒補齊
   * renal    = 腎臟，要跟著獸醫走
   * urinary  = 泌尿道，公貓尿不出來是急診
   * diabetes = 糖尿病，飲食跟用藥綁在一起
   */
  kind: "species" | "soon" | "renal" | "urinary" | "diabetes";
  /** 有值就在畫面上多一顆按鈕，例如「先看我們查到的 15 款」 */
  link?: { href: string; label: string };
  title: string;
  /** 為什麼我們不回答，要講得出根據 */
  body: string;
  /** 那他現在該做什麼 */
  next: string;
}

export interface Verdict {
  /** 進入裁決的總數 */
  startCount: number;
  /** 依序套用的排除，順序即畫面上的順序 */
  cuts: Cut[];
  survivors: Product[];
  /** 引擎推薦的那一款。可能為 null（全被刪光）。 */
  pick: Product | null;
  /** 為什麼是它 —— 一句話，給人看的 */
  pickReason: string;
  /** 有值就代表這一題我們不回答，畫面上不出現商品 */
  stop?: Stop;
  /** 有商品可推，但有一句話一定要先講（例如腎臟要跟著獸醫走） */
  notice?: string;
  /**
   * 讀到了、但我們手上沒有資料可以據此判斷的訊號。
   *
   * 這一欄的存在是為了不再犯同一個錯：畫面上跳出一個 chip，
   * 使用者以為我們考慮過了，實際上程式碼裡沒有任何一行用到它。
   * 用不到就要講出來，不要靜靜吞掉。
   */
  unusedSignals?: string[];
}
