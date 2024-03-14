
const username = "Pangrum";
var data_chapter_id;

let current_chapter_id;

function NavigateToChapterInfo(chapter_id) {
    console.log("start");
    fetch(`/chapter/info/${chapter_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch chapter information');
            }
            console.log("receive response");
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem('chapterInfo', JSON.stringify(data)); // Storing chapter info

            current_chapter_id = chapter_id;
            console.log(current_chapter_id)

            // const username = localStorage.getItem('login_username');
            check_bought_chapter(username, chapter_id)
                .then(is_chapter_bought => {
                    console.log(is_chapter_bought)
                    if ((data.cost && is_chapter_bought) || (data.cost == 0)){
                        go_to_chapter(); // Redirecting to another page
                    } else {
                        pop_up_buy_chapter(data);
                    }
                })
                .catch(error => {
                    console.error('Error checking if chapter is bought:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching chapter information:', error);
        });
}

function go_to_chapter(){
    window.location.href = "reading_chapter.html";
}

function check_bought_chapter(username, chapter_id) {
    const url = `/check_bought_chapter/${username}?chapter_id=${chapter_id}`;
    return fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then(data => {
        console.log({data});
        return data;
    })
    .catch(error => {
        console.error('Error', error);
        throw error; // Propagate the error to be caught in NavigateToChapterInfo
    });
}



function pop_up_buy_chapter(data){
    const pop_up_element = document.getElementById('buy_chapter_pop_up');
    $('#buy_chapter_pop_up_box').remove();
    var element = `<div class="buy_chapter_header">ซื้อตอน</div>
                    <div onclick="close_pop_up_buy_chapter()" class="buy_chapter_cancel_button">
                    <img src="../assets/writearead_img/close_button_light.png">
                    </div>
                    <hr class="lines"><br>
                    <div class="pop_up_buy_chapter_name" id="buy_chapter_name">เรื่อง ${data.book_name}<br>ตอนที่ ${data.chapter_number}</div><br>
                    <div onclick="buy_chapter()" class="buy_chapter_confirm_button" id="buy_chapter_button">ซื้อเลย ${data.cost} เหรียญ</div>`;
    $('#buy_chapter_pop_up_box').append(element);
    box.append('')
    pop_up_element.style.display = 'block';
}

function close_pop_up_buy_chapter(){
    const pop_up_element = document.getElementById('buy_chapter_pop_up');
    pop_up_element.style.display = 'none';
}

function show_not_enough_coin(){
    coin_balance = localStorage.getItem('coin_balance')
    const pop_up_element = document.getElementById('buy_chapter_pop_up');
    $('#buy_chapter_pop_up_box').remove();
    var element = `<div class="buy_chapter_header">เติมคอยน์</div>
                    <div onclick="close_pop_up_buy_chapter()" class="buy_chapter_cancel_button">
                    <img src="../assets/writearead_img/close_button_light.png">
                    </div>
                    <hr class="lines"><br>
                    <div class="pop_up_buy_chapter_name" id="buy_chapter_name">คุณมียอดคอยน์คงเหลือ <a style="color:var(--coin_color)""> ${coin_balance} coins</a><br>ไม่เพียงพอในการซื้อครั้งนี้</div><br>
                    <div onclick="go_to_buy_coin()" class="buy_chapter_confirm_button" id="buy_chapter_button">เติมคอยน์</div>`;
    $('#buy_chapter_pop_up_box').append(element);
    box.append('')
    pop_up_element.style.display = 'block';
}

function show_purchased_successful(){
    const pop_up_element = document.getElementById('buy_chapter_pop_up');
    $('#buy_chapter_pop_up_box').remove();
    var element = `<div class="buy_chapter_header">ซื้อตอน</div>
                    <div onclick="close_pop_up_buy_chapter()" class="buy_chapter_cancel_button">
                    <img src="../assets/writearead_img/close_button_light.png">
                    </div>
                    <hr class="lines"><br>
                    <div class="pop_up_buy_chapter_name" id="buy_chapter_name"><a style="color:var(--main_color); font-size:16px"> ซื้อตอนสำเร็จ </a></div><br>
                    <div onclick="go_to_chapter()" class="buy_chapter_confirm_button" style="background-color: var(--main_color_light);" id="buy_chapter_button">อ่านเลย</div>`;
    $('#buy_chapter_pop_up_box').append(element);
    box.append('')
    pop_up_element.style.display = 'block'
}

function buy_chapter() {
    const jsonData = {
        username: username,
        chapter_id: current_chapter_id
    };

    const jsonDataString = JSON.stringify(jsonData);

    fetch(`/buy_chapter/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonDataString
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data === 'Done') {
            show_purchased_successful();
        } else {
            show_not_enough_coin();
        }
    })
    .catch(error => {
        console.error('Error', error);
    })
    .finally(() => {
        setTimeout(() => {
            close_pop_up_buy_chapter();
        }, 3000); // Adjust timeout as needed
    });
}
