import React, { useState } from 'react';
import '../assets/css/addPost.css';
import { Post } from '../interface/index';

const AddPost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newPost: Omit<Post, 'id'> = {
            title,
            image,
            category,
            date: new Date().toISOString().split('T')[0],
            status: 'Đã xuất bản'
        };

        fetch('http://localhost:8001/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Post created:', data);
            setTitle('');
            setImage('');
            setCategory('');
            setContent('');
        })
        .catch(error => console.error('Error creating post:', error));
    };

    return (
        <div className="add-post">
            <h2>Thêm mới bài viết</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Tên bài viết</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Hình ảnh</label>
                    <input
                        type="text"
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Thể loại</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Nội dung</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <button type="submit">Xuất bản</button>
            </form>
        </div>
    );
};

export default AddPost;
