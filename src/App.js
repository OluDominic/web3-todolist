import React , { useEffect, useState, } from 'react';
import './App.css';
import { TODO_LIST_ABI, TODO_LIST_ADDRESS} from './config'
import Web3 from 'web3'
import TodoList from './todoList';
var data = require('./contractAbi.json')

function App() {

    const [account, setAccount] = useState('');
    const [taskCount, setTaskCount] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [todoList, setTodoList] = useState([])

  useEffect(()=> {
    loadBlockchainData()
  },[])

 
  
  let loadBlockchainData = async()=> {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
    const todoList = new web3.eth.Contract(data, TODO_LIST_ADDRESS);
    setTodoList(todoList)
    const taskCount = await todoList.methods.taskCount().call()
    setTaskCount(taskCount)
    for (var i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call()
      setTasks([...tasks, task])
      
    }
    setLoading(false)
  }

  const createTask=(content)=> {
    setLoading(true);
    todoList.methods.createTask(content).send({from: account})
    .once('receipt', (receipt)=> {
      setLoading(false)
    })
  }
  return (
    <div className="App">
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="http://www.dappuniversity.com/free-download" target="_blank">Dapp University | Todo List</a>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <small><a className="nav-link" href="#"><span id="account"></span></a></small>
        </li>
      </ul>
    </nav>
    <div className="container-fluid">
      <div className="row">
        <main role="main" className="col-lg-12 d-flex justify-content-center">
          <div id="loader" className="text-center"><p className="text-center">{loading}</p></div>
          {loading 
          ? <div id="loader" className="text-center"><p className="text-center">{loading}</p></div> 
          : <TodoList tasks={tasks} createTask={createTask}/>
          }
        </main>
      </div>
    </div>
    </div>
  );
}

export default App;
