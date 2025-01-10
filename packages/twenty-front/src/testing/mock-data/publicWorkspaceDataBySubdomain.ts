import { GetPublicWorkspaceDataBySubdomainQuery } from '~/generated/graphql';

export const mockedPublicWorkspaceDataBySubdomain: GetPublicWorkspaceDataBySubdomainQuery['getPublicWorkspaceDataBySubdomain'] =
  {
    __typename: 'PublicWorkspaceDataOutput',
    id: '9870323e-22c3-4d14-9b7f-5bdc84f7d6ee',
    logo: 'workspace-logo/original/c88deb49-7636-4560-918d-08c3265ffb20.49?token=***REMOVED***',
    displayName: 'Twenty Eng',
    subdomain: 'twenty-eng',
    authProviders: {
      __typename: 'AuthProviders',
      sso: [],
      google: true,
      magicLink: false,
      password: true,
      microsoft: false,
    },
  };
