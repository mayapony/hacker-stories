import { useRef } from "react";
import { useState, useEffect } from "react";

const List = ({ list, handleItemClick }) => (
  <ul>
    {list.map((item) => (
      <Item
        item={item}
        key={item.objectID}
        handleItemClick={handleItemClick}
      ></Item>
    ))}
  </ul>
);

const Item = ({ item, handleItemClick }) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <button onClick={handleItemClick} id={item.objectID}>
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
  const initStories = [
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

  const [stories, setStories] = useState(initStories);
  const [searchTerm, setSearchTerm] = useStorageState("searchTerm", "React");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleItemClick = (event) => {
    const id = event.target.id;
    setStories(stories.filter((story) => story.objectID.toString() !== id));
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        onSearch={handleSearch}
        searchTerm={searchTerm}
        isFocused
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <hr />
      <List list={searchedStories} handleItemClick={handleItemClick} />
    </>
  );
};

export default App;
