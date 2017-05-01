# 1.2.1
 * TS rewrite : TS declaration is available in dist/src/animatePaper.d.ts
 * TODO negative position supported (relative values must be of string type)
 * 

# 1.1.1
 * Color support for `paper.Group` animation
 * rgb, gray, hsl, hbs Color formats are now supported
 * TypeScript declaration

# 1.0.1
 * `paper` is now a peerDependency, this should remove unnecessary code from your dependency tree.
 * The `segmentGrow` property and `grow` effect have been removed (this feature was very buggy).
 * When using `rotate` or `scale` properties, you can provide a new setting : `center` (or `rotateCenter`/`scaleCenter`) (default is `item.position`).
 * `Animation` supports a new option `repeat` (defaults to `0`).
 * `settings.complete` callback takes the `Animation`object as 1st argument.