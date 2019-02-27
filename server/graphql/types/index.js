import { mergeTypes } from "merge-graphql-schemas";

import FinEvent from "./FinEvent/";

const typeDefs = [FinEvent];

export default mergeTypes(typeDefs, { all: true });