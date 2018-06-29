import { GraphQLSchema } from 'graphql';
import { buildSchema, formatArgumentValidationError, useContainer } from 'type-graphql';
import { registerEnumType } from "type-graphql";
import { Container } from "typedi";
import { Gender, Role } from '../models/user.model';
import { UserResolver } from './resolvers/user.resolver';

import { OptionsData } from 'express-graphql';
import * as graphqlHTTP from 'express-graphql';

useContainer(Container);

export async function getRootSchema(): Promise<GraphQLSchema> {
    registerEnumType(Role, {
        name: "Role",
        description: "User role",
    });
    registerEnumType(Gender, {
        name: "Gender",
        description: "User gender",
    });
    return await buildSchema({
        resolvers: [UserResolver]
    });
}

export const getGraphQLHTTPServer = () => graphqlHTTP(async (): Promise<OptionsData> => {
    return {
        schema: await getRootSchema(),
        graphiql: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev',
        formatError: formatArgumentValidationError
    };
});
