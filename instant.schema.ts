import { i } from "@instantdb/core";

const _schema = i.schema({
    entities: {
        elements: i.entity({
            type: i.string(),
            createdAt: i.date(),
            x: i.number(),
            y: i.number(),
            width: i.number().optional(),
            height: i.number().optional(),
            color: i.string(),
        }),
    },
    links: {},
    rooms: {},
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
