const dummy = blogs => {
    return 1;
};

const totalLikes = blogs => {
    return blogs.reduce((sum, blog) => {
        return blog.likes ? sum + blog.likes : sum + 0;
    }, 0);
};

const favoriteBlog = blogs => {
    return blogs.reduce((previous, current) =>
        previous.likes > current.likes ? previous : current
    );
};

const mostBlogs = blogs => {
    const authors = blogs.map(blog => {
        return {
            author: blog.author,
            blogs: 0
        };
    });

    blogs.forEach(blog => {
        const blogAuthor = authors.find(
            author => author.author === blog.author
        );

        blogAuthor.blogs += 1;
    });

    return authors.reduce((previous, current) =>
        previous.blogs > current.blogs ? previous : current
    );
};

const mostLikedAuthor = blogs => {
    const authors = blogs.map(blog => {
        return {
            author: blog.author,
            likes: 0
        };
    });

    blogs.forEach(blog => {
        const blogAuthor = authors.find(
            author => author.author === blog.author
        );

        blogAuthor.likes += blog.likes;
    });

    return authors.reduce((previous, current) =>
        previous.likes > current.likes ? previous : current
    );
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikedAuthor
};
