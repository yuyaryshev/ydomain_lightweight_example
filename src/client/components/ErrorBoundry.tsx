import React, { ErrorInfo } from "react";

export class ErrorBoundary extends React.PureComponent<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        console.log("ErrorBoundary", error);
        //logErrorToMyService(error, info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>React: Something went wrong.</h1>;
        }
        return this.props.children;
    }
}
