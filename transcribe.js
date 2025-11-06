let mediaRecorder;
let audioChunks = [];

document.getElementById('startTranscription').onclick = async function() {
  // Get user mic permissions (for solo demo; for real calls, you'd grab the actual audio track)
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
    console.log("clicked")
  mediaRecorder.ondataavailable = event => {
    console.log("sound detected")
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    console.log("sound stopped")
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    audioChunks = [];
    const formData = new FormData();
    formData.append('audio', audioBlob, 'input.webm');
    // Optional: formData.append('consultationId', consultationId);
    console.log("fetching")
    const res = await fetch('http://localhost:3000/api/transcription', {
      method: 'POST',
      body: formData
    });
    console.log("fetched",res)
    const data = await res.json();
    if (data.transcription) {
      showSubtitle(data.transcription);
    }

    // Restart recording for continuous updates
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 3500); // 3.5s chunks
  };

  mediaRecorder.start();
  setTimeout(() => mediaRecorder.stop(), 3500); // first chunk
};

function showSubtitle(text) {
  document.getElementById('subtitles').textContent = text;
}


