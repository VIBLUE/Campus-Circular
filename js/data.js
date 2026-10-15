/* =========================================================
   ข้อมูลสินค้าตัวอย่าง (ข้อความดึงมาจากการ์ด + หน้ารายละเอียดใน Figma)
   ถ้าจะเพิ่มของใหม่ ก็แค่เพิ่ม object ลงใน array นี้
   ---------------------------------------------------------
   mode     : give | sell | swap | lend | rent
   category : book | clothes | electronics | furniture | sport
   distance : ระยะทางเป็นเมตร (ใช้กรองด้วยสไลเดอร์ + เรียงลำดับ)
   note     : ข้อความสีด้านล่างการ์ด, noteColor = สีของข้อความนั้น
   --- ใช้ในหน้ารายละเอียด (product.html) ---
   gallery  : รูปทั้งหมด (รูปแรก = รูปใหญ่)
   desc     : คำอธิบาย 2 บรรทัด
   posted / likes / condition / pickup / reduce / price
   ========================================================= */
const CATEGORY_LABEL = {
  book: "หนังสือและเอกสาร",
  clothes: "เสื้อผ้าและเครื่องแต่งกาย",
  electronics: "อุปกรณ์อิเล็กทรอนิกส์",
  furniture: "เฟอร์นิเจอร์หอพัก",
  sport: "อุปกรณ์กีฬา"
};

const MODE_LABEL = {
  give: "Give - ส่งต่อ",
  sell: "Sell - ขาย",
  swap: "Swap - แลกเปลี่ยน",
  lend: "Lend - ยืม",
  rent: "Rent - เช่า"
};

// ผู้ลงของ (ในดีไซน์เป็นคนเดียวกันทุกชิ้น)
const SELLER = {
  name: "กิตติ บุตรแห่งโอดิน",
  avatar: "images/seller.png",
  rating: 4.8,
  deals: 12,
  closet: ["images/closet-shirt.png", "images/closet-watch.png", "images/closet-bag.png"]
};

const ITEMS = [
  {
    id: 1, title: "ชุดนักศึกษาชาย ไซส์ M", img: "images/p-shirt.png",
    mode: "give", tag: "Give - ส่งต่อฟรี", chip: "cotton",
    category: "clothes", place: "คณะบริหารธุรกิจ", distance: 400,
    note: "ลดขยะได้ 0.4 kg", noteColor: "#2b9d25",
    gallery: ["images/d-shirt.png", "images/t-shirt-front.png", "images/t-shirt-purple.png", "images/t-shirt-set.png"],
    desc: ["ใส่มา 2 เทอม ซักรีดเรียบร้อย ไม่มีรอยตำหนิ กระดุมครบ เหมาะกับน้องปี 1 ที่ยังไม่ได้ซื้อ", "รับได้ที่โรงอาหารกลางทุกวันพุธ"],
    posted: "2 ชั่วโมงที่แล้ว", likes: 4, condition: "สภาพดี",
    pickup: "โรงอาหารกลาง ชั้น 1", reduce: "0.4 กก. · 6.0 kgCO2e"
  },
  {
    id: 2, title: "แคลคูลัส 1", img: "images/p-calculus.png",
    mode: "lend", tag: "Lend - ยืมได้ 7 วัน", chip: "cotton",
    category: "book", place: "ตึกวิศวกรรมศาสตร์", distance: 700,
    note: "ตรงกับวิชา ENG 101 ที่คุณลงทะเบียน", noteColor: "#ff4c00",
    code: "ENG-101",
    gallery: ["images/d-calculus.png", "images/p-calculus.png"],
    desc: ["หนังสือแคลคูลัส 1 สภาพใหม่ ไม่ค่อยได้อ่านเพราะเก่งอยู่แล้ว", "รับได้ที่คณะวิทยาศาสตร์และเทคโนโลยีทุกวันพฤหัส"],
    posted: "4 ชั่วโมงที่แล้ว", likes: 10, condition: "สภาพดี",
    pickup: "คณะวิทยาศาสตร์และเทคโนโลยี ชั้น 1", reduce: "0.2 กก. · 4.0 kgCO2e"
  },
  {
    id: 3, title: "ชุดครุยรับปริญญา ไซส์ L", img: "images/p-gown.png",
    mode: "lend", tag: "Lend - ยืมได้ 3 วัน", chip: "cotton",
    category: "clothes", place: "หอพักนักศึกษา", distance: 1100,
    note: "มัดจำ 300 บาท คืนเต็มจำนวน", noteColor: "#ff4c00",
    gallery: ["images/p-gown.png"],
    desc: ["ชุดครุยไซส์ L ให้ยืมได้ 3 วัน", "มัดจำ 300 บาท คืนเต็มจำนวนเมื่อส่งคืน"],
    posted: "2 ชั่วโมงที่แล้ว", likes: 4, condition: "สภาพดี",
    pickup: "หอพักนักศึกษา", reduce: "0.6 กก. · 8.0 kgCO2e"
  },
  {
    id: 4, title: "หนังสือฟิสิกส์ 2 แลกเคมี 1", img: "images/p-physics.png",
    mode: "swap", tag: "Swap แลกเปลี่ยน", chip: "cotton",
    category: "book", place: "คณะวิทยาศาสตร์", distance: 550,
    note: "คุณมีของที่เขาอยากได้ 1 ชิ้น", noteColor: "#8514ff",
    gallery: ["images/d-physics.png", "images/p-physics.png"],
    desc: ["ซื้อมาเพราะคิดว่ามหาลัยไม่แจก สภาพยังดีอยู่", "รับได้ที่โรงอาหารกลางทุกวันศุกร์"],
    posted: "1 ชั่วโมงที่แล้ว", likes: 2, condition: "สภาพดี",
    pickup: "คณะวิศวกรรมศาสตร์ ชั้น 1", reduce: "0.2 กก. · 4.0 kgCO2e"
  },
  {
    id: 5, title: "หนังสือ English Grammar", img: "images/p-english.png",
    mode: "swap", tag: "Swap แลกเปลี่ยน", chip: "cotton",
    category: "book", place: "คณะวิทยาศาสตร์", distance: 550,
    note: "New", noteColor: "#c400b0",
    gallery: ["images/d-english.png", "images/p-english.png"],
    desc: ["ซื้อมาเพราะคิดว่ามหาลัยไม่แจก สภาพยังดีอยู่", "รับได้ที่โรงอาหารกลางทุกวันศุกร์"],
    posted: "13 ชั่วโมงที่แล้ว", likes: 22, condition: "สภาพดี",
    pickup: "คณะวิทยาศาสตร์และเทคโนโลยี ชั้น 1", reduce: "0.2 กก. · 4.0 kgCO2e"
  },
  {
    id: 6, title: "หนังสือ คู่มืออาชีพ UX/UI Designer", img: "images/p-uxui.png",
    mode: "rent", tag: "Rent - 1day / 20 บาท", chip: "cotton",
    category: "book", place: "หอพักนักศึกษา", distance: 2200,
    note: "ตรงกับวิชา UI 101 ที่คุณลงทะเบียน", noteColor: "#c400b0",
    code: "UI-101", price: "1 วัน / 20 บาท",
    gallery: ["images/d-uxui.png", "images/p-uxui.png"],
    desc: ["ซื้อมาเพราะคิดว่ามหาลัยไม่แจก สภาพยังดีอยู่", "รับได้ที่คณะเทคโนโลยีสื่อสารมวลชนทุกวัน"],
    posted: "11 ชั่วโมงที่แล้ว", likes: 29, condition: "สภาพดี",
    pickup: "คณะเทคโนโลยีสื่อสารมวลชน ชั้น 1", reduce: "0.2 กก. · 4.0 kgCO2e"
  },
  {
    id: 7, title: "เมาส์ Logitech M240 SILENT", img: "images/p-mouse.png",
    mode: "give", tag: "Give - มีค่าส่ง", chip: "cotton",
    category: "electronics", place: "หอพักนักศึกษา", distance: 3400,
    note: "อุปกรณ์อิเล็กทรอนิกส์", noteColor: "#2c9f26",
    gallery: ["images/d-mouse.png", "images/p-mouse.png"],
    desc: ["ซื้อมาใช้แค่ 2 อาทิตย์ แล้วก็เปลี่ยนเป็นอันใหม่ เลยอยากปล่อยต่อ", "รับได้ที่คณะเทคโนโลยีสื่อสารมวลชนทุกวัน"],
    posted: "11 ชั่วโมงที่แล้ว", likes: 29, condition: "สภาพดี",
    pickup: "คณะเทคโนโลยีสื่อสารมวลชน ชั้น 1", reduce: "0.1 กก. · 1.5 kgCO2e"
  },
  {
    id: 8, title: "ดินสอ 2B", img: "images/p-pencil.png",
    mode: "sell", tag: "Sell - 10 บาท/แท่ง", chip: "cotton",
    category: "book", place: "คณะบริหารธุรกิจ", distance: 400,
    note: "อุปกรณ์ในการสอบ", noteColor: "#1100ff",
    price: "10 บาท / แท่ง",
    gallery: ["images/d-pencil.png", "images/p-pencil.png"],
    desc: ["ซื้อมาทำโปรเจค แต่ซื้อมาเยอะเกิน", "รับได้ที่คณะเทคโนโลยีสื่อสารมวลชนทุกวัน"],
    posted: "11 ชั่วโมงที่แล้ว", likes: 29, condition: "สภาพดี",
    pickup: "คณะเทคโนโลยีสื่อสารมวลชน ชั้น 1", reduce: "0.9 กก. · 10.0 kgCO2e"
  },
  {
    id: 9, title: "ชั้นวางของลายไม้โอ๊คสีขาว", img: "images/p-shelf.png",
    mode: "sell", tag: "Sell - 1200 บาท", chip: "cotton",
    category: "furniture", place: "คณะบริหารธุรกิจ", distance: 400,
    note: "เฟอร์นิเจอร์หอพัก", noteColor: "#1100ff",
    price: "1,200 บาท",
    gallery: ["images/d-shelf.png", "images/p-shelf.png"],
    desc: ["ซื้อมาแต่ห้องเล็กเกิน เลยอยากปล่อยเผื่อมีคนต้องการใช้", "รับได้ที่หอ Infinity Park"],
    posted: "9 ชั่วโมงที่แล้ว", likes: 39, condition: "สภาพดี",
    pickup: "Infinity Park (นอกมหาวิทยาลัย)", reduce: "0.9 กก. · 10.0 kgCO2e"
  },
  {
    id: 10, title: "เครื่องคิดเลขคาสิโอ", img: "images/p-calculator.png",
    mode: "rent", tag: "Rent - 1day / 50 บาท", chip: "cotton",
    category: "electronics", place: "คณะบริหารธุรกิจ", distance: 400,
    note: "อุปกรณ์อิเล็กทรอนิกส์", noteColor: "#c400b0",
    price: "1 วัน / 50 บาท",
    gallery: ["images/d-calculator.png", "images/p-calculator.png"],
    desc: ["ปล่อยเช่าเพราะช่วงนี้มีสอบปลายภาค เผื่อคนต้องการใช้", "รับได้ที่คณะบริหารธุรกิจ"],
    posted: "12 ชั่วโมงที่แล้ว", likes: 33, condition: "สภาพดี",
    pickup: "คณะบริหารธุรกิจ", reduce: "0.8 กก. · 6.0 kgCO2e"
  },
  {
    id: 11, title: "รองเท้าฟุตบอล Adidas", img: "images/p-boots.png",
    mode: "rent", tag: "Rent - 3day / 500 บาท", chip: "cotton",
    category: "sport", place: "คณะวิทยาศาสตร์การกีฬา", distance: 700,
    note: "อุปกรณ์การกีฬา", noteColor: "#c400b0",
    price: "3 วัน / 500 บาท",
    gallery: ["images/d-boots.png", "images/p-boots.png"],
    desc: ["ไม่ค่อยได้เล่นฟุตบอลช่วงนี้ เพราะขาเจ็บ ไซส์ 43", "รับได้ที่คณะวิทยาศาสตร์การกีฬา"],
    posted: "1 ชั่วโมงที่แล้ว", likes: 3, condition: "สภาพดี",
    pickup: "คณะวิทยาศาสตร์การกีฬา", reduce: "0.8 กก. · 6.0 kgCO2e"
  },
  {
    id: 12, title: "หม้อทำอาหาร มีฝาปิด", img: "images/p-pot.png",
    mode: "lend", tag: "Lend - ยืมได้ 1 สัปดาห์", chip: "cotton",
    category: "furniture", place: "คณะบริหารธุรกิจ", distance: 400,
    note: "ของใช้ในหอพัก", noteColor: "#2b9e26",
    gallery: ["images/d-pot.png", "images/p-pot.png"],
    desc: ["ใช้ไม่ค่อยเยอะ และทำอาหารไม่ค่อยเก่ง เลยอยากปล่อยยืม", "รับได้ที่คณะบริหารธุรกิจ"],
    posted: "2 ชั่วโมงที่แล้ว", likes: 3, condition: "สภาพดี",
    pickup: "คณะบริหารธุรกิจ", reduce: "0.8 กก. · 6.0 kgCO2e"
  }
];

// จุดนัดรับให้เลือกตอนยืนยันนัดพบ
const PICKUP_POINTS = [
  "โรงอาหารกลาง ชั้น 1",
  "ล็อบบี้คณะวิศวกรรมศาสตร์",
  "หน้าหอสมุดกลาง",
  "คณะวิทยาศาสตร์และเทคโนโลยี ชั้น 1",
  "คณะบริหารธุรกิจ",
  "คณะเทคโนโลยีสื่อสารมวลชน ชั้น 1"
];

// ของที่ "ฉัน" ลงไว้ตั้งแต่แรก (ตามดีไซน์หน้า ลงของ-คลัง)
const MY_POSTED_IDS = [6, 7, 9];
