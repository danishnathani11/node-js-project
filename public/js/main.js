// Image preview on file select
const fileInput = document.getElementById('image');
if (fileInput) {
  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('imagePreview');
      const previewImg = document.getElementById('previewImg');
      previewImg.src = e.target.result;
      preview.style.display = 'block';
      document.querySelector('.file-upload-label .file-text').textContent = file.name;
    };
    reader.readAsDataURL(file);
  });
}

// Clear image preview
function clearImage() {
  const fileInput = document.getElementById('image');
  if (fileInput) fileInput.value = '';
  const preview = document.getElementById('imagePreview');
  if (preview) preview.style.display = 'none';
  const label = document.querySelector('.file-upload-label .file-text');
  if (label) label.textContent = 'Choose Image (max 5MB)';
}

// Auto-dismiss alerts
document.querySelectorAll('.alert').forEach(alert => {
  setTimeout(() => {
    alert.style.transition = 'opacity 0.5s, transform 0.5s';
    alert.style.opacity = '0';
    alert.style.transform = 'translateY(-10px)';
    setTimeout(() => alert.remove(), 500);
  }, 4000);
});

// Confirm delete on forms
document.querySelectorAll('.delete-form').forEach(form => {
  form.addEventListener('submit', function (e) {
    // Already handled by onclick; this is a safety net
  });
});

// Animate stat numbers
document.querySelectorAll('.stat-number').forEach(el => {
  const rawText = el.textContent.trim();
  // Only animate pure numeric values
  const numMatch = rawText.match(/[\d,]+/);
  if (!numMatch || rawText.includes('₹')) return; // skip formatted ones for simplicity
  const target = parseInt(numMatch[0].replace(/,/g, ''));
  if (isNaN(target) || target === 0) return;
  let current = 0;
  const step = Math.max(1, Math.floor(target / 30));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('en-IN');
    if (current >= target) clearInterval(timer);
  }, 30);
});
