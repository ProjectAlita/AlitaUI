import * as React from 'react';

const useTabs = () => {
  const [tabItemCounts, setTabItemCounts] = React.useState({});

  const setCount = React.useCallback((count, tabIndex) => {
    setTabItemCounts({
      ...tabItemCounts,
      [tabIndex]: count
    })
  }, [tabItemCounts])
  return {
    tabItemCounts,
    setCount
  }
}

export default useTabs;