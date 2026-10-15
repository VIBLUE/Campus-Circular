/* =========================================================
   Campus Circular — chat.js (หน้าแชท)
   ข้อความที่พิมพ์เองจะถูกจำไว้ใน localStorage ของแต่ละห้อง
   (ยังไม่มี server จึงคุยได้แค่ฝั่งเดียว)
   ========================================================= */

// ชื่อผู้ใช้จากหน้า login (ถ้าไม่ได้ล็อกอินใช้ชื่อตามดีไซน์)
let myName = "นายกิตติ เเสวงหาผลกำไร";
try {
  myName = sessionStorage.getItem("cc-user") || myName;
} catch (err) { /* storage ถูกปิด */ }
document.getElementById("me-name").textContent = myName;

// ---------- ข้อมูลห้องแชท (ข้อความตั้งต้นตามดีไซน์) ----------
const THREADS = [
  {
    id: "kitti", name: SELLER.name, avatar: "images/chat-kitti.png", avatarSm: "images/chat-kitti-sm.png",
    itemId: 1, date: "02 มิ.ย",
    messages: [
      { from: "them", text: "สวัสดีครับ สะดวกนัดรับตามหมุดเลยไหมครับ" },
      { from: "them", text: "ผมว่างเฉพาะช่วงเย็นๆนะครับ" },
      { from: "them", text: "ยังไงตอบหน่อยนะครับ" },
      { from: "me", text: "สวัสดีครับ สะดวกตามหมุดเวลา 18:00-19:00 วันศุกร์ที่ 16 ครับ" },
      { from: "me", text: "สะดวกตอนไหนยังไงบอกด้วยนะครับ" },
      { from: "them", text: "ได้ครับขอประมาณ 1 ทุ่มครับ ไปสายหน่อยนะครับ" },
      { from: "them", text: "เอาถุงมาใส่ด้วยนะครับ" },
      { from: "me", text: "โอเคครับขอบคุณครับ" }
    ]
  },
  { id: "nene", name: "เนเน่ ใจดี", avatar: "images/chat-2.png", itemId: 3, date: "01 มิ.ย",
    messages: [{ from: "me", text: "ติดต่อรับชุดครุยครับ" }] },
  { id: "ad", name: "พี่แอ๊ด วิศวะ", avatar: "images/chat-3.png", itemId: 4, date: "30 พ.ค",
    messages: [{ from: "me", text: "ขอแลกหนังสือฟิสิกส์ 2 ครับ" }] },
  { id: "mai", name: "ใหม่ บริหาร", avatar: "images/chat-4.png", itemId: 10, date: "28 พ.ค",
    messages: [{ from: "me", text: "ขอเช่าเครื่องคิดเลขครับ" }] },
  { id: "jan", name: "จาน สื่อสารมวลชน", avatar: "images/chat-5.png", itemId: 7, date: "27 พ.ค",
    messages: [{ from: "me", text: "ติดต่อรับเมาส์ครับ" }] }
];

const listEl = document.getElementById("inbox-list");
const msgEl = document.getElementById("messages");
const input = document.getElementById("composer-input");
let current = THREADS[0];

// ข้อความที่พิมพ์เพิ่ม (เก็บแยกต่อห้อง)
function extraMessages(thread) {
  return Store.get(`cc-chat-${thread.id}`, []);
}

function allMessages(thread) {
  return [...thread.messages, ...extraMessages(thread)];
}

// ---------- รายชื่อแชท ----------
function renderList(filter = "") {
  const q = filter.trim().toLowerCase();
  listEl.innerHTML = THREADS
    .filter((t) => !q || t.name.toLowerCase().includes(q))
    .map((t) => {
      const msgs = allMessages(t);
      const last = msgs[msgs.length - 1];
      const prefix = last.from === "me" ? "คุณ : " : "";
      return `
        <li>
          <button class="thread" type="button" data-id="${t.id}" aria-current="${t === current}">
            <img class="thread__avatar" src="${t.avatarSm || t.avatar}" alt="">
            <span class="thread__name">${escapeHTML(t.name)}</span>
            <span class="thread__last">${prefix}${escapeHTML(last.text)}</span>
            <span class="thread__date">${escapeHTML(t.date)}</span>
          </button>
        </li>`;
    }).join("");
}

// ---------- ห้องแชท ----------
function renderRoom() {
  document.getElementById("room-avatar").src = current.avatar;
  document.getElementById("room-name").textContent = current.name;
  const item = getItem(current.itemId);
  document.getElementById("room-tag").innerHTML = item ? tagHTML(item) : "";

  // รวมข้อความที่มาจากคนเดียวกันติดกันเป็นกลุ่ม
  const groups = [];
  allMessages(current).forEach((m) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.from === m.from) lastGroup.items.push(m.text);
    else groups.push({ from: m.from, items: [m.text] });
  });

  msgEl.innerHTML = groups.map((g) => {
    const bubbles = g.items.map((t) => `<p class="bubble">${escapeHTML(t)}</p>`).join("");
    if (g.from === "me") {
      return `<div class="msg-group msg-group--me"><div class="msg-group__body">${bubbles}</div></div>`;
    }
    return `
      <div class="msg-group">
        <img class="msg-group__avatar" src="${current.avatar}" alt="">
        <div>
          <p class="msg-group__name">${escapeHTML(current.name)}</p>
          <div class="msg-group__body">${bubbles}</div>
        </div>
      </div>`;
  }).join("");

  msgEl.scrollTop = msgEl.scrollHeight;
}

// ---------- event ----------
listEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".thread");
  if (!btn) return;
  current = THREADS.find((t) => t.id === btn.dataset.id);
  renderList(document.getElementById("inbox-search").value);
  renderRoom();
});

document.getElementById("inbox-search").addEventListener("input", (e) => renderList(e.target.value));

document.getElementById("composer").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const extra = extraMessages(current);
  extra.push({ from: "me", text });
  Store.set(`cc-chat-${current.id}`, extra);
  input.value = "";
  renderRoom();
  renderList(document.getElementById("inbox-search").value);
});

// ถ้าเพิ่งยืนยันคำสั่งซื้อ ให้ห้องของผู้ลงของแสดงของชิ้นแรกที่สั่ง
const lastOrder = Store.get("cc-last-order", null);
if (lastOrder && lastOrder.ids && lastOrder.ids.length) {
  THREADS[0].itemId = lastOrder.ids[0];
}

renderList();
renderRoom();
