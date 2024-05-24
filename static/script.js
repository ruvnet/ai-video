/* 
     _____  .__  ____   ___.__    .___            
    /  _  \ |__| \   \ /   |__| __| _/____  ____  
   /  /_\  \|  |  \   Y   /|  |/ __ _/ __ \/  _ \ 
  /    |    |  |   \     / |  / /_/ \  ___(  <_> )
  \____|__  |__|    \___/  |__\____ |\___  \____/ 
          \/                       \/    \/       
                created by rUv
*/

const video = document.getElementById('video');
const formattedMarkdownDiv = document.getElementById('formattedMarkdown');
const toggleSettingsButton = document.getElementById('toggleSettings');
const settingsPanel = document.querySelector('.settings-panel');
const saveSettingsButton = document.getElementById('saveSettings');
const startCaptureButton = document.getElementById('startCapture');
const stopCaptureButton = document.getElementById('stopCapture');
let captureInterval;
let refreshRate = 15;
let customPrompt = "Analyze this frame";
let apiKey = "";
let activeStream = null;
let isProcessing = false; // Flag to track if processing is in progress

function logMessage(message) {
    const p = document.createElement('p');
    p.textContent = message;
    formattedMarkdownDiv.appendChild(p);
    formattedMarkdownDiv.scrollTop = formattedMarkdownDiv.scrollHeight; // Scroll to bottom
}

async function startWebcamStream() {
    activeStream = await navigator.mediaDevices.getUserMedia({ video: true });
    logMessage("Webcam stream started.");
    video.srcObject = activeStream;
}

async function startScreenShare() {
    activeStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    logMessage("Screen share started.");
    video.srcObject = activeStream;
}

async function startApplicationShare() {
    activeStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
            cursor: "always",
            displaySurface: "application"
        }
    });
    logMessage("Application share started.");
    video.srcObject = activeStream;
}

async function handleStreamSelection(event) {
    if (isProcessing) {
        event.stopImmediatePropagation(); // Stop event propagation immediately
        return; // Terminate the function
    }
    isProcessing = true; // Set the flag to indicate processing is in progress

    // Remove active class from all buttons
    document.querySelectorAll('.btn-group-toggle .btn').forEach(btn => btn.classList.remove('active'));

    // Add active class to the clicked button
    event.target.closest('.btn').classList.add('active');

    const selectedButton = event.target.closest('.btn').querySelector('input');
    if (!selectedButton) {
        console.error('No input element found inside the clicked button.');
        isProcessing = false; // Reset the flag
        return;
    }

    const selectedButtonId = selectedButton.id;
    if (activeStream) {
        // Stop the previous stream
        let tracks = activeStream.getTracks();
        tracks.forEach(track => track.stop());
        activeStream = null;
    }

    if (selectedButtonId === 'shareWebcam') {
        await startWebcamStream();
    } else if (selectedButtonId === 'shareScreen') {
        await startScreenShare();
    } else if (selectedButtonId === 'shareApplication') {
        await startApplicationShare();
    }

    isProcessing = false; // Reset the flag after processing is complete
}

// Event delegation for stream selection buttons
document.body.addEventListener('click', (event) => {
    if (event.target.closest('.btn-group-toggle .btn')) {
        handleStreamSelection(event);
    }
});

// Toggle settings panel
toggleSettingsButton.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    logMessage("");
});

// Save settings
saveSettingsButton.addEventListener('click', () => {
    customPrompt = document.getElementById('customPrompt').value || "Analyze this frame";
    refreshRate = document.getElementById('refreshRate').value || 15;
    apiKey = document.getElementById('apiKey').value || "";
    settingsPanel.style.display = 'none';
    logMessage("Settings saved.");
});

// Start Capture
startCaptureButton.addEventListener('click', () => {
    if (isProcessing || captureInterval) {
        return; // Terminate if processing is in progress or capture is already running
    }
    isProcessing = true; // Set the flag to indicate processing is in progress

    captureFrame(); // Capture the first frame immediately
    captureInterval = setInterval(captureFrame, refreshRate * 1000); // Capture every `refreshRate` seconds
    logMessage("Capture started.");

    isProcessing = false; // Reset the flag after processing is complete
});

// Stop Capture
stopCaptureButton.addEventListener('click', () => {
    if (isProcessing || !captureInterval) {
        return; // Terminate if processing is in progress or capture is not running
    }
    isProcessing = true; // Set the flag to indicate processing is in progress

    clearInterval(captureInterval);
    captureInterval = null;
    logMessage("Capture stopped.");

    isProcessing = false; // Reset the flag after processing is complete
});

function captureFrame() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');

    logMessage("Frame captured and sent to API.");
    fetch('/process_frame', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: dataUrl, prompt: customPrompt, api_key: apiKey })
    })
    .then(response => response.json())
    .then(data => {
        const formattedMarkdown = marked.parse(data.response); // Fixed function call
        formattedMarkdownDiv.innerHTML = formattedMarkdown;
        formattedMarkdownDiv.scrollTop = formattedMarkdownDiv.scrollHeight; // Scroll to bottom
    })
    .catch(error => {
        console.error('Error:', error);
        logMessage(`Error: ${error.message}`);
    });
}
