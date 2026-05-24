export default StateSafePureComponent;
/**
 * `setState` is called asynchronously, and should not rely on the value of
 * `this.props` or `this.state`:
 * https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
 *
 * SafePureComponent adds runtime enforcement, to catch cases where these
 * variables are read in a state updater function, instead of the ones passed
 * in.
 */
export class StateSafePureComponent extends React.PureComponent<any, any, any> {
    constructor(props: any);
    _inAsyncStateUpdate: boolean;
    setState(partialState: any, callback: any): void;
    _installSetStateHooks(): void;
}
import * as React from 'react';
