# InstaPay Transfer Calculator

A simple, responsive web application for calculating transfer amounts and fees for InstaPay transfers.

## Features

- **Bidirectional Calculation**: Enter either the amount you want to send or the total amount to be deducted - the other field calculates automatically
- **Dynamic Fee Structure**: $1 fee for every $1000 sent, with a minimum fee of $0.50 for amounts under $1000
- **Always Round Up**: Fees are always rounded up to 2 decimal places
- **No Amount Limits**: Send any amount you want
- **Responsive Design**: Optimized for all screen sizes (desktop, tablet, mobile)
- **Real-time Updates**: Live calculation of transfer fees and fee percentages
- **Modern UI**: Clean, professional interface with smooth animations

## Fee Structure

- **$1.00 fee for every $1000 sent**
- **$0.50 minimum fee** for amounts under $1000
- **Always rounds up** to 2 decimal places

### Examples:
- Send $500 → Fee $0.50 → You pay $500.50
- Send $1000 → Fee $1.00 → You pay $1001.00
- Send $1500 → Fee $1.50 → You pay $1501.50
- Send $6542 → Fee $6.55 → You pay $6548.55

## How to Use

1. **Open `index.html`** in any modern web browser
2. **Enter an amount** in either field:
   - **Amount You Send**: What the recipient receives
   - **Amount Deducted From You**: Total amount taken from your account
3. **View results**: Transfer fee and fee percentage are calculated automatically

## Files

- `index.html` - Main HTML structure
- `style.css` - Responsive CSS styling with media queries
- `script.js` - JavaScript calculation logic

## Responsive Breakpoints

- **992px and below**: Tablet landscape
- **768px and below**: Tablet portrait
- **576px and below**: Mobile phones

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with JavaScript enabled

## Technical Details

### Fee Calculation
```javascript
// Calculate fee as $1 for every $1000
let fee = (amountSent / 1000) * 1;

// Always round up to 2 decimal places
fee = Math.ceil(fee * 100) / 100;

// Minimum fee of $0.50 for amounts under $1000
if (amountSent < 1000) {
    fee = 0.5;
}
```

### Bidirectional Calculation
- **Amount Sent → Amount Deducted**: `amountDeducted = amountSent + fee`
- **Amount Deducted → Amount Sent**: Uses iterative calculation to solve the reverse equation

## Installation

No installation required! Simply download the files and open `index.html` in your browser.

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests!

---

**Note**: This calculator is for demonstration purposes. Always verify fee calculations with your actual InstaPay service provider.
