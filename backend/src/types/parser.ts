export interface Parser<T = any> {
    name: string;
    canParse(text: string): Promise<boolean>;
    parse(text: string): Promise<T>;
} 