import { useRef } from "react";
import { useState, useEffect } from "react";

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
      {/* <button onClick={onRemoveStory.bind(null, item)} id={item.objectID}>
        delete
      </button> */}
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
  onSearch,
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
        onChange={onSearch}
        value={searchTerm}
        autoFocus={isFocused}
      />
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </>
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
  const initialStories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const getAsyncStories = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { stories: initialStories } });
      }, 2000);
    });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useStorageState("searchTerm", "React");

  const handleSearchStories = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => story.objectID !== item.objectID
    );
    setStories(newStories);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setIsLoading(true);
    getAsyncStories()
      .then((result) => {
        setStories(result.data.stories);
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);

  return (
    <>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        onSearch={handleSearchStories}
        searchTerm={searchTerm}
        isFocused
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <hr />
      {isError && "Something went wrong ..."}
      {isLoading ? (
        "Loading"
      ) : (
        <List list={searchedStories} onRemoveStory={handleRemoveStory} />
      )}
    </>
  );
};

export default App;
