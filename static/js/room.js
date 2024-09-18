
const roomName = JSON.parse(document.getElementById('room-name').textContent);

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data); // data.message contains the message

    console.log("=> data", data)

    switch (data.type) {

        case "new_message":

            let ul_tag = document.getElementById('chat-log')
            ul_tag.innerHTML += `
                    <div style="display:flex">
                        <div class="message-parent-css">
                          <img src="/static/images/japan.png" width="26" height="26" alt="Japan Flag">

                        </div>
                        <div style="width: 95%;">
                            <div id="message-by-user" style="color:#5865f2;">
                                ${data.user_name}
                            </div>
                            <div id="message-content">
                                ${data.message}
                            </div>
                        </div>
                    </div>
                    <hr />
                    `

            // scroll to the last li tag of ul
            document.getElementById("chat-log").lastElementChild.scrollIntoView({ behavior: "smooth" });
            break;

        case "user_list":

            let online_users_span = document.getElementById('num-of-users')
            let ul_tag_online = document.getElementById('online-logs')
            let li_tag_online = document.createElement('li')

            // console.log("childrens =>", ul_tag_online.childNodes)

            // removing already existing users
            var childElements = document.getElementById('online-logs')

            var delChild = childElements.lastChild;

            while (delChild) {
                childElements.removeChild(delChild);
                delChild = childElements.lastChild;
            }

            for (let i = 0; i < data.users.length; i++) {
                let new_user = data.users[i]
                // li_tag_online.appendChild(document.createTextNode(new_user))
                // ul_tag_online.appendChild(li_tag_online)
                ul_tag_online.innerHTML += `
                <img class="japan-icon-css2" src="/static/images/japan.png" height="26px" width="26px" />                            
                        ${new_user}
                        <div style="margin-bottom:12px;"></div>
                        `
            }

            // online users count
            online_users_span.innerHTML = ''
            online_users_span.innerHTML += `(${data.users.length})`

            // scroll to the last li tag of ul
            document.getElementById("chat-log").lastElementChild.scrollIntoView({ behavior: "smooth" });

            break;

        case "forbidden_access":
            alert("Login required!")
            window.location.pathname = "/chat/"
            break;

        default:
            console.log("running default")
            return null
    }
};

chatSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly, redirecting to chat page');
    // alert("permission denied!")
    // window.location.pathname = "/chat/"            
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function (e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#chat-message-submit').click();
    }
};

document.querySelector('#chat-message-submit').onclick = function (e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    const message = messageInputDom.value;
    chatSocket.send(JSON.stringify({
        'message': message
    }));
    messageInputDom.value = '';
    document.querySelector('#chat-message-input').focus();
};