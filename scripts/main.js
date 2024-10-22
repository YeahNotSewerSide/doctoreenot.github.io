
//https://github.com/Rob--W/cors-anywhere


function main() {
    const SI_API_URL = "https://vladimirkhil.com/api/si";
    const SI_API_USERAGENT = 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
    
    // NO DATA IS SAVED, BYPASSING CORS ON SI GAME'S SERVER!!!!!
    const PROXY = "https://floating-thicket-59406.herokuapp.com/"

    // Load sha1 module
    var webasm = 0;
    var WASM_LOADED = false;
    var wasm_bytes = 0;

    request = new XMLHttpRequest();
    request.open('GET', 'scripts/sha1WASM_bg.wasm');
    request.responseType = 'arraybuffer';
    request.send();

    var importObject = { imports: {} };
    request.onload = function(){
        wasm_bytes = request.response;
        WebAssembly.instantiate(wasm_bytes,importObject).then(result=>{
            webasm = result;
            WASM_LOADED = true;
        })
    } 

    const REDRAW_TIMEOUT = 30;

    // OBJECTS
    var
    // Obtain a reference to the canvas element using its id.
    game_window = document.getElementById('game_window'),
    // Obtain a graphics context on the canvas element for drawing.
    context = game_window.getContext('2d');

    // MAIN MENU
    const BUTTONS_IN_MAIN_MENU = document.getElementById('main_menu_button_group');
    var temp = BUTTONS_IN_MAIN_MENU.getBoundingClientRect();
    const BUTTONS_IN_MAIN_MENU_HEIGHT = temp.height;
    const BUTTONS_IN_MAIN_MENU_WIDTH = temp.width;

    var MMB_PLAY = document.getElementById("online_button");
    var MMB_OPTIONS = document.getElementById("options");

    // Login menu
    const BUTTONS_IN_LOGIN_MENU = document.getElementById("login_button_group");
    var temp = BUTTONS_IN_LOGIN_MENU.getBoundingClientRect();
    const BUTTONS_IN_LOGIN_MENU_HEIGHT = temp.height;
    const BUTTONS_IN_LOGIN_MENU_WIDTH = temp.width;

    var LMB_LOGIN = document.getElementById("login");
    var LMB_SET_PFP = document.getElementById("set_pfp");
    var LMB_BACK = document.getElementById("back_login");
    var LMI_USERNAME = document.getElementById("username");


    // set pfp menu
    const DRAGNDROP_ZONE_IN_SET_PFP_MENU = document.getElementById("set_pfp_group");
    var temp = DRAGNDROP_ZONE_IN_SET_PFP_MENU.getBoundingClientRect();
    const DRAGNDROP_ZONE_IN_SET_PFP_MENU_HEIGHT = temp.height;
    const DRAGNDROP_ZONE_IN_SET_PFP_MENU_WIDTH = temp.width;

    var DRAGNDROP_ZONE_PFP = document.getElementById("pfp_d&d");
    var DND_BACK = document.getElementById("back_pfp");

    // waiting screen
    const WAITING_MENU = document.getElementById("wait");
    var temp = WAITING_MENU.getBoundingClientRect();
    var WAITING_MENU_HEIGHT = temp.height;
    var WAITING_MENU_WIDTH = temp.width;
    const WAIT_NOTICE = document.getElementById("wait_notice");

    // Inspector menu
    const INSPECTOR_MENU = document.getElementById("inspector");
    const GAMES_AMOUNT_PLACEHOLDER = document.getElementById("games_amount");
    const LOBBIES_SCROLLER = document.getElementById("lobbies_scroller");
    const LOBBY_INFO_DISPLAY = document.getElementById("actualLobbyInfo");
    const INSPECTOR_CHAT = document.getElementById("chat");
    const INSPECTOR_CHAT_ENTER = document.getElementById("chatInput");

    const LID_GAME_NAME = document.getElementById("GameName");
    const LID_OWNER = document.getElementById("Owner");
    const LID_PACK = document.getElementById("Pack");
    const LID_RULES = document.getElementById("Rules");
    const LID_CREATED = document.getElementById("Created");
    const LID_BEGAN = document.getElementById("Began");
    const LID_STATUS = document.getElementById("Status");
    const LID_HOST = document.getElementById("Host");
    const LID_PLAYERS = document.getElementById("Players");
    const LID_VIEWERS = document.getElementById("Viewers");


    var last_resize = 0;
    var in_resize = false;
    var main_bg = document.getElementById('main_bg');


    // PROFILE PICTURE
    var pfp_blob = 0;
    var pfp_hash = 0;
    var pfp_url = 0;
    var pfp_filename = 0;

    // LOGIN DATA
    var USERNAME = 0;
    var TOKEN = 0;
    var SERVER_URL = 0;
    var WEBSOCKET = 0;
    var WEBSOCKET_CONNECTION_ID = 0;
    var WEBSOCKET_CONNECTION_TOKEN = 0;

    // LIVE SERVER INFO
    var USERS = new Map;
    var GAMES = new Map();
    var INITIAL_AIS = []
    var LOBBY_DISPLAYING_NOW = null;


    var stage = 0; // 0 - main menu
                    // 1 - set username/pfp
                    // 2 - set pfp
                    // 3 - waiting menu
    initialize();

    function initialize() {
        // disabling all menus
        disable_login_menu();
        disable_pfp_set_menu();
        disable_waiting_menu();
        disable_inspector_menu();

        // registering events
        window.addEventListener('resize', resizeCanvas, false);
        MMB_PLAY.addEventListener('click',MMB_PLAY_CLICK,false);
        LMB_BACK.addEventListener('click',LMB_BACK_CLICK,false);
        LMB_SET_PFP.addEventListener('click',LMB_SET_PFP_CLICK,false);
        DND_BACK.addEventListener('click',DND_BACK_CLICK,false);
        LMB_LOGIN.addEventListener('click',LMB_LOGIN_CLICK,false);
        INSPECTOR_CHAT_ENTER.addEventListener('keypress',INSPECTOR_CHAT_ON_PRESS);

        // Draw canvas border for the first time.
        resizeCanvas_wrapped();
        }

        // menu redrawers
        function redraw_main_menu() {
            context.drawImage(main_bg,0,0,
                            game_window.width,game_window.height);

            var new_height = (game_window.height - BUTTONS_IN_MAIN_MENU_HEIGHT)/2;
            var new_width = (game_window.width - BUTTONS_IN_MAIN_MENU_WIDTH)/2;

            BUTTONS_IN_MAIN_MENU.style.top = new_height;
            BUTTONS_IN_MAIN_MENU.style.left = new_width;
        }

        function redraw_login_menu() {
            context.drawImage(main_bg,0,0,
                            game_window.width,game_window.height);

            var new_height = (game_window.height - BUTTONS_IN_LOGIN_MENU_HEIGHT)/2;
            var new_width = (game_window.width - BUTTONS_IN_LOGIN_MENU_WIDTH)/2;

            BUTTONS_IN_LOGIN_MENU.style.top = new_height;
            BUTTONS_IN_LOGIN_MENU.style.left = new_width;
        }

        function redraw_set_pfp_menu(){
            context.drawImage(main_bg,0,0,
                game_window.width,game_window.height);

            var new_height = (game_window.height - DRAGNDROP_ZONE_IN_SET_PFP_MENU_HEIGHT)/2;
            var new_width = (game_window.width - DRAGNDROP_ZONE_IN_SET_PFP_MENU_WIDTH)/2;

            DRAGNDROP_ZONE_IN_SET_PFP_MENU.style.top = new_height;
            DRAGNDROP_ZONE_IN_SET_PFP_MENU.style.left = new_width;
        }

        function redraw_waiting_menu(){
            context.drawImage(main_bg,0,0,
                game_window.width,game_window.height);

            var new_height = (game_window.height - WAITING_MENU_HEIGHT)/2;
            var new_width = (game_window.width - WAITING_MENU_WIDTH)/2;
            
            WAITING_MENU.style.top = new_height;
            WAITING_MENU.style.left = new_width;
        }


        function resizeCanvas_wrapped(){
            last_resize = new Date();
            game_window.width = document.body.clientWidth;
            game_window.height = document.body.clientHeight;

            switch(stage){
                case 0:
                    redraw_main_menu();
                    break;
                case 1:
                    redraw_login_menu();
                    break;
                case 2:
                    redraw_set_pfp_menu();
                    break;
                case 3:
                    redraw_waiting_menu()
                    break;
            }
            in_resize = false;
        }
        function resizeCanvas() {
            if(in_resize){
                return;
            }
            in_resize = true;
            setTimeout(resizeCanvas_wrapped, REDRAW_TIMEOUT-(new Date() - last_resize));
        }

        // utility functions
        function clearLobbies(){
            LOBBIES_SCROLLER.textContent = '';
        }

        function get_string_from_timestamp(timestamp){
            var splitted = timestamp.split("T");
            var to_return = splitted[0];

            to_return += " "+splitted[1].split('.')[0];
            return to_return;
        }

        function change_display(id){
            LOBBY_DISPLAYING_NOW = id;
            //console.log(GAMES.get(id));
            var GAME = GAMES.get(id)

            LID_GAME_NAME.innerText = GAME.gameName;
            LID_OWNER.innerText = GAME.owner;
            LID_PACK.innerText = GAME.packageName;

            var rules_text = [];

            if((GAME.rules&1)!=0){
                rules_text += "1. С фальстартами";
            }else{
                rules_text += "1. Без фальстартов";
            }
            rules_text += "<br>";
            if((GAME.rules&2)!=0){
                rules_text += "2. Устная";
            }else{
                rules_text += "2. Текстовая";
            }
            rules_text += "<br>";
            if((GAME.rules&4)!=0){
                rules_text += "3. С правом на ошибку";
            }else{
                rules_text += "3. Без права на ошибку";
            }

            LID_RULES.innerHTML = rules_text;

            LID_CREATED.innerText = get_string_from_timestamp(GAME.startTime);

            if(GAME.started){
                LID_BEGAN.innerText = get_string_from_timestamp(GAME.realStartTime);
            }else{
                LID_BEGAN.innerHTML = "Игра еще не началась";
            }
            
            LID_STATUS.innerText = GAME.stageName;

            LID_PLAYERS.innerHTML = "";
            LID_VIEWERS.innerHTML = "";

            var players_first = true;
            var viewers_first = true;
            for(let i=0;i<GAME.persons.length;i++){
                let player = GAME.persons[i];
                if(!player.isOnline){
                    continue;
                }
                switch(player.role){
                    case 2:
                        LID_HOST.innerText = player.name; 
                        break;
                    case 1:
                        if(players_first){
                            LID_PLAYERS.innerText = player.name;
                            players_first = false;
                        }else{
                            LID_PLAYERS.innerHTML += "<br>";
                            LID_PLAYERS.innerText += player.name;
                        }
                        break;
                    case 0:
                        if(viewers_first){
                            LID_VIEWERS.innerText = player.name;
                            viewers_first = false;
                        }else{
                            LID_VIEWERS.innerHTML += "<br>";
                            LID_VIEWERS.innerText += player.name;
                        }
                        break;
                }
            }
        }

        function find_lobby_by_id(id){
            return LOBBIES_SCROLLER.querySelector("[id='"+id+"']");
        }
        function add_lobby(name,id,has_password){
            var lobby = document.createElement("div");
            lobby.setAttribute("class","lobby");
            lobby.setAttribute("id",""+id);
            lobby.addEventListener('click',LOBBY_CLICK,false);
            if(has_password){
                lobby.innerText = name;
                lobby.innerHTML += '<img align="right" style="position: absolute;top: 0px;right:0px;" src="assets/lock.png">';
            }
            else{
                lobby.innerText = name;
            }
            LOBBIES_SCROLLER.appendChild(lobby);
        }
        function remove_lobby(id){
            var lobby = find_lobby_by_id(id);
            try{
                lobby.remove();
            }catch{
                return;
            }
        }
        function set_amount_of_games(amount){
            GAMES_AMOUNT_PLACEHOLDER.innerHTML = "Игры("+amount+")";
        }

        function add_message(user,message){
            var message_block = document.createElement("div");
            var username_block = document.createElement("b");

            message_block.append(username_block);
            username_block.innerText = user;
            
            message_block.append(": "+message);
            INSPECTOR_CHAT.appendChild(message_block);
        }



        // ENABLE/DISABLE MENUS
        function enable_main_menu(){
            MMB_PLAY.removeAttribute("disabled");
            MMB_OPTIONS.removeAttribute("disabled");
            BUTTONS_IN_MAIN_MENU.removeAttribute("style");
        }
        function disable_main_menu(){
            MMB_PLAY.setAttribute("disabled","1");
            MMB_OPTIONS.setAttribute("disabled","1");
            BUTTONS_IN_MAIN_MENU.setAttribute("style","z-index:0;display:none;");
        }
        

        function enable_login_menu(){
            LMB_LOGIN.removeAttribute("disabled");
            LMB_SET_PFP.removeAttribute("disabled");
            LMB_BACK.removeAttribute("disabled");
            LMI_USERNAME.removeAttribute("disabled");
            BUTTONS_IN_LOGIN_MENU.removeAttribute("style");
        }
        function disable_login_menu(){
            LMB_LOGIN.setAttribute("disabled","1");
            LMB_SET_PFP.setAttribute("disabled","1");
            LMB_BACK.setAttribute("disabled","1");
            LMI_USERNAME.setAttribute("disabled","1");
            BUTTONS_IN_LOGIN_MENU.setAttribute("style","z-index:0;display:none;");
        }


        function enable_pfp_set_menu(){
            DND_BACK.removeAttribute("disabled");
            DRAGNDROP_ZONE_PFP.addEventListener('drop',PFP_SET_DROP_HANDLER,false);
            DRAGNDROP_ZONE_PFP.addEventListener('dragover',PFP_SET_DRAG_HANDLER,false);
            DRAGNDROP_ZONE_IN_SET_PFP_MENU.removeAttribute("style");
        }
        function disable_pfp_set_menu(){
            DND_BACK.setAttribute("disabled","1");
            DRAGNDROP_ZONE_PFP.removeEventListener('drop',PFP_SET_DROP_HANDLER,false);
            DRAGNDROP_ZONE_PFP.removeEventListener('dragover',PFP_SET_DRAG_HANDLER,false);
            DRAGNDROP_ZONE_IN_SET_PFP_MENU.setAttribute("style","z-index:0;display:none;");
        }


        function enable_waiting_menu(wait_notice){
            WAIT_NOTICE.innerText = wait_notice;
            WAITING_MENU.removeAttribute('style');
            var temp = WAITING_MENU.getBoundingClientRect();
            WAITING_MENU_HEIGHT = temp.height;
            WAITING_MENU_WIDTH = temp.width;
            
        }
        function disable_waiting_menu(){
            WAITING_MENU.setAttribute('style',"z-index:0;display:none;");
        }


        function enable_inspector_menu(){
            INSPECTOR_MENU.removeAttribute('style');
        }
        function disable_inspector_menu(){
            INSPECTOR_MENU.setAttribute('style',"z-index:0;display:none;");
        }

        // HANDLERS

        function PFP_SET_DROP_HANDLER_ON_FINISH(e){
            // LOADING IMAGE
            var img_data = e.target.result;
            console.log("finished reading");

            pfp_blob = new Blob([img_data]);
            
            var bytes = new Uint8Array(img_data);

            // getting hash
            var hash_bytes = sha1_digest(bytes,webasm);
            console.log(hash_bytes);

            // converting to base64
            var binary = '';
            var len = hash_bytes.byteLength;
            for(var i=0; i<len; i++){
                binary += String.fromCharCode(hash_bytes[i]);
            }
            pfp_hash = window.btoa(binary);
            console.log(pfp_hash);

            in_resize = true;
            disable_waiting_menu();
            enable_pfp_set_menu();
            redraw_set_pfp_menu();
            in_resize = false;
            stage = 2;

        }
        function PFP_SET_DROP_HANDLER(event){
            // LOADING IMAGE
            event.stopPropagation();
            event.preventDefault();

            var file = 0;
            if(event.dataTransfer.items){
                if(event.dataTransfer.items[0].kind === 'file'){
                    file = event.dataTransfer.items[0].getAsFile();
                }
            }else{
                file = event.dataTransfer.files[0];
            }

            if(file === 0){
                return;
            }

            if (file.type && !file.type.startsWith('image/')){
                alert("That file is not an image!");
                return;
            }
            console.log(file.size);
            if(file.size>1048576){
                alert("Размер файла не должен превышать 1мб!");
                return;
            }

            pfp_filename = file.name;
            var reader = new FileReader();
            reading_image = true;
            var img_data = 0;
            reader.addEventListener('load',(e)=>{PFP_SET_DROP_HANDLER_ON_FINISH(e)});
            reader.readAsArrayBuffer(file);

            stage = 3;

            in_resize = true;
            disable_pfp_set_menu();
            enable_waiting_menu("Загружаем фото, ждите...");
            redraw_waiting_menu();
            in_resize = false;
        }
        function PFP_SET_DRAG_HANDLER(event){
            event.stopPropagation();
            event.preventDefault();

            event.dataTransfer.dropEffect = 'copy';
        }

        function MMB_PLAY_CLICK(){
            in_resize = true;
            disable_main_menu();
            enable_login_menu();
            redraw_login_menu();
            stage = 1;
            in_resize = false;
        }

        function LMB_BACK_CLICK(){
            in_resize = true;
            disable_login_menu();
            enable_main_menu()
            redraw_main_menu()
            stage = 0;
            in_resize = false;
        }

        function LMB_SET_PFP_CLICK(){
            in_resize = true;
            disable_login_menu();
            enable_pfp_set_menu();
            redraw_set_pfp_menu();
            stage = 2;
            in_resize = false;
        }

        function DND_BACK_CLICK(){
            in_resize = true;
            disable_pfp_set_menu();
            enable_login_menu();
            redraw_login_menu();
            stage = 1;
            in_resize = false;
        }

        async function LMB_LOGIN_CLICK(){

            if(LMI_USERNAME.value === ''){
                alert('Введите никнейм!');
                return;
            }

            // set username
            USERNAME = LMI_USERNAME.value;

            in_resize = true;
            disable_login_menu();
            enable_waiting_menu("Выполняется вход...");
            redraw_waiting_menu();
            stage = 3;
            in_resize = false;

            // getting server uri
            var response = await fetch(SI_API_URL+"/servers");
            var response_decoded = await response.json();
            SERVER_URL = response_decoded[0].uri;
            console.log(SERVER_URL);

            // logging in
            response = await fetch(PROXY+SERVER_URL+"/api/Account/LogOn",{
                credentials: "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Connection': 'keep-alive',
                    'Accept-Encoding': 'gzip, deflate',
                },
                "method": "POST",
                "mode": "cors",
                'body':'login='+USERNAME+'&password='
            });

            if(response.status === 403){
                alert("Это имя запрещено на сервере!");
                in_resize = true;
                disable_waiting_menu();
                enable_login_menu();
                redraw_login_menu();
                stage = 2;
                in_resize = false;
                return;
            }
            if(response.status === 409){
                alert("Это имя занято!");
                in_resize = true;
                disable_waiting_menu();
                enable_login_menu();
                redraw_login_menu();
                stage = 2;
                in_resize = false;
                return;
            }
            
            TOKEN = await response.text();
            console.log('token: ',TOKEN);

            // uploading image
            if(pfp_blob !== 0){
                console.log("uploading image");
                var data = new FormData();
                var file = new File([pfp_blob],pfp_filename);
                data.append(pfp_hash,file);

                response = await fetch(PROXY+SERVER_URL+"/api/upload/image",{
                    credentials: "include",
                    "method":"POST",
                    "body":data,
                    "headers":{"Content-MD5":pfp_hash}
                })
                pfp_url = await response.text();
                console.log(pfp_url);
            }else{
                console.log("no image is set");
            }
            
            // get web socket
            response = await fetch(PROXY+SERVER_URL+"/sionline/negotiate?token="+TOKEN+"&negotiateVersion=1",{
                credentials: "include",
                "method": "POST"
            });
            var wss_data = await response.json();
            console.log(wss_data);

            WEBSOCKET_CONNECTION_ID = wss_data.connectionId;
            WEBSOCKET_CONNECTION_TOKEN = wss_data.connectionToken;

            WEBSOCKET = new WebSocket("wss"+SERVER_URL.slice(5)+"/sionline?token="+TOKEN+"&id="+WEBSOCKET_CONNECTION_TOKEN);

            WEBSOCKET.addEventListener('open',function(event){
                disable_waiting_menu();
                enable_inspector_menu();
                WEBSOCKET.send('{"protocol":"json","version":1}\x1E');
                WEBSOCKET.send('{"type":1,"target":"GetUsers","arguments":[],"invocationId":"initial_get_users"}\x1E');
                WEBSOCKET.send('{"arguments":[],"invocationId":"initial_get_AI","streamIds":[],"target":"GetComputerAccounts","type":1}\x1E');
                WEBSOCKET.send('{"type":1,"target":"GetGamesSlice","arguments":[0],"invocationId":"request_games"}\x1E');
            });

            WEBSOCKET.addEventListener('message',async function(event){
                var messages_raw = event.data.split("\x1E");

                try{
                    for(let i = 0;i<messages_raw.length;i++){
                        if(messages_raw[i] === ''){
                            continue;
                        }
                        await SignalRMessageHandler(JSON.parse(messages_raw[i]));
                    }
                }catch(e){
                    console.log("Error encountered");
                    console.log(e);
                    console.log(event.data);
                }
            });

        }

        function LOBBY_CLICK(event){
            LOBBY_INFO_DISPLAY.removeAttribute("style");
            var id = parseInt(event.target.attributes.getNamedItem('id').value,10);
            change_display(id);
        }

        
        function INSPECTOR_CHAT_ON_PRESS(event){
            const keyCode = event.which || event.keyCode;
            if (keyCode === 13 && !event.shiftKey) {
                event.preventDefault();
                let message = INSPECTOR_CHAT_ENTER.value;
                //console.log(INSPECTOR_CHAT_ENTER.value);
                INSPECTOR_CHAT_ENTER.value = "";
                WEBSOCKET.send('{"type":1,"target":"Say","arguments":["'+message+'"]}\x1E');
            }
        }

        /**
         * Main message handler
         * @param {JSON} message 
         */
        async function SignalRMessageHandler(message){
            if(message.type === 3){
                // if response
                if(message.invocationId === "initial_get_users"){
                    for(var i=0;i<message.result.length;i++){
                        USERS.set(message.result[i],true);
                    }
                    return;
                }else if(message.invocationId === "initial_get_AI"){
                    for(var i=0;i<message.result.length;i++){
                        INITIAL_AIS.push(message.result[i]);
                    }
                    return;
                }else if(message.invocationId === "request_games"){
                    if(message.result.isLastSlice != true){
                        WEBSOCKET.send('{"type":1,"target":"GetGamesSlice","arguments":['+(message.result.data[message.result.data.length-1].gameID+1)+'],"invocationId":"request_games"}\x1E');
                    }
                    for(var i=0;i<message.result.data.length;i++){
                        var key = message.result.data[i].gameID;
                        var game = GAMES.get(key);
                        if(game != undefined){
                            console.log("Already exists!");
                            continue;
                        }
                        add_lobby(message.result.data[i].gameName,
                                key,
                                message.result.data[i].passwordRequired);
                        GAMES.set(key,message.result.data[i]);
                        set_amount_of_games(GAMES.size);
                    }
                }
            }else if(message.type === 1){
                // if request
                if(message.target == "Leaved"){
                    USERS.delete(message.arguments[0]);
                }else if(message.target === "Joined"){
                    USERS.set(message.arguments[0],true);
                }else if(message.target === "GameChanged"){
                    GAMES.set(message.arguments[0].gameID,
                                message.arguments[0]);
                    if(LOBBY_DISPLAYING_NOW === message.arguments[0].gameID){
                        change_display(LOBBY_DISPLAYING_NOW);
                    }
                }else if(message.target === "GameDeleted"){                   
                    GAMES.delete(message.arguments[0]);
                    set_amount_of_games(GAMES.size);
                    remove_lobby(message.arguments[0]);
                    if(LOBBY_DISPLAYING_NOW === message.arguments[0]){
                        LOBBY_INFO_DISPLAY.setAttribute("style","display:none");
                    }
                    LOBBY_DISPLAYING_NOW = null;
                }
                else if(message.target === "GameCreated"){
                    GAMES.set(message.arguments[0].gameID);
                    set_amount_of_games(GAMES.size);
                    add_lobby(message.arguments[0].gameName,
                                message.arguments[0].gameID,
                                message.arguments[0].passwordRequired);
                }
                else if(message.target === "Say"){
                    add_message(message.arguments[0],
                                message.arguments[1]);
                }
            }
        }

}

// roles:
// 1 - player
// 2 - host
// 0 - viewer

// rules:
// 3 - устная, с фальстартами
// 2 - устная
// 0 - без фальстартов
// 1 - с фальстартами
// 7 - устная, право на ошибку
// MSB:
// 2 bit: 1 - Право на ошибку
// 1 bit: 1 - устная
// 0 bit: 1 - с фальстартами


// stages - 4

// modes:
// 1 - упрощенная
// 0 - классическая
