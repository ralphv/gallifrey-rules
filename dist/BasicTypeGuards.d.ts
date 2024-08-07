export declare function IsString(value: any, optional?: boolean): value is string;
export declare function IsNumber(value: any, optional?: boolean): value is number;
export declare function IsBoolean(value: any, optional?: boolean): value is boolean;
export declare function IsArray<T>(value: any, optional?: boolean, elementFn?: ((value: any, optional: boolean) => boolean) | undefined): value is Array<T>;
export declare function IsNotNull<T>(value: T | null): value is T;
export declare function IsObject(value: unknown, optional?: boolean): value is object;
export declare function AssertTypeGuard(fn: (value: any) => boolean, value: any): void;
