/* =========================================================
   Campus Circular — post.js (หน้าลงของ / คลังของที่ลงไว้)
   ของที่ลงใหม่ถูกเก็บใน localStorage และไปโผล่ในหน้า main.html ด้วย
   ========================================================= */

const closetList = document.getElementById("closet-list");
const formModal = document.getElementById("form-modal");
const form = document.getElementById("post-form");
const errorBox = document.getElementById("form-error");
const photoInput = document.getElementById("f-photo");
const preview = document.getElementById("photo-preview");
let photoData = ""; // รูปที่ย่อแล้ว (data URL)

// ---------- คลังของที่ลงไว้ ----------
function renderCloset() {
  const mine = [...Posted.all(), ...MY_POSTED_IDS.map(getItem).filter(Boolean)];
  closetList.innerHTML = mine.map((item) => `
    <article class="closet-row">
      <img class="closet-row__img" src="${item.img}" alt="">
      <div>
        <h3 class="closet-row__title">${escapeHTML(item.title)}</h3>
        ${tagHTML(item)}
      </div>
      <a class="closet-row__more" href="product.html?id=${item.id}">ดูรายละเอียด <img src="images/arrow-teal.svg" alt=""></a>
    </article>`).join("");
}

renderCloset();

// ---------- ตัวเลือกในฟอร์ม ----------
document.getElementById("f-category").innerHTML = Object.entries(CATEGORY_LABEL)
  .map(([key, label]) => `<option value="${key}">${escapeHTML(label)}</option>`).join("");
document.getElementById("f-pickup").innerHTML = PICKUP_POINTS
  .map((p) => `<option>${escapeHTML(p)}</option>`).join("");

document.getElementById("open-form").addEventListener("click", () => openModal(formModal));

// มาจากปุ่ม "ลงของ" ใน header (post.html?new=1) → เปิดฟอร์มเลย
if (new URLSearchParams(location.search).get("new")) {
  openModal(formModal);
}

// ---------- ย่อรูปก่อนเก็บ (กัน localStorage เต็ม) ----------
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  photoData = "";
  preview.hidden = true;
  if (!file || !file.type.startsWith("image/")) return;

  const img = new Image();
  img.onload = () => {
    const max = 480;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    photoData = canvas.toDataURL("image/jpeg", 0.8);
    preview.src = photoData;
    preview.hidden = false;
    URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(file);
});

// ---------- ส่งฟอร์ม ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const titleInput = document.getElementById("f-title");

  if (!data.title.trim()) {
    errorBox.textContent = "กรุณาใส่ชื่อของ";
    titleInput.setAttribute("aria-invalid", "true");
    titleInput.focus();
    return;
  }

  const labels = { give: "Give - ส่งต่อฟรี", sell: "Sell", swap: "Swap แลกเปลี่ยน", lend: "Lend - ยืม", rent: "Rent - เช่า" };
  const price = data.price.trim();
  const item = {
    id: Date.now(),
    title: data.title.trim(),
    img: photoData || "images/box.svg",
    mode: data.mode,
    tag: price ? `${labels[data.mode].split(" ")[0]} - ${price}` : labels[data.mode],
    chip: "ใหม่",
    category: data.category,
    place: data.pickup,
    distance: 300,
    note: "ลงโดยคุณ",
    noteColor: "#0f766e",
    price,
    gallery: [photoData || "images/box.svg"],
    desc: data.desc.trim() ? [data.desc.trim()] : [],
    posted: "เมื่อสักครู่",
    likes: 0,
    condition: "สภาพดี",
    pickup: data.pickup,
    reduce: "-",
    seller: (() => { try { return sessionStorage.getItem("cc-user") || "ฉัน"; } catch (err) { return "ฉัน"; } })()
  };

  if (!Posted.add(item)) {
    errorBox.textContent = "บันทึกไม่ได้ พื้นที่ในเบราว์เซอร์อาจเต็ม ลองใช้รูปที่เล็กลง";
    return;
  }

  form.reset();
  photoData = "";
  preview.hidden = true;
  errorBox.textContent = "";
  closeModal(formModal);
  renderCloset();
  toast("ลงของเรียบร้อย! ไปดูได้ที่หน้ารายการของ");
});

document.getElementById("f-title").addEventListener("input", (e) => {
  e.target.removeAttribute("aria-invalid");
  errorBox.textContent = "";
});
