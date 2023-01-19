import { useReducer } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const REMOVE_STORY = "REMOVE_STORY";
const STORIES_FETCH_SUCCESS = "STORIES_FETCH_SUCCESS";
const STORIES_FETCH_FAILURE = "STORIES_FETCH_FAILURE";
const STORIES_FETCH_INIT = "STORIES_FETCH_INIT";
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
const SEARCH_STORY = "SEARCH_STORY";

const storiesReducer = (state, action) => {
  switch (action.type) {
    case STORIES_FETCH_INIT:
      return { ...state, isLoading: true, isError: false };
    case STORIES_FETCH_FAILURE:
      return { ...state, isLoading: false, isError: true };
    case STORIES_FETCH_SUCCESS:
      return { data: action.payload, isLoading: false, isError: false };
    case SEARCH_STORY: {
      const newStories = state.data.filter((story) =>
        story.title.toLowerCase().includes(action.payload)
      );
      console.log(newStories);
      return { ...state, data: newStories };
    }
    case REMOVE_STORY: {
      const newStories = state.data.filter(
        (story) => story.objectID !== action.payload.objectID
      );
      return { ...state, data: newStories };
    }
    default:
      throw new Error();
  }
};

const List = ({ list, onRemoveStory }) => (
  <ul>
    {list.map((item) => (
      <Item
        item={item}
        key={item.objectID}
        onRemoveStory={onRemoveStory}
      ></Item>
    ))}
  </ul>
);

const Item = ({ item, onRemoveStory }) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <button
        onClick={(event) => {
          // console.log(event);
          onRemoveStory(item);
        }}
        id={item.objectID}
      >
        delete
      </button>
    </li>
  );
};

const InputWithLabel = ({
  searchTerm,
  onInputChange,
  id,
  children,
  type = "text",
  isFocused = false,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        onChange={onInputChange}
        value={searchTerm}
        autoFocus={isFocused}
      />
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </>
  );
};

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
  return (
    <form onSubmit={onSearchSubmit}>
      <InputWithLabel
        id="search"
        onInputChange={onSearchInput}
        searchTerm={searchTerm}
        isFocused
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button type="submit" disabled={!searchTerm}>
        Submit!
      </button>
    </form>
  );
};

// custom Hook
const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) ?? initialState);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);
  return [value, setValue];
};

const App = () => {
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });
  const [searchTerm, setSearchTerm] = useStorageState("searchTerm", "");
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  };

  const handleFetchStories = useCallback(async () => {
    if (!searchTerm) return;
    dispatchStories({ type: STORIES_FETCH_INIT });
    try {
      const result = await axios.get(url);
      dispatchStories({
        type: STORIES_FETCH_SUCCESS,
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: STORIES_FETCH_FAILURE });
    }
  }, [url]);

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  return (
    <>
      <h1>My Hacker Stories</h1>
      <SearchForm
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
      />
      <hr />
      {stories.isError && "Something went wrong ..."}
      {stories.isLoading ? (
        "Loading"
      ) : (
        <List list={stories.data} onRemoveStory={handleRemoveStory} />
      )}
    </>
  );
};

export default App;
