import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customNumber',
  standalone: true,
})
export class CustomNumberPipe implements PipeTransform {
  transform(
    value: number,
    format: string,
    currencyCode: string = 'USD'
  ): string | null {
    if (isNaN(value)) return null;

    switch (format) {
      case 'decimal':
        return value.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      case 'percent':
        return (
          (value * 100).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + '%'
        );
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
        }).format(value);
      case 'currency-symbol-only':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
          currencyDisplay: 'symbol',
        }).format(value);
      case 'currency-code-only':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
          currencyDisplay: 'code',
        }).format(value);
      case 'currency-name-only':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
          currencyDisplay: 'name',
        }).format(value);
      case 'scientific':
        return value.toExponential(2);
      case 'engineering':
        return (
          (
            value /
            Math.pow(10, Math.floor(Math.log10(Math.abs(value)) / 3) * 3)
          ).toFixed(2) +
          'e' +
          Math.floor(Math.log10(Math.abs(value)) / 3) * 3
        );
      case 'hexadecimal':
        return '0x' + value.toString(16).toUpperCase();
      case 'binary':
        return '0b' + value.toString(2);
      case 'octal':
        return '0o' + value.toString(8);
      case 'roman':
        return this.toRoman(Math.floor(value));
      case 'ordinal':
        return this.ordinalSuffixOf(Math.floor(value));
      case 'time-seconds':
        return this.formatTime(value);
      case 'time-minutes':
        return this.formatTime(value * 60);
      case 'time-hours':
        return this.formatTime(value * 3600);
      case 'bytes':
        return this.formatBytes(value);
      case 'kilobytes':
        return this.formatBytes(value * 1024);
      case 'millis':
        return this.formatMilliseconds(value);
      case 'scientific-long':
        return value.toExponential();
      default:
        return value.toString();
    }
  }

  // Helper function to convert numbers to Roman numerals
  private toRoman(num: number): string {
    const romanNumerals: { [key: number]: string } = {
      1000: 'M',
      900: 'CM',
      500: 'D',
      400: 'CD',
      100: 'C',
      90: 'XC',
      50: 'L',
      40: 'XL',
      10: 'X',
      9: 'IX',
      5: 'V',
      4: 'IV',
      1: 'I',
    };
    let result = '';
    for (const key in romanNumerals) {
      const numeral = romanNumerals[key];
      while (num >= parseInt(key)) {
        result += numeral;
        num -= parseInt(key);
      }
    }
    return result;
  }

  // Helper function to add ordinal suffix (1st, 2nd, 3rd, etc.)
  private ordinalSuffixOf(i: number): string {
    const j = i % 10;
    const k = i % 100;
    if (j == 1 && k != 11) return i + 'st';
    if (j == 2 && k != 12) return i + 'nd';
    if (j == 3 && k != 13) return i + 'rd';
    return i + 'th';
  }

  // Helper function to format time (HH:mm:ss)
  private formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  // Helper function to format milliseconds (HH:mm:ss.SSS)
  private formatMilliseconds(ms: number): string {
    const seconds = ms / 1000;
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    const msRemaining = Math.floor(ms % 1000)
      .toString()
      .padStart(3, '0');
    return `${h}:${m}:${s}.${msRemaining}`;
  }

  // Helper function to format bytes
  private formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  }
}
