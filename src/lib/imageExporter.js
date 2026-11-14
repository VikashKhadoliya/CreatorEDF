import { toBlob } from "html-to-image";

/**
 * Capture an HTML DOM element and trigger a browser download of a high-resolution PNG image.
 * 
 * @param {HTMLElement} element - The DOM element to capture.
 * @param {string} fileName - The desired download filename (e.g. CreatorEDF_EDF_Form.png).
 * @param {object} options - Optional configuration overrides.
 * @returns {Promise<Blob>} - Resolves with Blob on success.
 */
export async function exportElementToPng(element, fileName = "document.png", options = {}) {
  if (!element) {
    throw new Error("Cannot export PNG: Target element not found.");
  }

  // 2x pixel ratio ensures crisp retina-grade typography and table lines for print
  const defaultOptions = {
    quality: 0.98,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    cacheBust: true,
    style: {
      transform: "none",
      margin: "0",
    },
    filter: (node) => {
      // Exclude interactive elements or utility badges with 'no-export' or 'no-print'
      if (node.classList && (node.classList.contains("no-export") || node.classList.contains("no-print"))) {
        return false;
      }
      return true;
    },
    ...options,
  };

  try {
    const blob = await toBlob(element, defaultOptions);
    if (!blob) {
      throw new Error("Failed to generate image blob.");
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.download = fileName;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      } catch (e) {
        // cleanup ignore
      }
    }, 2000);
    return blob;
  } catch (error) {
    console.error("Failed to export PNG:", error);
    throw error;
  }
}

