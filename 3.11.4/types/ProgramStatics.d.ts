import {EntryType} from "./models/enums/EntryType";

export declare class ProgramStatics {
    private static _ENTRY_TYPE;

    static get ENTRY_TYPE(): EntryType;

    private static _DEBUG;

    static get DEBUG(): boolean;

    private static _COMPILED;

    static get COMPILED(): boolean;

    private static _MODS;

    static get MODS(): boolean;

    private static _EXPECTED_NODE;

    static get EXPECTED_NODE(): string;

    private static _SPT_VERSION;

    static get SPT_VERSION(): string;

    private static _COMMIT;

    static get COMMIT(): string;

    private static _BUILD_TIME;

    static get BUILD_TIME(): number;

    static initialize(): void;
}
