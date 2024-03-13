// const username = localStorage.getItem('login_username');
const username = "Mozaza";

show_my_writing();

const not_found_html = '<a class="not_found">ไม่พบข้อมูล</a>'
const show_book_html = `<div class="search_result_container">
                        <div class="image-container">
                            <img src="../assets/covers_img/${book_name}.png" alt="../assets/covers_img/temp_cover.jpg">
                        </div>
                        <div class="book_content_container"><br>
                            <p class="book_title">${book_name}</p>
                            <p class="book_description">${pseudonym}</p>
                            <p class="book_description">${genre}</p>
                        </div>
                    </div>`;


function show_my_writing(){
            fetch('/my_writing/' + username, {
                method: 'GET',
            })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                my_writing_display_writings(data);
            })
            .catch(error => {
                console.error(error);
            });
}

//รอเปลี่ยนเป็น API ที่ถูกต้อง
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addChapterButton').addEventListener('click', function() {
        window.location.href = "create_chapter.html"; 
    });

    function displayPreEditChapterAndNavigate(bookName) {
        console.log("start");

        fetch(`/book/${bookName}`)
            .then(response => response.json())
            .then(data => {
                console.log("oooo")
                sessionStorage.setItem('PreEditChapter', JSON.stringify(data));

                const PreEditChapter = JSON.parse(sessionStorage.getItem('PreEditChapter'));

                console.log("Retrieved book information:", data);

                if (PreEditChapter && PreEditChapter.genre && PreEditChapter.name && PreEditChapter.pseudonym && PreEditChapter.prologue && PreEditChapter.writer_name && bookInfo.date_time) {

                    document.getElementById('genre').textContent = PreEditChapter.genre;
                    document.getElementById('bookName').textContent = PreEditChapter.name;
                    document.getElementById('prologueInfo').textContent = PreEditChapter.prologue;
                    document.getElementById('prologueDisplay').textContent = PreEditChapter.prologue;
                    document.getElementById('pseudonymInfo').textContent = PreEditChapter.pseudonym;
                    document.getElementById('pseudonymDisplay').textContent = PreEditChapter.pseudonym;
                    document.getElementById('writer_username').textContent = PreEditChapter.writer_name;
                    document.getElementById('date_time').textContent = PreEditChapter.date_time;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});

function my_writing_display_writings(data) {
    $('#my_writing_show_result').empty();
    data.forEach(result => {
        display_writing_result(result);
    });
}

function display_writing_result(result){
    var book_name = result.name;
    var pseudonym = result.pseudonym;
    var genre = result.genre;
    var element = `<div class="my_writing_writing_container">
    <div class="my_writing_image_container" onclick="displayBookInfoAndNavigate('${book_name}')">
        <img src="../assets/covers_img/${book_name}.png" 
            onerror="this.onerror=null;this.src='../assets/covers_img/temp_cover.jpg';" 
            alt="../assets/covers_img/temp_cover.jpg">
    </div>
    <div class="my_writing_book_content_container"><br>
        <p class="my_writing_book_title" onclick="displayBookInfoAndNavigate('${book_name}')">${book_name}</p>
        <p class="my_writing_book_description">${pseudonym}</p>
        <p class="my_writing_book_description">${genre}</p>
    </div>
</div>`;

    var verti = `<div class="homepage_book_item">
    <div class="homepage_cover_container"><img src="../assets/covers_img/${book_name}.png"></div>
    <a class="homepage_book_title" onclick="displayBookInfoAndNavigate('${book_name}')">${book_name}</a>
    <a class="homepage_book_pseudonym">${pseudonym}</a>
</div>`
    $('#my_writing_show_result').append(element);
}