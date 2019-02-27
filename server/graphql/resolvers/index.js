import { mergeResolvers } from "merge-graphql-schemas";

import FinEvent from "./FinEvent/";

const resolvers = [FinEvent];

export default mergeResolvers(resolvers);