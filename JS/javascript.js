const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

// Get id from URL
const urlSearchParams = new URLSearchParams(window.location.search)
const postId = urlSearchParams.get("id")

const postPage = document.querySelector("#post")
const postContainer = document.querySelector("#post-container")
const commentContainer = document.querySelector("#comments-container")

// Get id form elements
const form = document.querySelector("#comment-form");
const formEmail = document.querySelector("#email");
const formComment = document.querySelector("#body");

// Get all posts
async function getAllPosts() {

    const response = await fetch(url);
    const data = await response.json();
    loadingElement.classList.add("hide");

    data.map((post) => {

        const div = document.createElement("div");
        const title = document.createElement("h2");
        const body = document.createElement("p");
        const link = document.createElement("a");

        title.innerHTML = post.title;
        body.innerHTML = post.body;
        link.innerText = "Ler";
        link.setAttribute("href", `/post.html?id=${post.id}`);

        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        postsContainer.appendChild(div);
    })
}

// Get individual post
async function getPost(id) {

    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ]);
    
    const dataPost = await responsePost.json();
    const dataComments = await responseComments.json();

    loadingElement.classList.add("hide");
    postPage.classList.remove("hide");

    const title = document.createElement("h1");
    const body = document.createElement("p");

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title);
    postContainer.appendChild(body);

    dataComments.map(createComment)
}

function createComment(comment) {
    const div = document.createElement("div")
    const commentEmail = document.createElement("h3");
    const commentBody = document.createElement("p");

    commentEmail.innerText = comment.email;
    commentBody.innerText = comment.body;

    div.appendChild(commentEmail);
    div.appendChild(commentBody);

    commentContainer.appendChild(div);        
}

// Post a comment
async function postComment(comment) {

    const response = await fetch(`${url}/${postId}/comments`, {
        method: "POST",
        body: comment,
        headers: {
            "Content-type": "application/json"
        }
    });

    const data = await response.json();
    console.log(data)
    createComment(data)
}

if(!postId) {
    getAllPosts();
} else {
    getPost(postId);

    // add event to comment form

    form.addEventListener("submit", (e) =>{
        e.preventDefault()
        let comment = {
            email: formEmail.value,
            body: formComment.value
        };

        comment = JSON.stringify(comment)

        postComment(comment)
        }
    )
}

