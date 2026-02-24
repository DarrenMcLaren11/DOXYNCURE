const hospital = localStorage.getItem("userHosp") || "General";

let approvalTimer;
let pollingInterval;
let timeLeft = 300;
let documentId = null;

// ========================
// Preview Logic
// ========================

function openPreview() {
    const editorContent = document.getElementById('clinical-editor').value;
    if (!editorContent.trim()) {
        alert("The workspace is empty.");
        return;
    }

    document.getElementById('hospital-name-display').innerText =
        hospital + " HOSPITAL";

    document.getElementById('pdf-text-content').innerText = editorContent;
    document.getElementById('preview-modal').style.display = 'flex';
}

function closePreview() {
    document.getElementById('preview-modal').style.display = 'none';
}

// ========================
// Approval Flow
// ========================

async function startApproval() {
    const content = document.getElementById('clinical-editor').value;

    closePreview();
    document.getElementById('approval-modal').style.display = 'flex';

    try {
        // SEND TO BACKEND (LIVE INTERNET API)
        const response = await fetch("https://api.doxyncure.com/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: hospital,
                content: content
            })
        });

        const data = await response.json();
        documentId = data.id;

        // DOWNLOAD LOCAL PDF
        downloadPDF();

        // START TIMER
        timeLeft = 300;
        approvalTimer = setInterval(updateTimer, 1000);

        // POLL SERVER
        pollingInterval = setInterval(checkStatus, 5000);

    } catch (err) {
        alert("Failed to send document.");
        console.error(err);
    }
}

function downloadPDF() {
    const element = document.getElementById("pdf-export-area");
    html2pdf().from(element).save("medical_record.pdf");
}

async function checkStatus() {
    if (!documentId) return;

    const response = await fetch(`https://api.doxyncure.com/status/${documentId}`);
    const data = await response.json();

    if (data.status === "approved") {
        clearAll();
        alert("Document Approved ✅");
    }

    if (data.status === "denied") {
        clearAll();
        alert("Document Denied ❌");
    }
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    document.getElementById('timer').innerText =
        `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

    if (timeLeft <= 0) {
        clearAll();
        deleteFromServer();
        alert("Approval timed out. Document deleted.");
    }

    timeLeft--;
}

function clearAll() {
    clearInterval(approvalTimer);
    clearInterval(pollingInterval);
    document.getElementById('approval-modal').style.display = 'none';
}

async function deleteFromServer() {
    if (!documentId) return;

    await fetch(`https://api.doxyncure.com/delete/${documentId}`, {
        method: "DELETE"
    });
}