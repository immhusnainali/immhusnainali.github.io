const loaderCache = new Map();

const VENDOR_SOURCES = {
  "pdf-lib": {
    src: "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js",
    globalName: "PDFLib",
  },
  pdfjs: {
    src: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
    globalName: "pdfjsLib",
    onLoad: () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }
    },
  },
  jszip: {
    src: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
    globalName: "JSZip",
  },
  qrcode: {
    src: "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js",
    globalName: "QRCode",
  },
};

export function loadVendorLib(name) {
  const definition = VENDOR_SOURCES[name];
  if (!definition) {
    return Promise.reject(new Error("Unknown vendor library: " + name));
  }

  if (window[definition.globalName]) {
    if (typeof definition.onLoad === "function") {
      definition.onLoad();
    }
    return Promise.resolve(window[definition.globalName]);
  }

  if (loaderCache.has(name)) {
    return loaderCache.get(name);
  }

  const promise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${definition.src}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (typeof definition.onLoad === "function") {
          definition.onLoad();
        }
        resolve(window[definition.globalName]);
      });
      existingScript.addEventListener("error", () => {
        loaderCache.delete(name);
        reject(new Error("Failed to load " + name + "."));
      });
      return;
    }

    const script = document.createElement("script");
    script.src = definition.src;
    script.async = true;
    script.onload = () => {
      if (typeof definition.onLoad === "function") {
        definition.onLoad();
      }
      resolve(window[definition.globalName]);
    };
    script.onerror = () => {
      loaderCache.delete(name);
      reject(new Error("Failed to load " + name + "."));
    };
    document.body.appendChild(script);
  });

  loaderCache.set(name, promise);
  return promise;
}

export async function loadVendorLibs(names = []) {
  const results = await Promise.all(names.map(loadVendorLib));
  return names.reduce((accumulator, name, index) => {
    accumulator[name] = results[index];
    return accumulator;
  }, {});
}
