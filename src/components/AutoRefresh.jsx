import React from 'react';

const AutoRefresh = (Component) => {
  return class AutoRefreshComponent extends React.Component {
    state = { data: [] };

    componentDidMount() {
      const fetchData = async () => {
        const response = await fetch('/data');
        const jsonData = await response.json();
        this.setState({ data: jsonData });
      };

      fetchData();

      const intervalId = setInterval(fetchData, 1000);
      this.setState({ intervalId });
    }

    componentWillUnmount() {
      clearInterval(this.state.intervalId);
    }

    render() {
      return <Component data={this.state.data} />;
    }
  };
};

export default AutoRefresh;
