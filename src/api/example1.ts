import { apiDefinition } from "@yuyaryshev/ytransport_common";
import {anyJson, boolean, number, string} from "@mojotech/json-type-validation";

export const example1Api = apiDefinition(
    "example1",
    {
        key: number(),
        callMe: boolean(),
    },
    {
        r: string(),
        m: string(),
    },
);
