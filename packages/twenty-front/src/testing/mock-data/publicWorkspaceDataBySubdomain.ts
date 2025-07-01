import { GetPublicWorkspaceDataByDomainQuery } from '~/generated-metadata/graphql';

export const mockedPublicWorkspaceDataBySubdomain: GetPublicWorkspaceDataByDomainQuery['getPublicWorkspaceDataByDomain'] =
  {
    __typename: 'PublicWorkspaceDataOutput',
    id: '9870323e-22c3-4d14-9b7f-5bdc84f7d6ee',
    logo: 'workspace-logo/original/c88deb49-7636-4560-918d-08c3265ffb20.49?token=***REMOVED***',
    displayName: 'Twenty Eng',
    workspaceUrls: {
      __typename: 'WorkspaceUrls',
      customUrl: 'https://twenty-eng.com',
      subdomainUrl: 'https://custom.twenty.com',
    },
    authProviders: {
      __typename: 'AuthProviders',
      sso: [],
      google: true,
      magicLink: false,
      password: true,
      microsoft: false,
    },
  };
