/* global __BROWSER__ */
import qhistory from 'qhistory';
import qs from 'qs';

let createHistory;

if (__BROWSER__) {
    createHistory = require('history').createBrowserHistory;
}
else {
    createHistory = require('history').createMemoryHistory;
}

export const stringifyQuery = query => qs.stringify(query, {
    arrayFormat: 'brackets',
    encodeValuesOnly: true
});

export default opts => {
    return qhistory(
        createHistory(opts),
        stringifyQuery,
        qs.parse
    );
};
