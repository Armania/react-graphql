import { useEffect, useState, useCallback } from "react";
import github from "./db.js";
import githubQuery from "./Query.js";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox";
import NavButtons from "./NavButtons";

function App() {
  let [userName, setUserName] = useState("");
  let [repoList, setRepoList] = useState(null);
  let [pageCount, setPageCount] = useState(10);
  let [queryString, setQueryString] = useState("tutorial");
  let [totalCount, setTotalCount] = useState(null);
  let [startCursor, setStartCursor] = useState(null);
  let [endCursor, setEndCursor] = useState(null);
  let [hasPreviousPage, setHasPreviousPage] = useState(false);
  let [hasNextPage, setHasNextPage] = useState(true);
  let [paginationKeyword, setPaginationKeyword] = useState("first");
  let [paginationString, setPaginationString] = useState("");

  const fetchData = useCallback( () => {
    const queryText = JSON.stringify(githubQuery(pageCount, queryString));
    fetch(github.baseURL, {
      method: "POST",
      headers: github.headers,
      body: queryText,
    })
    .then(response => response.json)
    .then(data => {
      const viewer = data.data.viewer;
      const repos = data.data.search.nodes;
      const total = data.data.search.repositoryCount;
      const start = data.data.search.pageInfo?.startCursor;
      const end = data.data.search.pageInfo?.endCursor;
      const next = data.data.search.pageInfo?.hasNextPage;
      const prev = data.data.search.pageInfo?.hasPreviousPage;

      setUserName(viewer.name);
      setRepoList(repos);
      setTotalCount(total);
      setStartCursor(start);
      setEndCursor(end);
      setHasNextPage(next);
      setHasPreviousPage(prev);
      console.log(data.data);
    })
    .catch(err => {
      console.log(err);
    });
  }, [pageCount, queryString, paginationString, paginationKeyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <h1 className="text-primary"><i className="bi bi-diagram-2-fill"></i>  Repos</h1>
      <p>hi there { userName }</p>
      <SearchBox
        totalCount={totalCount}
        pageCount={pageCount}
        queryString={queryString}
        onTotalChange={(myNumber) => {
          setPageCount(myNumber);
        }}
        onQueryChange={(myString) => {
          setQueryString(myString);
        }}
      />
      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />
      { repoList && (
        <ul className="list-group list-group-flush">
          {
            repoList.map((repo) =>(
              <RepoInfo key={repo.id} repo={repo}/>
            ))
          }
        </ul>

        )}
      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />
    </div>
  );
}

export default App;