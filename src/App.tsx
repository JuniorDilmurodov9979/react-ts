import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  interface INews {
    id: string;
    title: string;
    description: string;
    author: string;
    image: string;
    createdAt: string;
    view_count: number;
    avatar: string;
  }

  const [data, setData] = useState<INews[]>();
  const getData = async () => {
    const res = await axios.get(
      "https://680d00cd2ea307e081d5b195.mockapi.io/news"
    );
    return setData(res?.data);
  };
  useEffect(() => {
    getData();
  }, []);
  console.log(data);

  return ( 
    <>
      {data?.length &&
        data.map((item) => {
          return (
            <div key={item.id}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <img src={item.avatar} alt={item.author} />
            </div>
          );
        })}
    </>
  );
}

export default App;
