export default StaticContainer;
/**
 * Renders static content efficiently by allowing React to short-circuit the
 * reconciliation process. This component should be used when you know that a
 * subtree of components will never need to be updated.
 *
 *   const someValue = ...; // We know for certain this value will never change.
 *   return (
 *     <StaticContainer>
 *       <MyComponent value={someValue} />
 *     </StaticContainer>
 *   );
 *
 * Typically, you will not need to use this component and should opt for normal
 * React reconciliation.
 */
export class StaticContainer extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    shouldComponentUpdate(nextProps: any): boolean;
    render(): any;
}
import * as React from 'react';
