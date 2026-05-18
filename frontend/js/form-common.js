/**
 * form-common.js
 * Shared form logic for add.html & update.html
 * Handles: validation, input formatting, camera, alerts
 */

// ============================================================
// FORM VALIDATION
// ============================================================
function initFormValidation(formId, onSubmitCallback) {
    const form     = document.getElementById(formId);
    const alertBox = document.getElementById('alert-error');
    const alertMsg = document.getElementById('alert-msg');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const fields = [
            { el: document.getElementById('nama-produk'),     label: 'Nama Produk' },
            { el: document.getElementById('stok-produk'),     label: 'Stok' },
            { el: document.getElementById('harga-produk'),    label: 'Harga' },
            { el: document.getElementById('kategori-produk'), label: 'Kategori' },
        ];
        let valid = true;
        const kosong = [];

        fields.forEach(f => f.el.classList.remove('is-invalid'));
        if (alertBox) alertBox.classList.remove('show');

        fields.forEach(f => {
            if (!f.el.value || !f.el.value.trim()) {
                f.el.classList.add('is-invalid');
                kosong.push(f.label);
                valid = false;
            }
        });

        if (!valid) {
            if (alertMsg) alertMsg.textContent = `Wajib diisi: ${kosong.join(', ')}.`;
            if (alertBox) {
                alertBox.classList.add('show');
                alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            return;
        }

        if (typeof onSubmitCallback === 'function') onSubmitCallback(e);
    });

    // Remove invalid state on input
    document.querySelectorAll('.form-control, .form-select').forEach(el => {
        el.addEventListener('input', function() { this.classList.remove('is-invalid'); });
    });
}

// ============================================================
// INPUT FORMATTING
// ============================================================
function initNumericInput(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.addEventListener('keydown', e => {
        if (['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'].includes(e.key)) return;
        if (!/^\d$/.test(e.key)) e.preventDefault();
    });

    el.addEventListener('input', () => {
        el.value = el.value.replace(/\D/g, '');
    });
}

function initHargaFormatting(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.addEventListener('keydown', e => {
        if (['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'].includes(e.key)) return;
        if (!/^\d$/.test(e.key)) e.preventDefault();
    });

    el.addEventListener('input', () => {
        const raw = el.value.replace(/\D/g, '');
        el.value = raw ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
    });
}

// ============================================================
// CAMERA HANDLING
// ============================================================
let cameraStream = null;

function initCamera() {
    const btnOpen    = document.getElementById('btn-open-camera');
    const btnCapture = document.getElementById('btn-capture');
    const btnClose   = document.getElementById('btn-close-camera');

    if (!btnOpen) return;

    btnOpen.addEventListener('click', async () => {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            document.getElementById('camera-stream').srcObject = cameraStream;
            document.getElementById('camera-modal').style.display = 'flex';
        } catch(err) {
            alert('Tidak bisa akses kamera: ' + err.message);
        }
    });

    if (btnCapture) {
        btnCapture.addEventListener('click', () => {
            const v = document.getElementById('camera-stream');
            const c = document.getElementById('camera-canvas');
            c.width = v.videoWidth;
            c.height = v.videoHeight;
            c.getContext('2d').drawImage(v, 0, 0);
            stopCamera();
            if (typeof openCropModal === 'function') {
                openCropModal(c.toDataURL('image/jpeg'));
            }
        });
    }

    if (btnClose) {
        btnClose.addEventListener('click', stopCamera);
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
        cameraStream = null;
    }
    const modal = document.getElementById('camera-modal');
    if (modal) modal.style.display = 'none';
}

// ============================================================
// IMAGE BUILDER (for FormData)
// ============================================================
async function buildGambarFormData(formData) {
    // Priority: cropped blob -> file input -> camera canvas
    const blob = typeof getCroppedBlob === 'function' ? getCroppedBlob() : null;
    if (blob) {
        console.log('buildGambarFormData: Using cropped blob', blob.size, 'bytes');
        formData.append('gambar', blob, 'produk.jpg');
        return;
    }
    console.log('buildGambarFormData: No cropped blob');

    const gambarInput = document.getElementById('input-file') || document.getElementById('gambar-produk');
    if (gambarInput && gambarInput.files && gambarInput.files.length > 0) {
        console.log('buildGambarFormData: Using file input', gambarInput.files[0].name);
        formData.append('gambar', gambarInput.files[0]);
        return;
    }
    console.log('buildGambarFormData: No file input');

    const cameraCanvas = document.getElementById('camera-canvas');
    if (cameraCanvas && cameraCanvas.width > 0) {
        console.log('buildGambarFormData: Using camera canvas');
        await new Promise(resolve => {
            cameraCanvas.toBlob(b => {
                if (b) formData.append('gambar', b, 'foto-kamera.jpg');
                resolve();
            }, 'image/jpeg', 0.85);
        });
        return;
    }
    console.log('buildGambarFormData: No image to send - backend will preserve existing image');
}

// ============================================================
// COMMON INITIALIZATION
// ============================================================
function initFormCommon(formId, onSubmitCallback) {
    initFormValidation(formId, onSubmitCallback);
    initNumericInput('stok-produk');
    initHargaFormatting('harga-produk');
    initCamera();
}
