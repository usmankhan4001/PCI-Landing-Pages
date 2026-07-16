document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("inviteCanvas");
  const ctx = canvas.getContext("2d");
  const nameInput = document.getElementById("recipientName");
  const downloadPng = document.getElementById("downloadPng");
  const downloadJpg = document.getElementById("downloadJpg");

  const artwork = new Image();
  artwork.onload = () => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(drawInvite);
    } else {
      drawInvite();
    }
  };
  artwork.src = "assets/realtor-invitation.jpeg";

  nameInput.addEventListener("input", drawInvite);
  downloadPng.addEventListener("click", () => downloadInvite("image/png", "png"));
  downloadJpg.addEventListener("click", () => downloadInvite("image/jpeg", "jpg"));

  function drawInvite() {
    const recipient = nameInput.value.trim();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(artwork, 0, 0, canvas.width, canvas.height);

    if (!recipient) return;

    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 6;

    const x = 1950;
    const y = 985;
    const maxWidth = 2500;
    let fontSize = 156;

    do {
      ctx.font = `800 ${fontSize}px Montserrat, Arial, sans-serif`;
      fontSize -= 2;
    } while (ctx.measureText(recipient).width > maxWidth && fontSize > 96);

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
    }, type, 0.95);
  }
});
