import { useState, useEffect } from "react";

const List = ({ list }) => (
  <ul>
    {list.map((item) => (
      <Item item={item} key={item.objectID}></Item>
    ))}
  </ul>
);

const Item = ({ item }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </li>
);

const InputWithLabel = ({ searchTerm, onSearch, id, label, type = "text" }) => (
  <>
    <label htmlFor={id}>{label}</label>
    <input id={id} type={type} onChange={onSearch} value={searchTerm} />
    <p>
      Searching for <strong>{searchTerm}</strong>
    </p>
  </>
);

// custom Hook
const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) ?? initialState);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);
  return [value, setValue];
};

const App = () => {
  const stories = [
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

  const [searchTerm, setSearchTerm] = useStorageState("searchTerm", "React");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        label="Search: "
        onSearch={handleSearch}
        searchTerm={searchTerm}
      />
      <hr />
      <List list={searchedStories} />
    </>
  );
};

export default App;
