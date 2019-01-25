import { ApolloLink, Observable, NextLink, FetchResult, Operation } from 'apollo-link'
import { DocumentNode } from 'graphql';
import { FragmentMatcher } from 'graphql-anywhere';
import { hasDirectives, getMainDefinition } from 'apollo-utilities';

type ClientConfig = {
  cache?: any,
  resolvers: any | (() => any);
  defaults?: any;
  typeDefs?: string | string[] | DocumentNode | DocumentNode[];
  fragmentMatcher?: FragmentMatcher;
}

export default class extends ApolloLink {
  constructor() {
    super()
  }
  public request(operation: Operation, forward: NextLink = () => Observable.of({ data: {} })): Observable<FetchResult> {
    return new Observable(observer => {
      const {unsubscribe} = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer)
      })
      return () => {
        unsubscribe()
      }
    })
  }
}
