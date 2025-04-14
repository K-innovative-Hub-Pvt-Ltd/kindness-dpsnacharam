const openPopup = document.getElementById('openSelfiePopup');
const popup = document.getElementById('selfiePopup');
const closeBtn = document.querySelector('.close-btn');
const clickSelfieBtn = document.getElementById('clickSelfieBtn');
const uploadSelfieBtn = document.getElementById('uploadSelfieBtn');
const uploadInput = document.getElementById('uploadInput');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const template = new Image();
template.src = '../images/template.png';

const video = document.getElementById('video');
const snap = document.getElementById('snap');
const optionButtons = document.querySelector('.option-buttons');
const popupTitle = document.getElementById('popupTitle');
const canvasWrapper = document.querySelector('.canvas-wrapper');

// Show popup
openPopup.addEventListener('click', () => {
  popup.style.display = 'flex';
  resetUI();
});

// Close popup
closeBtn.addEventListener('click', () => {
  popup.style.display = 'none';
  stopCamera();
  resetUI();
});

// Handle "Click Selfie"
clickSelfieBtn.addEventListener('click', async () => {
  video.style.display = 'block';
  snap.style.display = 'inline-block';

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alert("Camera access denied or not supported.");
  }
});

// Capture webcam photo
snap.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 150, 200, 300, 400);
  ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
  showSelfieResult();
  stopCamera();
});

// Handle "Select Selfie"
uploadSelfieBtn.addEventListener('click', () => {
  uploadInput.click();
});

uploadInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (evt) {
    const selfie = new Image();
    selfie.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(selfie, 150, 200, 300, 400);
      ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
      showSelfieResult();
    };
    selfie.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

// Download image
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'my-selfie-template.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Show only the result
function showSelfieResult() {
  optionButtons.style.display = 'none';
  video.style.display = 'none';
  snap.style.display = 'none';
  downloadBtn.style.display = 'inline-block';
  canvasWrapper.style.display = 'flex';

  if (popupTitle) {
    popupTitle.textContent = "Your Selfie is Ready with the Kindness Frame!";
  }
}

// Reset popup
function resetUI() {
  stopCamera();
  video.style.display = 'none';
  snap.style.display = 'none';
  downloadBtn.style.display = 'none';
  canvasWrapper.style.display = 'none';
  optionButtons.style.display = 'flex';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (popupTitle) {
    popupTitle.textContent = "Choose an Option";
  }
}

// Stop camera
function stopCamera() {
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
}