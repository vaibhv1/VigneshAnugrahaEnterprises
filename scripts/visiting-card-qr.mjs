/**
 * Print master for the visiting-card QR.
 *
 * Encodes the canonical website URL. A phone opens that address when the code is scanned.
 * Contact lines on the proof sheet are printed text; they are not stored in the code.
 *
 * Run: npm run qr:card
 */
import fs from "node:fs";
import path from "node:path";
import tls from "node:tls";
import zlib from "node:zlib";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "print");

const SITE_URL = "https://vigneshanugrahaenterprises.in/";
const ECC = "H";
const QUIET_MODULES = 4;
const MODULE_MM = 0.5;
const MAX_SIDE_MM = 42;
const MODULE_PX = 8;

const checks = [];

function check(name, condition, detail) {
  checks.push({ name, ok: Boolean(condition), detail });
  if (!condition) {
    throw new Error(`${name}${detail ? `: ${detail}` : ""}`);
  }
}

function readCompany() {
  const source = fs.readFileSync(path.join(root, "src", "data", "site.ts"), "utf8");
  const field = (name) => {
    const match = source.match(new RegExp(`${name}:\\s*"([^"]*)"`));
    if (!match) throw new Error(`Missing ${name} in src/data/site.ts`);
    return match[1];
  };
  const phones = [...source.matchAll(/\{\s*display:\s*"([^"]+)",\s*tel:\s*"(\+\d+)"/g)].map((match) => ({
    display: match[1],
    tel: match[2],
  }));
  if (phones.length === 0) throw new Error("No phone numbers in src/data/site.ts");
  return {
    displayName: field("displayName"),
    proprietor: field("proprietor"),
    email: field("email"),
    phones,
  };
}

function websitePayload() {
  const url = new URL(SITE_URL);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
    throw new Error("Website QR must be a plain https address");
  }
  if (url.pathname !== "/") throw new Error("Website QR must open the home page");
  return url.href;
}

function symbolSideMm(symbol) {
  return (symbol.modules.size + QUIET_MODULES * 2) * MODULE_MM;
}

function matrixBytes(modules) {
  return Uint8Array.from(modules.data);
}

function renderRgba(matrixData, size, scale, quiet) {
  const total = size + quiet * 2;
  const width = total * scale;
  const height = width;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const moduleY = Math.floor(y / scale) - quiet;
    for (let x = 0; x < width; x += 1) {
      const moduleX = Math.floor(x / scale) - quiet;
      const dark =
        moduleX >= 0 &&
        moduleY >= 0 &&
        moduleX < size &&
        moduleY < size &&
        matrixData[moduleY * size + moduleX] === 1;
      const index = (y * width + x) * 4;
      const value = dark ? 0 : 255;
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
      data[index + 3] = 255;
    }
  }
  return { data, width, height };
}

function decode(image) {
  const result = jsQR(image.data, image.width, image.height, { inversionAttempts: "dontInvert" });
  return result ? result.data : null;
}

function nearest(image, factor) {
  const width = Math.floor(image.width / factor);
  const height = Math.floor(image.height / factor);
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const source = (y * factor * image.width + x * factor) * 4;
      const target = (y * width + x) * 4;
      data[target] = image.data[source];
      data[target + 1] = image.data[source + 1];
      data[target + 2] = image.data[source + 2];
      data[target + 3] = 255;
    }
  }
  return { data, width, height };
}

function boxBlur(image, radius) {
  const { data: source, width, height } = image;
  const data = new Uint8ClampedArray(source.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let sum = 0;
      let count = 0;
      for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
        const sampleY = y + offsetY;
        if (sampleY < 0 || sampleY >= height) continue;
        for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
          const sampleX = x + offsetX;
          if (sampleX < 0 || sampleX >= width) continue;
          sum += source[(sampleY * width + sampleX) * 4];
          count += 1;
        }
      }
      const value = Math.round(sum / count);
      const index = (y * width + x) * 4;
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
      data[index + 3] = 255;
    }
  }
  return { data, width, height };
}

function dilate(image) {
  const { data: source, width, height } = image;
  const data = new Uint8ClampedArray(source);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      let dark = false;
      for (let offsetY = -1; offsetY <= 1 && !dark; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if (source[((y + offsetY) * width + (x + offsetX)) * 4] === 0) {
            dark = true;
            break;
          }
        }
      }
      if (dark) {
        const index = (y * width + x) * 4;
        data[index] = 0;
        data[index + 1] = 0;
        data[index + 2] = 0;
      }
    }
  }
  return { data, width, height };
}

function placeOnWhite(image, pad) {
  const width = image.width + pad * 2;
  const height = image.height + pad * 2;
  const data = new Uint8ClampedArray(width * height * 4);
  data.fill(255);
  for (let y = 0; y < image.height; y += 1) {
    data.set(image.data.subarray(y * image.width * 4, (y + 1) * image.width * 4), ((y + pad) * width + pad) * 4);
  }
  return { data, width, height };
}

function shuffled(values, seed) {
  const copy = values.slice();
  let state = seed >>> 0;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = state % (index + 1);
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function damageMargin(matrixData, modules, payload) {
  const size = modules.size;
  const candidates = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!modules.isReserved(row, col)) candidates.push(row * size + col);
    }
  }
  const order = shuffled(candidates, 20261126);
  const recovers = (count) => {
    const damaged = new Uint8Array(matrixData);
    for (let index = 0; index < count; index += 1) damaged[order[index]] ^= 1;
    return decode(renderRgba(damaged, size, 4, QUIET_MODULES)) === payload;
  };
  const ladder = [0.01, 0.02, 0.03, 0.04, 0.05, 0.08, 0.12];
  let best = 0;
  for (const ratio of ladder) {
    const count = Math.max(1, Math.floor(order.length * ratio));
    if (!recovers(count)) break;
    best = ratio;
  }

  const scratchDecodes = (span) => {
    const damaged = new Uint8Array(matrixData);
    const start = Math.floor((size - span) / 2);
    for (let row = start; row < start + span; row += 1) {
      for (let col = start; col < start + span; col += 1) damaged[row * size + col] = 1;
    }
    return decode(renderRgba(damaged, size, 4, QUIET_MODULES)) === payload;
  };
  const spans = [8, 12, 16, 20, 24, 28, 32];
  let scratchModules = 0;
  for (const span of spans) {
    if (!scratchDecodes(span)) break;
    scratchModules = span;
  }
  return { best, dataModules: order.length, scratchModules };
}

function finderOk(matrixData, size, row, col) {
  const pattern = [0b1111111, 0b1000001, 0b1011101, 0b1011101, 0b1011101, 0b1000001, 0b1111111];
  for (let y = 0; y < 7; y += 1) {
    for (let x = 0; x < 7; x += 1) {
      const dark = (pattern[y] & (1 << (6 - x))) !== 0;
      if ((matrixData[(row + y) * size + (col + x)] === 1) !== dark) return false;
    }
  }
  return true;
}

function toSvg(matrixData, size, sideMm) {
  const total = size + QUIET_MODULES * 2;
  let pathData = "";
  let darkModules = 0;
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (matrixData[row * size + col] !== 1) continue;
      darkModules += 1;
      pathData += `M${col + QUIET_MODULES} ${row + QUIET_MODULES}h1v1h-1z`;
    }
  }
  const mm = sideMm.toFixed(2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${mm}mm" height="${mm}mm" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">
  <title>Vignesh Anugraha Enterprises visiting card QR</title>
  <desc>Opens ${SITE_URL}. Error correction H, ${QUIET_MODULES}-module quiet zone, ${MODULE_MM.toFixed(2)} mm per module. Print at ${mm} mm on white. Do not recolor, invert, or put artwork in the quiet zone.</desc>
  <rect width="${total}" height="${total}" fill="#ffffff"/>
  <path fill="#000000" d="${pathData}"/>
</svg>
`;
  return { svg, darkModules, pathData };
}

function withPixelsPerMeter(pngBuffer, pixelsPerMeter) {
  const ppm = Math.round(pixelsPerMeter);
  const data = Buffer.alloc(9);
  data.writeUInt32BE(ppm, 0);
  data.writeUInt32BE(ppm, 4);
  data[8] = 1;
  const type = Buffer.from("pHYs");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(Buffer.concat([type, data])), 0);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(9, 0);
  const chunk = Buffer.concat([length, type, data, crc]);
  const ihdrLength = pngBuffer.readUInt32BE(8);
  const insertAt = 8 + 4 + 4 + ihdrLength + 4;
  return Buffer.concat([pngBuffer.subarray(0, insertAt), chunk, pngBuffer.subarray(insertAt)]);
}

function toPngBuffer(image) {
  const png = new PNG({ width: image.width, height: image.height });
  png.data = Buffer.from(image.data);
  const raw = PNG.sync.write(png);
  const pixelsPerMeter = (MODULE_PX / MODULE_MM) * 1000;
  return withPixelsPerMeter(raw, pixelsPerMeter);
}

function readPng(buffer) {
  const png = PNG.sync.read(buffer);
  return { data: new Uint8ClampedArray(png.data), width: png.width, height: png.height };
}

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
}

function proofHtml(company, sideMm, svg, payload) {
  const phones = company.phones.map((phone) => `<span>${escapeHtml(phone.display)}</span>`).join("");
  const mm = sideMm.toFixed(2);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Visiting card QR proof — ${escapeHtml(company.displayName)}</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; background: #fff; color: #142f50; }
    body { font-family: "Segoe UI", sans-serif; padding: 14mm; }
    h1 { font-size: 16px; font-weight: 650; margin: 0 0 6px; }
    p { margin: 0 0 8px; font-size: 12px; line-height: 1.45; max-width: 170mm; }
    .card {
      width: 90mm;
      height: 50mm;
      border: 0.25mm solid #142f50;
      display: grid;
      grid-template-columns: minmax(0, 1fr) ${mm}mm;
      align-items: center;
      column-gap: 3mm;
      padding: 0 4mm 0 5mm;
      margin: 8mm 0 5mm;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    .identity { display: flex; flex-direction: column; gap: 0.6mm; font-size: 8pt; line-height: 1.25; min-width: 0; }
    .identity strong { font-size: 9.5pt; line-height: 1.2; }
    .identity span { overflow-wrap: anywhere; }
    .qr { width: ${mm}mm; height: ${mm}mm; display: block; }
    .bar { width: 50mm; border-top: 0.45mm solid #142f50; margin: 2mm 0 2mm; }
    .spec { margin-top: 6mm; font-size: 10px; line-height: 1.4; color: #243044; max-width: 170mm; }
  </style>
</head>
<body>
  <h1>${escapeHtml(company.displayName)} — visiting card QR proof</h1>
  <p>Print at 100% scale. Turn off “fit to page”. The line under the card must measure 50 mm. Scan the code with a phone before the card goes to press. Keep the code black on white; do not print it in gold or on a dark ground.</p>
  <div class="card">
    <div class="identity">
      <strong>${escapeHtml(company.displayName)}</strong>
      <span>${escapeHtml(company.proprietor)}</span>
      <span>Proprietor</span>
      ${phones}
      <span>${escapeHtml(company.email)}</span>
    </div>
    ${svg.replace("<svg ", '<svg class="qr" ')}
  </div>
  <div class="bar"></div>
  <p>This line is 50 mm. If it measures anything else, the QR will print at the wrong size.</p>
  <p class="spec">Scanning opens ${escapeHtml(payload)}. Error correction H, quiet zone 4 modules, ${MODULE_MM.toFixed(2)} mm per module, ${mm} mm square including the quiet zone. Artwork file: visiting-card-qr.svg.</p>
</body>
</html>
`;
}

function certificateStatus(hostname) {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: hostname, port: 443, servername: hostname, rejectUnauthorized: true },
      () => {
        const certificate = socket.getPeerCertificate();
        socket.end();
        resolve({ ok: true, subject: certificate.subject?.CN || "" });
      },
    );
    socket.on("error", (error) => resolve({ ok: false, message: error.message }));
  });
}

async function main() {
  const company = readCompany();
  const payload = websitePayload();
  const certificate = await certificateStatus(new URL(payload).hostname);
  const symbol = QRCode.create(payload, { errorCorrectionLevel: ECC });

  const sideMm = symbolSideMm(symbol);
  const size = symbol.modules.size;
  const matrixData = matrixBytes(symbol.modules);
  check("error correction is H", symbol.errorCorrectionLevel.bit === 2);
  check(
    "print size fits a 90 × 50 mm card",
    sideMm <= MAX_SIDE_MM && sideMm > 0,
    `${sideMm.toFixed(2)} mm`,
  );
  check("module is at least 0.50 mm", MODULE_MM >= 0.5);
  check("payload is the website home page", payload === SITE_URL);
  check("payload has no contact record", !payload.includes("BEGIN:VCARD") && !payload.includes("TEL"));

  check("top-left finder", finderOk(matrixData, size, 0, 0));
  check("top-right finder", finderOk(matrixData, size, 0, size - 7));
  check("bottom-left finder", finderOk(matrixData, size, size - 7, 0));

  const master = renderRgba(matrixData, size, MODULE_PX, QUIET_MODULES);
  let grayPixels = 0;
  for (let index = 0; index < master.data.length; index += 4) {
    const value = master.data[index];
    if (value !== 0 && value !== 255) grayPixels += 1;
    if (master.data[index + 1] !== value || master.data[index + 2] !== value || master.data[index + 3] !== 255) {
      grayPixels += 1;
    }
  }
  check("modules are solid black or white", grayPixels === 0, `${grayPixels} non-binary pixels`);

  const quietPx = QUIET_MODULES * MODULE_PX;
  let quietInk = 0;
  for (let y = 0; y < master.height; y += 1) {
    for (let x = 0; x < master.width; x += 1) {
      const inQuiet = x < quietPx || y < quietPx || x >= master.width - quietPx || y >= master.height - quietPx;
      if (inQuiet && master.data[(y * master.width + x) * 4] !== 255) quietInk += 1;
    }
  }
  check("quiet zone is blank", quietInk === 0, `${quietInk} dark quiet-zone pixels`);

  check("master decodes to the website", decode(master) === payload);
  check("code still decodes when it does not fill the frame", decode(placeOnWhite(master, 36)) === payload);
  check("code decodes at 2 px per module", decode(nearest(master, MODULE_PX / 2)) === payload);
  check("mild blur still decodes", decode(boxBlur(master, 1)) === payload);
  check("blur plus shrink still decodes", decode(nearest(boxBlur(master, 1), 2)) === payload);
  // 1 px of growth on a 12 px module is about 0.04 mm of ink spread at print size.
  const spread = dilate(renderRgba(matrixData, size, 12, QUIET_MODULES));
  check("ink spread of about 0.04 mm still decodes", decode(spread) === payload);

  const margin = damageMargin(matrixData, symbol.modules, payload);
  check(
    "recovers a random 2% of data modules",
    margin.best >= 0.02,
    `${Math.round(margin.best * 100)}% of ${margin.dataModules} data modules`,
  );
  check(
    "recovers an 8 mm ink blot",
    margin.scratchModules >= 16,
    `${margin.scratchModules} modules (${(margin.scratchModules * MODULE_MM).toFixed(1)} mm)`,
  );

  const { svg, darkModules, pathData } = toSvg(matrixData, size, sideMm);
  const pathCount = pathData.match(/h1v1h-1z/g)?.length ?? 0;
  check("SVG contains every dark module", pathCount === darkModules && darkModules > 0);

  const pngBuffer = toPngBuffer(master);
  check("PNG declares print density", pngBuffer.includes(Buffer.from("pHYs")));
  check("PNG file decodes to the website", decode(readPng(pngBuffer)) === payload);

  fs.mkdirSync(outDir, { recursive: true });
  const svgPath = path.join(outDir, "visiting-card-qr.svg");
  const pngPath = path.join(outDir, "visiting-card-qr.png");
  const proofPath = path.join(outDir, "visiting-card-proof.html");
  fs.writeFileSync(svgPath, `<?xml version="1.0" encoding="UTF-8"?>\n${svg}`);
  fs.writeFileSync(pngPath, pngBuffer);
  fs.writeFileSync(proofPath, proofHtml(company, sideMm, svg, payload));

  const fromDisk = decode(readPng(fs.readFileSync(pngPath)));
  check("written PNG round-trips", fromDisk === payload);
  check("written SVG is the print master", fs.readFileSync(svgPath, "utf8").includes(`width="${sideMm.toFixed(2)}mm"`));

  const version = symbol.version;
  console.log("Visiting card QR");
  console.log(`  payload     ${payload}`);
  console.log(`  symbol      version ${version}, error correction H, mask ${symbol.maskPattern}`);
  console.log(`  print       ${sideMm.toFixed(2)} mm square, ${MODULE_MM.toFixed(2)} mm modules, ${QUIET_MODULES}-module quiet zone`);
  console.log(`  damage      random ${Math.round(margin.best * 100)}% of data modules; solid blot ${margin.scratchModules * MODULE_MM} mm`);
  console.log(`  files       ${path.relative(root, svgPath)}`);
  console.log(`              ${path.relative(root, pngPath)}`);
  console.log(`              ${path.relative(root, proofPath)}`);
  if (certificate.ok) {
    console.log(`  website     HTTPS certificate matches (${certificate.subject})`);
  } else {
    console.log(`  website     HTTPS certificate does not match this domain (${certificate.message})`);
    console.log("              Phones will warn or refuse the link until GitHub Pages issues a certificate for it.");
  }
  console.log(`  checks      ${checks.length} passed`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
