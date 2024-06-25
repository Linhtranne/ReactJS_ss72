import React from 'react';
import { BrowserRouter as Router, Route, } from 'react-router-dom';
import AddPost from './pages/addPost';
import PostList from './pages/Post'
export default function App() {
  return (
    <Router>
        <div className="App">
        <Route path="/postlist" Component={PostList} />
        <Route path="/post" Component={AddPost} />
        </div>
    </Router>
);
}


