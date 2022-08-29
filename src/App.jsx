import { useState, useRef, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import useBookSearch from "./hooks/useBookSearch";

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const {
    loading,
    error,
    books,
    hasMore,
  } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);
  } , [loading, hasMore]);


  const handleChange = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className="App">
      <div className="wrapper">
        <div className="control">
          <input type="text" placeholder="Type here" value={query} onChange={handleChange}/>
        </div>
        <div className="list">
          {books.map((book, index) => {
            if (books.length === index + 1) {
              return <div ref={lastBookElementRef} key={book} className="list-item">{book}</div>
            } else {
              return <div key={book} className="list-item">{book}</div>
            }
          })}
        </div>
        <div className="is-loading">{loading && 'Loading...'}</div>
        <div className="is-error">{error && 'Error!!'}</div>
      </div>
    </div>
  )
}

export default App
