import axios from "axios";
import React from 'react'

const API_URL = 'http://openlibrary.org/search.json';

function useBookSearch(query, pageNumber) {

  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(false);

  React.useEffect(() => {
    setBooks([]);
  }, [query]);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: `${API_URL}`,
      params: {
        q: query,
        page: pageNumber
      },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(response => {
      setBooks(prevBooks => {
        return [...new Set([...prevBooks, ...response.data.docs.map(b => b.title)])];
      });
      setHasMore(response.data.docs.length > 0);
      setLoading(false);
    }).catch(error => {
      if (axios.isCancel(error)) return;
      setError(true);
    }).finally(() => {
      setLoading(false);
    });

    return () => cancel();
  }, [query, pageNumber]);

  return { 
    books,
    loading,
    error,
    hasMore
  };
}

export default useBookSearch