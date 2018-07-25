import { GraphQLSchema } from 'graphql';
import { buildSchemaSync, formatArgumentValidationError, useContainer } from 'type-graphql';
import { registerEnumType } from "type-graphql";
import { Container } from "typedi";
import { getLogger } from '../logger';
import { Gender, Role } from '../models/user.model';
import { isProduction } from '../utils';
import { UserResolver } from './resolvers/user.resolver';

import { OptionsData } from 'express-graphql';
import * as graphqlHTTP from 'express-graphql';

useContainer(Container);

const logger = getLogger('GraphQL');

export const getRootSchema = (): GraphQLSchema => {
    try {
        registerEnumType(Role, {
            name: "Role",
            description: "User role",
        });
        registerEnumType(Gender, {
            name: "Gender",
            description: "User gender",
        });
        return buildSchemaSync({
            resolvers: [UserResolver]
        });
    } catch (err) {
        logger.error('Root schema creation failed', err);
        throw err;
    }
};

export const getGraphQLHTTPServer = () => graphqlHTTP((): OptionsData => {
    try {
        return {
            schema: getRootSchema(),
            graphiql: !isProduction(),
            formatError: formatArgumentValidationError
        };
    } catch (err) {
        logger.error('GraphQL server creation failed.', err);
        throw err;
    }
});
