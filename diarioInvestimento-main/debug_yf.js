const pkg = require('yahoo-finance2');
console.log('Keys:', Object.keys(pkg));
console.log('Default:', pkg.default);
if (pkg.default) {
    console.log('Default Keys:', Object.keys(pkg.default));
    console.log('Default Proto:', Object.getPrototypeOf(pkg.default));
}
