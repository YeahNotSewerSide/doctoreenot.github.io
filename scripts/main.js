function main() {

    const BUTTONS_IN_MAIN_MENU = document.getElementById('main_menu_button_group');
    var temp = BUTTONS_IN_MAIN_MENU.getBoundingClientRect();
    const BUTTONS_IN_MAIN_MENU_HEIGHT = temp.height;
    const BUTTONS_IN_MAIN_MENU_WIDTH = temp.width;

    const BUTTONS_IN_LOGIN_MENU = document.getElementById("login_button_group");
    var temp = BUTTONS_IN_LOGIN_MENU.getBoundingClientRect();
    const BUTTONS_IN_LOGIN_MENU_HEIGHT = temp.height;
    const BUTTONS_IN_LOGIN_MENU_WIDTH = temp.width;


    const REDRAW_TIMEOUT = 30;

    // OBJECTS
    var
    // Obtain a reference to the canvas element using its id.
    game_window = document.getElementById('game_window'),
    // Obtain a graphics context on the canvas element for drawing.
    context = game_window.getContext('2d');

    // Main menu
    var MMB_PLAY = document.getElementById("online_button");
    var MMB_OPTIONS = document.getElementById("options");
    var MMG_BUTTONS = document.getElementById('main_menu_button_group');

    // Login menu
    var LMB_LOGIN = document.getElementById("login");
    var LMB_SET_PFP = document.getElementById("set_pfp");
    var LMB_BACK = document.getElementById("back");
    var LMB_USERNAME = document.getElementById("username");
    var LMB_BUTTONS = document.getElementById("login_button_group");

    var last_resize = 0;
    var in_resize = false;
    var main_bg = document.getElementById('main_bg');

    var stage = 0; // 0 - main menu
                // 1 - set username/pfp
    initialize();
    

    function initialize() {
        // disabling all menus
        disable_login_menu();

        // registering events
        window.addEventListener('resize', resizeCanvas, false);
        MMB_PLAY.addEventListener('click',MMB_PLAY_CLICK,false);
        LMB_BACK.addEventListener('click',LMB_BACK_CLICK,false);

        // Draw canvas border for the first time.
        resizeCanvas_wrapped();
        }

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

        function resizeCanvas_wrapped(){
            last_resize = new Date();
            game_window.width = window.innerWidth;
            game_window.height = window.innerHeight;

            switch(stage){
                case 0:
                    redraw_main_menu();
                    break;
                case 1:
                    redraw_login_menu();
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

        function enable_main_menu(){
            MMB_PLAY.removeAttribute("disabled");
            MMB_OPTIONS.removeAttribute("disabled");
            MMG_BUTTONS.removeAttribute("style");
        }
        function disable_main_menu(){
            MMB_PLAY.setAttribute("disabled","1");
            MMB_OPTIONS.setAttribute("disabled","1");
            MMG_BUTTONS.setAttribute("style","z-index:0;display:none;");
        }
        

        function enable_login_menu(){
            LMB_LOGIN.removeAttribute("disabled");
            LMB_SET_PFP.removeAttribute("disabled");
            LMB_BACK.removeAttribute("disabled");
            LMB_USERNAME.removeAttribute("disabled");
            LMB_BUTTONS.removeAttribute("style");
        }
        function disable_login_menu(){
            LMB_LOGIN.setAttribute("disabled","1");
            LMB_SET_PFP.setAttribute("disabled","1");
            LMB_BACK.setAttribute("disabled","1");
            LMB_USERNAME.setAttribute("disabled","1");
            LMB_BUTTONS.setAttribute("style","z-index:0;display:none;");
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

}


