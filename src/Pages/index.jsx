import React, { Component } from 'react';

import { withHocks } from '../Context/WithParams';

class PokemonTabel extends Component {
  componentDidMount = () => {
    const { loadingParam: { dispatchLoading } } = this.props;
    dispatchLoading(false);
  }

  render() {
    return (
      <div className="row">
        <div className="col-12">
          sd
        </div>
      </div>
    );
  }
}

export default withHocks(PokemonTabel);
