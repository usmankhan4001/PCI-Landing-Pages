document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("inviteCanvas");
  const ctx = canvas.getContext("2d");
  
  // Single mode elements
  const nameInput = document.getElementById("recipientName");
  const downloadPng = document.getElementById("downloadPng");
  const downloadJpg = document.getElementById("downloadJpg");
  
  // Tabs & sections
  const tabSingle = document.getElementById("tabSingle");
  const tabBulk = document.getElementById("tabBulk");
  const singleModeFields = document.getElementById("singleModeFields");
  const bulkModeFields = document.getElementById("bulkModeFields");
  
  // Bulk mode elements
  const bulkNames = document.getElementById("bulkNames");
  const downloadBulk = document.getElementById("downloadBulk");
  const bulkBtnText = document.getElementById("bulkBtnText");

  let currentMode = "single";

  const artwork = new Image();
  artwork.onload = async () => {
    try {
      if (document.fonts) {
        await document.fonts.load('800 142px Montserrat');
      }
    } catch (e) {
      console.warn('Font loading error:', e);
    }
    drawInvite();
  };
  artwork.src = "assets/realtor-invitation.jpeg";

  // Tab Switching
  tabSingle.addEventListener("click", () => {
    currentMode = "single";
    tabSingle.classList.add("is-active");
    tabBulk.classList.remove("is-active");
    singleModeFields.style.display = "block";
    bulkModeFields.style.display = "none";
    drawInvite();
  });

  tabBulk.addEventListener("click", () => {
    currentMode = "bulk";
    tabBulk.classList.add("is-active");
    tabSingle.classList.remove("is-active");
    singleModeFields.style.display = "none";
    bulkModeFields.style.display = "block";
    drawInvite();
  });

  // Inputs trigger redraw
  nameInput.addEventListener("input", () => drawInvite());
  bulkNames.addEventListener("input", () => drawInvite());

  // Single downloads
  downloadPng.addEventListener("click", () => downloadInvite("image/png", "png"));
  downloadJpg.addEventListener("click", () => downloadInvite("image/jpeg", "jpg"));

  // Bulk download
  downloadBulk.addEventListener("click", async () => {
    const names = bulkNames.value.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    if (names.length === 0) {
      alert("Please enter at least one name.");
      return;
    }
    
    if (typeof JSZip === 'undefined') {
      alert("JSZip library failed to load. Please check your internet connection.");
      return;
    }

    const zip = new JSZip();
    bulkBtnText.textContent = `Generating (0/${names.length})...`;
    downloadBulk.disabled = true;

    try {
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        bulkBtnText.textContent = `Generating (${i+1}/${names.length})...`;
        drawInvite(name);
        
        const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.98));
        
        let safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        if (!safeName) safeName = `invite-${i+1}`;
        
        zip.file(`techno-one-invite-${safeName}.jpg`, blob);
      }
      
      bulkBtnText.textContent = "Zipping files...";
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `techno-one-bulk-invites.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("An error occurred during bulk generation.");
    } finally {
      bulkBtnText.textContent = "Export ZIP";
      downloadBulk.disabled = false;
      drawInvite();
    }
  });

  function drawInvite(overrideName) {
    let recipient = "";
    if (overrideName !== undefined) {
      recipient = overrideName;
    } else {
      if (currentMode === "single") {
        recipient = nameInput.value.trim();
      } else {
        const lines = bulkNames.value.split('\n').filter(n => n.trim().length > 0);
        recipient = lines.length > 0 ? lines[0].trim() : "";
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(artwork, 0, 0, canvas.width, canvas.height);

    if (!recipient) return;

    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 6;

    const x = 2055;
    const y = 1035;
    const maxWidth = 2280;
    let fontSize = 142;

    do {
      ctx.font = `800 ${fontSize}px Montserrat, Arial, sans-serif`;
      fontSize -= 2;
    } while (ctx.measureText(recipient).width > maxWidth && fontSize > 88);

    ctx.fillText(recipient, x, y, maxWidth);
    ctx.restore();
  }

  function downloadInvite(type, extension) {
    drawInvite();
    canvas.toBlob((blob) => {
      if (!blob) return;
      const safeName = (nameInput.value.trim() || "recipient")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `techno-one-invite-${safeName || "recipient"}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }, type, 0.98);
  }
});
