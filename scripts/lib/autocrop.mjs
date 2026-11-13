// Finds the product inside a photo and picks an object-position that keeps it
// in frame for each card shape the game renders. Flags images where the
// product can't fit, so a human looks at those first.
import sharp from 'sharp';

// Width / height of the image boxes in the game (see styles.css).
export const FRAMES = {
    desktop: 4 / 5,     // .card-image-container aspect-ratio 4/5
    mobile: 270 / 260,  // phones <=600px: 260px-tall card, image takes ~70% of width
};

const ANALYSIS_SIZE = 200;
const BG_THRESHOLD = 32;  // per-channel distance from background colour
const LINE_MIN = 0.015;   // a row/column counts as "product" if >=1.5% of it differs

// Bounding box of the product as fractions of the image (0..1), or null when
// the background isn't plain enough to tell (lifestyle shots).
async function findProduct(buffer) {
    const img = sharp(buffer).flatten({ background: '#ffffff' }).removeAlpha();
    const meta = await img.metadata();
    const { data, info } = await img
        .resize(ANALYSIS_SIZE, ANALYSIS_SIZE, { fit: 'inside' })
        .raw()
        .toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels: c } = info;
    const px = (x, y) => { const i = (y * w + x) * c; return [data[i], data[i + 1], data[i + 2]]; };

    // Background is judged per row against that row's own left and right edge
    // colours. Studio shots have gradient walls and plinths/floors that run off
    // the edge of the frame; treating "whatever touches the edge on this row"
    // as background keeps those out of the product box.
    const dist = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
    const avg = ps => [0, 1, 2].map(k => ps.reduce((s, p) => s + p[k], 0) / ps.length);
    const rows = new Array(h).fill(0), cols = new Array(w).fill(0);
    let fgTotal = 0;
    for (let y = 0; y < h; y++) {
        const leftBg = avg([0, 1, 2].map(x => px(x, y)));
        const rightBg = avg([w - 3, w - 2, w - 1].map(x => px(x, y)));
        for (let x = 0; x < w; x++) {
            const p = px(x, y);
            if (dist(p, leftBg) > BG_THRESHOLD && dist(p, rightBg) > BG_THRESHOLD) { rows[y]++; cols[x]++; fgTotal++; }
        }
    }
    // Lifestyle shots: most of the frame reads as "not background".
    const noisyBorder = fgTotal / (w * h) > 0.55 ? 1 : 0;
    const first = (arr, n) => arr.findIndex(v => v / n >= LINE_MIN);
    const last = (arr, n) => arr.length - 1 - [...arr].reverse().findIndex(v => v / n >= LINE_MIN);
    const top = first(rows, w), bottom = last(rows, w), left = first(cols, h), right = last(cols, h);

    // Colour of the left/right edges, used to pad the image when it's fitted
    // rather than cropped.
    const edges = [];
    for (let y = 0; y < h; y += 2) edges.push(px(0, y), px(1, y), px(w - 1, y), px(w - 2, y));
    const bgColor = '#' + avg(edges).map(v => Math.round(v).toString(16).padStart(2, '0')).join('');

    const size = { width: meta.width, height: meta.height, bgColor };
    if (top < 0 || noisyBorder > 0.25) return { size, box: null };
    const box = { top: top / h, bottom: (bottom + 1) / h, left: left / w, right: (right + 1) / w };
    // Product touching every edge means we couldn't separate it from the scene.
    const fillsFrame = box.top < 0.02 && box.bottom > 0.98 && box.left < 0.02 && box.right > 0.98;
    return { size, box: fillsFrame ? null : box };
}

// object-position along one axis so the [a,b] span (fractions) is centred
// within the visible window, clamped to the image. Returns percent + overflow.
function axisPosition(a, b, visible) {
    if (visible >= 1) return { pct: 50, cut: 0 };
    const centre = (a + b) / 2;
    const start = Math.min(Math.max(centre - visible / 2, 0), 1 - visible);
    const span = b - a;
    return {
        pct: Math.round((start / (1 - visible)) * 100),
        cut: span > visible ? (span - visible) / span : 0,
    };
}

function positionFor(size, box, frameAspect) {
    const imgAspect = size.width / size.height;
    const b = box || { top: 0.1, bottom: 0.9, left: 0.1, right: 0.9 };
    if (imgAspect < frameAspect) {
        // Taller than the frame: we crop top/bottom.
        const { pct, cut } = axisPosition(b.top, b.bottom, imgAspect / frameAspect);
        return { position: `50% ${pct}%`, cut };
    }
    const { pct, cut } = axisPosition(b.left, b.right, frameAspect / imgAspect);
    return { position: `${pct}% 50%`, cut };
}

const FIT_ABOVE = 0.12; // if cropping would cut more than this, show the whole photo instead

// -> { crops: { bg, desktop: {pos, fit}, mobile: {pos, fit} }, warnings: [...] }
//   fit 'cover'   = fill the frame, cropped at pos (CSS object-position)
//   fit 'contain' = whole photo visible, padded with the photo's edge colour
export async function autoCrop(url, label = 'image') {
    const res = await fetch(url);
    if (!res.ok) return { crops: null, warnings: [`${label}: could not download (${res.status})`] };
    const buffer = Buffer.from(await res.arrayBuffer());
    const { size, box } = await findProduct(buffer);

    const crops = { bg: size.bgColor }, warnings = [];
    if (!box) warnings.push(`${label}: busy background, couldn't locate the product — check both crops`);
    for (const [frame, aspect] of Object.entries(FRAMES)) {
        const { position, cut } = positionFor(size, box, aspect);
        if (box && cut > FIT_ABOVE) {
            crops[frame] = { pos: '50% 50%', fit: 'contain' };
        } else {
            crops[frame] = { pos: position, fit: 'cover' };
            if (box && cut > 0.04) warnings.push(`${label}: ~${Math.round(cut * 100)}% of the product is cut off on ${frame}`);
        }
    }
    return { crops, warnings, size, box };
}
