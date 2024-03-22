import { useMatch } from 'react-router-dom';
import { useMemo } from 'react';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { MyLibraryTabs, SearchParams, ViewMode } from '@/common/constants';
import { useCollectionFromUrl, useNameFromUrl, useViewMode } from '../pages/hooks';

const useMatchMyLibraryCollectionPromptVersion = () => {
  const result = useMatch({ path: RouteDefinitions.MyLibraryCollectionPromptVersionDetail });
  const collection = useCollectionFromUrl();
  const viewMode = useViewMode();
  const name = useNameFromUrl();
  return {
    isMyLibraryCollectionPromptVersionDetail: !!result,
    breadCrumbs: [
      {
        breadCrumb: collection,
        path: `${result?.pathname?.split('/prompts')[0]}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${encodeURIComponent(collection)}`
      },
      {
        breadCrumb: name,
        path: undefined,
      }
    ]
  }
};

const useMatchMyLibraryCollectionPromptDetail = () => {
  const result = useMatch({ path: RouteDefinitions.MyLibraryCollectionPromptDetail });
  const collection = useCollectionFromUrl();
  const viewMode = useViewMode();
  const name = useNameFromUrl();
  return {
    isMyLibraryCollectionPromptDetail: !!result,
    breadCrumbs: [
      {
        breadCrumb: collection,
        path: `${result?.pathname?.split('/prompts')[0]}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${encodeURIComponent(collection)}`
      },
      {
        breadCrumb: name,
        path: undefined,
      }
    ]
  }
};

const useMatchMyLibraryCollectionDetail = () => {
  const result = useMatch({ path: RouteDefinitions.MyLibraryCollectionDetail });
  const viewMode = useViewMode();
  const name = useNameFromUrl();
  return {
    isMyLibraryCollectionDetail: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
        path: `${RouteDefinitions.MyLibrary}/${MyLibraryTabs[4]}?${SearchParams.ViewMode}=${viewMode}`
      },
      {
        breadCrumb: name,
        path: undefined,
      }
    ]
  }
};

const useMatchMyLibraryPromptVersionDetail = () => {
  const result = useMatch({ path: RouteDefinitions.EditPromptVersion });
  const viewMode = useViewMode();
  const name = useNameFromUrl();
  return {
    isMyLibraryPromptVersionDetail: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
        path: `${RouteDefinitions.MyLibrary}/${MyLibraryTabs[1]}?${SearchParams.ViewMode}=${viewMode}`
      },
      {
        breadCrumb: name,
        path: undefined,
      }
    ]
  }
};

const useMatchMyLibraryPromptDetail = () => {
  const result = useMatch({ path: RouteDefinitions.EditPrompt });
  const viewMode = useViewMode();
  const name = useNameFromUrl();
  return {
    isMyLibraryPromptDetail: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
        path: `${RouteDefinitions.MyLibrary}/${MyLibraryTabs[1]}?${SearchParams.ViewMode}=${viewMode}`
      },
      {
        breadCrumb: name,
        path: undefined,
      }
    ]
  }
};

const useMatchMyLibraryWithTab = () => {
  const result = useMatch({ path: RouteDefinitions.MyLibraryWithTab });
  return {
    isMyLibraryWithTab: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
        path: undefined
      }
    ]
  }
};

const useMatchMyLibrary = () => {
  const result = useMatch({ path: RouteDefinitions.MyLibrary });
  return {
    isMyLibrary: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
        path: undefined
      }
    ]
  }
};

const useMatchViewPromptVersion = () => {
  const result = useMatch({ path: RouteDefinitions.ViewPromptVersion });
  const viewMode = useViewMode();
  const name = useNameFromUrl();
  return {
    isViewPromptVersion: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.Prompts],
        path: `${RouteDefinitions.Prompts}/${result?.params?.get('tab')}?${SearchParams.ViewMode}=${viewMode}`
      },
      {
        breadCrumb: name,
        path: undefined,
      }
    ]
  }
};

const useMatchViewPrompt = () => {
  const result = useMatch({ path: RouteDefinitions.ViewPrompt });
  const viewMode = useViewMode();
  const name = useNameFromUrl();
  return {
    isViewPrompt: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.Prompts],
        path: `${RouteDefinitions.Prompts}/${result?.params?.get('tab')}?${SearchParams.ViewMode}=${viewMode}`
      },
      {
        breadCrumb: name,
        path: undefined,
      }
    ]
  }
};

const useMatchPromptsWithTab = () => {
  const result = useMatch({ path: RouteDefinitions.PromptsWithTab });
  return {
    isPromptsWithTab: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.Prompts],
        path: undefined,
      }
    ]
  }
};

const useMatchPrompts = () => {
  const result = useMatch({ path: RouteDefinitions.Prompts });
  return {
    isPrompts: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.Prompts],
        path: undefined,
      }
    ]
  }
};

const useMatchCollectionPromptDetail = () => {
  const result = useMatch({ path: RouteDefinitions.CollectionPromptDetail });
  const collection = useCollectionFromUrl();
  const viewMode = useViewMode();
  const name = useNameFromUrl();
  return {
    isCollectionPromptDetail: !!result,
    breadCrumbs: [
      {
        breadCrumb: collection,
        path: `${RouteDefinitions.Collections}/${result?.params?.get('collectionId')}?${SearchParams.ViewMode}=${viewMode}`
      },
      {
        breadCrumb: name,
        path: undefined,
      }
    ]
  }
};

const useMatchCollectionDetail = () => {
  const result = useMatch({ path: RouteDefinitions.CollectionDetail });
  const viewMode = useViewMode();
  const name = useNameFromUrl();
  return {
    isCollectionDetail: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.Collections],
        path: `${RouteDefinitions.Collections}?${SearchParams.ViewMode}=${viewMode}`
      },
      {
        breadCrumb: name,
        path: undefined,
      }
    ]
  }
};

const useMatchCollections = () => {
  const result = useMatch({ path: RouteDefinitions.Collections });
  return {
    isCollections: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.Collections],
        path: undefined
      }
    ]
  }
};

const useMatchDataSources = () => {
  const result = useMatch({ path: RouteDefinitions.DataSources });
  return {
    isDataSources: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.DataSources],
        path: undefined
      }
    ]
  }
};

const useMatchProfile = () => {
  const result = useMatch({ path: RouteDefinitions.Profile });
  return {
    isProfile: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.Profile],
        path: undefined
      }
    ]
  }
};

const useMatchSettings = () => {
  const result = useMatch({ path: RouteDefinitions.Settings });
  return {
    isSettings: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.Settings],
        path: undefined
      }
    ]
  }
};

const useMatchCreatePrompt = () => {
  const result = useMatch({ path: RouteDefinitions.CreatePrompt });
  return {
    isCreatingPrompt: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
        path: `${RouteDefinitions.MyLibrary}/${MyLibraryTabs[1]}?${SearchParams.ViewMode}=${ViewMode.Owner}`
      },
      {
        breadCrumb: PathSessionMap[RouteDefinitions.CreatePrompt],
        path: undefined,
      }
    ]
  };
}

const useMatchCreateCollection = () => {
  const result = useMatch({ path: RouteDefinitions.CreateCollection });
  return {
    isCreatingCollection: !!result,
    breadCrumbs: [
      {
        breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
        path: `${RouteDefinitions.MyLibrary}/${MyLibraryTabs[4]}?${SearchParams.ViewMode}=${ViewMode.Owner}`
      },
      {
        breadCrumb: PathSessionMap[RouteDefinitions.CreateCollection],
        path: undefined,
      }
    ]
  };
}

const useBreadCrumbs = () => {
  const { isCreatingPrompt, breadCrumbs: breadCrumbsForCreatePrompt } = useMatchCreatePrompt();
  const { isCreatingCollection, breadCrumbs: breadCrumbsForCreateCollection } = useMatchCreateCollection();
  const { isMyLibraryCollectionPromptVersionDetail,
    breadCrumbs: breadCrumbsForMyLibraryCollectionPromptVersionDetail } = useMatchMyLibraryCollectionPromptVersion();
  const { isMyLibraryCollectionPromptDetail,
    breadCrumbs: breadCrumbsForMyLibraryCollectionPromptDetail } = useMatchMyLibraryCollectionPromptDetail();
  const { isMyLibraryCollectionDetail,
    breadCrumbs: breadCrumbsForMyLibraryCollectionDetail } = useMatchMyLibraryCollectionDetail();
  const {
    isMyLibraryPromptVersionDetail,
    breadCrumbs: breadCrumbsForMyLibraryPromptVersionDetail
  } = useMatchMyLibraryPromptVersionDetail();
  const {
    isMyLibraryPromptDetail,
    breadCrumbs: breadCrumbsForMyLibraryPromptDetail
  } = useMatchMyLibraryPromptDetail();
  const {
    isMyLibraryWithTab,
    breadCrumbs: breadCrumbsForMyLibraryWithTab
  } = useMatchMyLibraryWithTab();
  const {
    isMyLibrary,
    breadCrumbs: breadCrumbsForMyLibrary
  } = useMatchMyLibrary();
  const {
    isViewPromptVersion,
    breadCrumbs: breadCrumbsForViewPromptVersion
  } = useMatchViewPromptVersion();

  const {
    isViewPrompt,
    breadCrumbs: breadCrumbsForViewPrompt
  } = useMatchViewPrompt();

  const {
    isPromptsWithTab,
    breadCrumbs: breadCrumbsForPromptsWithTab
  } = useMatchPromptsWithTab();

  const {
    isPrompts,
    breadCrumbs: breadCrumbsForPrompts
  } = useMatchPrompts();

  const {
    isCollectionPromptDetail,
    breadCrumbs: breadCrumbsForCollectionPromptDetail,
  } = useMatchCollectionPromptDetail();

  const {
    isCollectionDetail,
    breadCrumbs: breadCrumbsForCollectionDetail,
  } = useMatchCollectionDetail();

  const {
    isCollections,
    breadCrumbs: breadCrumbsForCollections,
  } = useMatchCollections();

  const {
    isDataSources,
    breadCrumbs: breadCrumbsForDataSources,
  } = useMatchDataSources();

  const {
    isProfile,
    breadCrumbs: breadCrumbsForProfile,
  } = useMatchProfile();

  const {
    isSettings,
    breadCrumbs: breadCrumbsForSettings,
  } = useMatchSettings();


  const breadCrumbs = useMemo(() => {
    if (isMyLibraryCollectionPromptVersionDetail) {
      return breadCrumbsForMyLibraryCollectionPromptVersionDetail;
    } else if (isMyLibraryCollectionPromptDetail) {
      return breadCrumbsForMyLibraryCollectionPromptDetail;
    } else if (isMyLibraryCollectionDetail) {
      return breadCrumbsForMyLibraryCollectionDetail;
    } else if (isMyLibraryPromptVersionDetail) {
      return breadCrumbsForMyLibraryPromptVersionDetail;
    } else if (isMyLibraryPromptDetail) {
      return breadCrumbsForMyLibraryPromptDetail;
    } else if (isMyLibraryWithTab) {
      return breadCrumbsForMyLibraryWithTab;
    } else if (isMyLibrary) {
      return breadCrumbsForMyLibrary;
    } else if (isViewPromptVersion) {
      return breadCrumbsForViewPromptVersion;
    } else if (isViewPrompt) {
      return breadCrumbsForViewPrompt;
    } else if (isPromptsWithTab) {
      return breadCrumbsForPromptsWithTab;
    } else if (isPrompts) {
      return breadCrumbsForPrompts;
    } else if (isCollectionPromptDetail) {
      return breadCrumbsForCollectionPromptDetail;
    } else if (isCollectionDetail) {
      return breadCrumbsForCollectionDetail;
    } else if (isCollections) {
      return breadCrumbsForCollections;
    } else if (isDataSources) {
      return breadCrumbsForDataSources;
    } else if (isProfile) {
      return breadCrumbsForProfile;
    } else if (isSettings) {
      return breadCrumbsForSettings;
    } else if (isCreatingCollection) {
      return breadCrumbsForCreateCollection;
    } else if (isCreatingPrompt) {
      return breadCrumbsForCreatePrompt;
    }
  }, [
    breadCrumbsForMyLibraryCollectionPromptVersionDetail,
    breadCrumbsForMyLibraryCollectionPromptDetail,
    breadCrumbsForMyLibraryCollectionDetail,
    breadCrumbsForCreateCollection,
    breadCrumbsForCreatePrompt,
    breadCrumbsForMyLibraryPromptVersionDetail,
    breadCrumbsForMyLibraryPromptDetail,
    breadCrumbsForMyLibraryWithTab,
    breadCrumbsForMyLibrary,
    breadCrumbsForViewPromptVersion,
    breadCrumbsForViewPrompt,
    breadCrumbsForPromptsWithTab,
    breadCrumbsForPrompts,
    breadCrumbsForCollectionPromptDetail,
    breadCrumbsForCollectionDetail,
    breadCrumbsForCollections,
    breadCrumbsForDataSources,
    breadCrumbsForProfile,
    breadCrumbsForSettings,
    isCreatingCollection,
    isCreatingPrompt,
    isMyLibraryCollectionPromptVersionDetail,
    isMyLibraryCollectionPromptDetail,
    isMyLibraryCollectionDetail,
    isMyLibraryPromptVersionDetail,
    isMyLibraryPromptDetail,
    isMyLibraryWithTab,
    isMyLibrary,
    isViewPromptVersion,
    isViewPrompt,
    isPromptsWithTab,
    isPrompts,
    isCollectionPromptDetail,
    isCollectionDetail,
    isCollections,
    isDataSources,
    isProfile,
    isSettings,
  ]);

  return breadCrumbs;

}

export default useBreadCrumbs;