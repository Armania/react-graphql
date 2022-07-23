const githubQuery = (pageCount, queryString, paginationKeyword, paginationString) => {
  return {
    query: `
      {
        viewer {
          name
        }
        search( query: "${ queryString } user:armania sort:updated-desc", type: REPOSITORY, ${ paginationKeyword }: ${ pageCount }, ${ paginationString } ) {
          repositoryCount
          nodes {
            ... on Repository {
              name
              description
              id
              url
              viewerSubscription
              licenseInfo {
                spdxId
              }
            }
          }
        }
      }
    `
  };
};

export default githubQuery;