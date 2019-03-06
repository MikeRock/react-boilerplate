import { ComponentClass, Component } from 'react'
export type Maybe<T> = T | null
export type HOC<P> = (_Component: Maybe<ComponentClass<P, any>>) => ComponentClass<P, any>
export type Component<P, S> = ComponentClass<P, S>
export as namespace Recompose
