import { downloadBlob } from "./download.js";
import { loadVendorLib } from "./vendor-loader.js";

export async function downloadZip(entries, fileName) {
  const JSZip = await loadVendorLib("jszip");
  const archive = new JSZip();

  entries.forEach((entry) => {
    archive.file(entry.name, entry.data);
  });

  const blob = await archive.generateAsync({ type: "blob" });
  downloadBlob(fileName, blob);
  return blob;
}
