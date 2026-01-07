// Type definitions for cli-table3
// cli-table3 doesn't have official @types package, so we define our own

declare module 'cli-table3' {
  interface TableOptions {
    head?: string[];
    colWidths?: number[];
    style?: {
      head?: string[];
      border?: string[];
    };
    chars?: {
      top?: string;
      'top-mid'?: string;
      'top-left'?: string;
      'top-right'?: string;
      bottom?: string;
      'bottom-mid'?: string;
      'bottom-left'?: string;
      'bottom-right'?: string;
      left?: string;
      'left-mid'?: string;
      mid?: string;
      'mid-mid'?: string;
      right?: string;
      'right-mid'?: string;
      middle?: string;
    };
  }

  class Table {
    constructor(options?: TableOptions);
    push(row: string[]): void;
    toString(): string;
  }

  export = Table;
}

