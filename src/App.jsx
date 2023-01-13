import * as React from "react";

const List = (props) => {
  console.log("List render...");

  const list = props.list;
  return (
    <>
      <h2>This List Components</h2>
      <ul>
        {list.map((item) => (
          <Item item={item} key={item.objectID}></Item>
        ))}
      </ul>
    </>
  );
};

const Item = (props) => {
  console.log("Item render...");

  const item = props.item;
  return (
    <li key={item.objectID}>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </li>
  );
};

const Search = (props) => {
  console.log("Search render...");

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleChange = (event) => {
    console.log(event.target.value);
    props.handleSearch(event.target.value);
    setSearchTerm(event.target.value);
  };

  const handleBlur = (event) => {
    console.log(event.target.value);
  };

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input
        id="search"
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </div>
  );
};

const App = () => {
  console.log("App render...");

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

  const [Stories, setStories] = React.useState(stories);

  const handleSearch = (title) => {
    let searchResult = stories.filter((story) => {
      if (story.title.indexOf(title) !== -1) return story;
    });
    console.log(searchResult);
    setStories(searchResult);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search handleSearch={handleSearch} />
      <hr />
      <List list={Stories} />
    </div>
  );
};

export default App;
