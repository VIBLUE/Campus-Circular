/* =========================================================
   Campus Circular — login.js
   ตอนนี้ยังไม่มีระบบหลังบ้าน (backend) จึงทำเป็นล็อกอินจำลอง:
   ตรวจว่ากรอกครบ → จำชื่อผู้ใช้ไว้ใน sessionStorage → ไปหน้า main.html
   ห้ามเก็บรหัสผ่านในเบราว์เซอร์ เวลาทำจริงต้องส่งไปตรวจที่ server
   ========================================================= */

const form = document.getElementById("login-form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const errorBox = document.getElementById("login-error");

function showError(message, field) {
  errorBox.textContent = message;
  field.setAttribute("aria-invalid", "true");
  field.focus();
}

// พิมพ์แก้แล้วให้ล้างข้อความผิดพลาด
[username, password].forEach((input) => {
  input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
    errorBox.textContent = "";
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!username.value.trim()) {
    showError("กรุณากรอกชื่อผู้ใช้", username);
    return;
  }
  if (!password.value) {
    showError("กรุณากรอกรหัสผ่าน", password);
    return;
  }

  // ล็อกอินจำลอง: เก็บแค่ชื่อผู้ใช้ (ไม่เก็บรหัสผ่าน)
  try {
    sessionStorage.setItem("cc-user", username.value.trim());
  } catch (err) {
    // บางเบราว์เซอร์ปิด storage ไว้ ไม่เป็นไร ไปหน้าถัดไปได้เลย
  }
  location.href = "main.html";
});
