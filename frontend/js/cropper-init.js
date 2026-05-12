/**
 * cropper-init.js
 * Shared image crop logic untuk add.html & update.html
 */

let cropperInstance = null;
let croppedBlob     = null; // hasil crop, dikirim ke API
let originalSrc     = null; // src asli sebelum crop (untuk re-edit)

let inputFile, imgPrev, imgPh, btnRm, btnEdit;

function initImagePicker() {
    inputFile = document.getElementById('input-file');
    imgPrev   = document.getElementById('img-preview');
    imgPh     = document.getElementById('img-placeholder');
    btnRm     = document.getElementById('btn-remove-img');
    btnEdit   = document.getElementById('btn-edit-img');

    // Pilih file → buka crop
    document.getElementById('btn-choose-file').addEventListener('click', () => inputFile.click());
    inputFile.addEventListener('change', e => {
        const f = e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = ev => {
            originalSrc = ev.target.result; // simpan src asli
            openCropModal(originalSrc);
        };
        reader.readAsDataURL(f);
    });

    // Tombol hapus
    btnRm.addEventListener('click', clearPreview);

    // Tombol edit — buka crop modal dengan gambar yang sudah ada
    if (btnEdit) {
        btnEdit.addEventListener('click', () => {
            if (originalSrc) openCropModal(originalSrc);
        });
    }

    // Crop modal controls
    document.getElementById('btn-crop-confirm').addEventListener('click', confirmCrop);
    document.getElementById('btn-crop-cancel').addEventListener('click', closeCropModal);
    document.getElementById('btn-crop-zoom-in').addEventListener('click',  () => cropperInstance?.zoom(0.1));
    document.getElementById('btn-crop-zoom-out').addEventListener('click', () => cropperInstance?.zoom(-0.1));
    document.getElementById('btn-crop-rotate-l').addEventListener('click', () => cropperInstance?.rotate(-90));
    document.getElementById('btn-crop-rotate-r').addEventListener('click', () => cropperInstance?.rotate(90));
    document.getElementById('btn-crop-flip-h').addEventListener('click', () => {
        if (!cropperInstance) return;
        const d = cropperInstance.getData();
        cropperInstance.scaleX(d.scaleX === -1 ? 1 : -1);
    });
    document.getElementById('btn-crop-flip-v').addEventListener('click', () => {
        if (!cropperInstance) return;
        const d = cropperInstance.getData();
        cropperInstance.scaleY(d.scaleY === -1 ? 1 : -1);
    });
}

function openCropModal(src) {
    const modal   = document.getElementById('crop-modal');
    const cropImg = document.getElementById('crop-image');

    if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null; }

    cropImg.src = src;
    modal.style.display = 'flex';

    cropImg.onload = () => {
        cropperInstance = new Cropper(cropImg, {
            aspectRatio: 1,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 0.85,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
            background: false,
        });
    };
}

function confirmCrop() {
    if (!cropperInstance) return;

    const canvas = cropperInstance.getCroppedCanvas({
        width: 800,
        height: 800,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
    });

    canvas.toBlob(blob => {
        croppedBlob = blob;
        const url = URL.createObjectURL(blob);
        showPreview(url);
        closeCropModal();
    }, 'image/jpeg', 0.88);
}

function closeCropModal() {
    if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null; }
    document.getElementById('crop-modal').style.display = 'none';
    inputFile.value = '';
}

function showPreview(src) {
    imgPrev.src = src;
    imgPrev.style.display = 'block';
    imgPh.style.display = 'none';
    btnRm.style.display = 'flex';
    if (btnEdit) btnEdit.style.display = 'flex';
}

function clearPreview() {
    imgPrev.src = '';
    imgPrev.style.display = 'none';
    imgPh.style.display = 'block';
    btnRm.style.display = 'none';
    if (btnEdit) btnEdit.style.display = 'none';
    inputFile.value = '';
    croppedBlob  = null;
    originalSrc  = null;
}

// Dipanggil dari loadProdukForEdit saat gambar existing di-load
function setPreviewFromUrl(url) {
    originalSrc = url; // simpan supaya bisa di-edit
    showPreview(url);
}

function getCroppedBlob() { return croppedBlob; }
