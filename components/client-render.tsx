import { Component, ReactNode } from 'react';

export interface ClientRenderProps {
  children: ReactNode;
}

export interface ClientRenderState {
  isMounted: boolean;
}

/**
 * A utility component that prevents rendering on server side the data that
 * could be different in the browser (e.g. time due to different timezone).
 */
export default class ClientRender extends Component<ClientRenderProps, ClientRenderState> {
  state = { isMounted: false };

  public componentDidMount(): void {
    this.setState({ isMounted: true });
  }

  public render(): ReactNode {
    const { children } = this.props;
    const { isMounted } = this.state;

    return isMounted ? children : null;
  }
}
