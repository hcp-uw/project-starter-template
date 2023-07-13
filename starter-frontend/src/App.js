import './App.css';
import axios from 'axios';

const baseURL = 'http://localhost:3001'

function App() {
  let message = axios.get(`${baseURL}/hello`).then(res => res);

  console.log(message)
  return (
    <>
      <h1>Hello, HCP</h1>
      <p>`${message}`</p>
    </>
  );
}

export default App;
