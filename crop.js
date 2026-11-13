// Shared by the game (script.js) and the review page (review.html) so a crop
// approved in review looks identical in the game.
//
// product.image_crops = {
//   "1": { bg: "#e9e7e3", desktop: { pos: "50% 40%", fit: "cover" }, mobile: { pos: "50% 70%", fit: "contain" } },
//   "2": { ... second photo ... }
// }
(function () {
    // Matches the 800px breakpoint where cards switch to the side-by-side phone layout.
    function currentFrame() {
        return window.innerWidth <= 800 ? 'mobile' : 'desktop';
    }

    // Older hand-entered products have no image_crops; keep their previous look.
    const LEGACY_MOBILE = {
        'Succession': 'center',
        'Fresh Catch II': 'center 57%',
        'Sona Cabinet': 'center 52%',
        'Greasy Hot Dog Shelf': 'center 60%',
        'Terra Book Rack': 'center 60%',
    };

    function cropFor(product, imageNumber, frame) {
        const c = product && product.image_crops && product.image_crops[imageNumber];
        if (c && c[frame]) {
            return { pos: c[frame].pos || '50% 50%', fit: c[frame].fit || 'cover', bg: c.bg || 'transparent' };
        }
        if (frame === 'mobile') {
            return { pos: (product && LEGACY_MOBILE[product.name]) || 'center 75%', fit: 'cover', bg: 'transparent' };
        }
        return { pos: 'bottom', fit: 'cover', bg: 'transparent' };
    }

    function applyCrop(img, product, imageNumber, frame) {
        const c = cropFor(product, imageNumber, frame || currentFrame());
        img.style.objectFit = c.fit;
        img.style.objectPosition = c.pos;
        img.style.backgroundColor = c.fit === 'contain' ? c.bg : '';
        return c;
    }

    window.PBMCrop = { currentFrame, cropFor, applyCrop };
})();
