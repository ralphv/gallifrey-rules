import { Draft07, Draft, JsonError } from 'json-schema-library';
import EngineCriticalError from '../errors/EngineCriticalError';
import * as fs from 'fs';

export default class JsonSchemaTester {
    static cache: { [key: string]: Draft } = {};
    public async loadAndTest(schemaFile: string, payload: any) {
        const jsonSchema = await this.getSchemaDraft(schemaFile);

        const errors: JsonError[] = jsonSchema.validate(payload);
        if (errors.length !== 0) {
            throw new EngineCriticalError(`Payload does not match defined schema: ${JSON.stringify(errors, null, 2)}`);
        }
    }

    private async getSchemaDraft(schemaFile: string) {
        if (schemaFile in JsonSchemaTester.cache) {
            return JsonSchemaTester.cache[schemaFile];
        }

        let fileContents;
        try {
            const buffer = await fs.promises.readFile(schemaFile);
            fileContents = JSON.parse(buffer.toString());
        } catch (e) {
            throw new EngineCriticalError(`Failed to load json schema file: ${schemaFile}: ${String(e)}`);
        }

        JsonSchemaTester.cache[schemaFile] = new Draft07(fileContents);
        return JsonSchemaTester.cache[schemaFile];
    }
}
