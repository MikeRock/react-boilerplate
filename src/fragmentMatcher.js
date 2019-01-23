import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
const schema = require('../data/schema.json');

if (!schema)
    throw new Error('missing schema');

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
        __schema: schema.data.__schema
    }
});

export default fragmentMatcher;