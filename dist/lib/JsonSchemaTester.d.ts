import { Draft } from 'json-schema-library';
export default class JsonSchemaTester {
    static cache: {
        [key: string]: Draft;
    };
    loadAndTest(schemaFile: string, payload: any): Promise<void>;
    private getSchemaDraft;
}
