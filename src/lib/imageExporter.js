import { toPng } from "html-to-image";

/**
 * Capture an HTML DOM element and trigger a browser download of a high-resolution PNG image.
 * 
 * @param {HTMLElement} element - The DOM element to capture.
 * @param {string} fileName - The desired download filename (e.g. CreatorEDF_EDF_Form.png).
 * @param {object} options - Optional configuration overrides.
 * @returns {Promise<string>} - Resolves with data URL on success.
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
    const dataUrl = await toPng(element, defaultOptions);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 1000);
    return dataUrl;
  } catch (error) {
    console.error("Failed to export PNG:", error);
    throw error;
  }
}

