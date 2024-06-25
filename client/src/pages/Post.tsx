// src/components/PostList.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { fetchPosts, updatePostStatus } from '../store/reducers/userReducer';
import './PostList.css';

const PostList: React.FC = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state: RootState) => state.posts.posts);
    const postStatus = useSelector((state: RootState) => state.posts.status);
    const error = useSelector((state: RootState) => state.posts.error);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts());
        }
    }, [postStatus, dispatch]);

    const handleSearchChange = ((term: string) => {
        setSearchTerm(term);
    }, 300);

    const sortedAndFilteredPosts = [...posts]
        .filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const comparison = a.title.localeCompare(b.title);
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = sortedAndFilteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(sortedAndFilteredPosts.length / postsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSortOrderChange = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const handleToggleStatus = (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'Đã xuất bản' ? 'Đã chặn' : 'Đã xuất bản';
        dispatch(updatePostStatus({ id, status: newStatus }));
    };

    return (
        <div className="post-list">
            <h2>Danh sách bài viết</h2>
            <button onClick={handleSortOrderChange}>
                Sắp xếp theo Tên {sortOrder === 'asc' ? '(A-Z)' : '(Z-A)'}
            </button>
            <input
                type="text"
                placeholder="Tìm kiếm bài viết"
                onChange={(e) => handleSearchChange(e.target.value)}
            />
            {postStatus === 'loading' && <div>Loading...</div>}
            {postStatus === 'succeeded' && (
                <>
                    <div>Số lượng bản ghi tìm thấy: {sortedAndFilteredPosts.length}</div>
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tiêu đề</th>
                                <th>Hình ảnh</th>
                                <th>Thể loại</th>
                                <th>Ngày viết</th>
                                <th>Trạng thái</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map((post, index) => (
                                <tr key={post.id}>
                                    <td>{index + 1}</td>
                                    <td>{post.title}</td>
                                    <td><img src={post.image} alt={post.title} /></td>
                                    <td>{post.category}</td>
                                    <td>{post.date}</td>
                                    <td>{post.status}</td>
                                    <td>
                                        <button onClick={() => handleToggleStatus(post.id, post.status)}>
                                            {post.status === 'Đã xuất bản' ? 'Chặn' : 'Xuất bản'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
            {postStatus === 'failed' && <div>{error}</div>}
        </div>
    );
};

export default PostList;
