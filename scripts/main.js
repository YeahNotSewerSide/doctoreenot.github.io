function main() {

    const BUTTONS_IN_MAIN_MENU = document.getElementById('main_menu_button_group');
    var temp = BUTTONS_IN_MAIN_MENU.getBoundingClientRect();
    const BUTTONS_IN_MAIN_MENU_HEIGHT = temp.height;
    const BUTTONS_IN_MAIN_MENU_WIDTH = temp.width;

    const REDRAW_TIMEOUT = 30;

    var
    // Obtain a reference to the canvas element using its id.
    game_window = document.getElementById('game_window'),
    // Obtain a graphics context on the canvas element for drawing.
    context = game_window.getContext('2d');
   // Start listening to resize events and draw canvas.

    var last_resize = 0;
    var in_resize = false;
    var main_bg = document.getElementById('main_bg');
    var online_button = document.getElementById('online_button');

    var state = 0; // 0 - main menu
    initialize();
    

    function initialize() {
        // Register an event listener to call the resizeCanvas() function 
        // each time the window is resized.
        window.addEventListener('resize', resizeCanvas, false);
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

        function resizeCanvas_wrapped(){
            last_resize = new Date();
            game_window.width = window.innerWidth;
            game_window.height = window.innerHeight;

            switch(state){
                case 0:
                    redraw_main_menu();
                    break;
            }
            in_resize = false;
        }
        // Runs each time the DOM window resize event fires.
        // Resets the canvas dimensions to match window,
        // then draws the new borders accordingly.
        function resizeCanvas() {
            if(in_resize){
                return;
            }
            in_resize = true;
            setTimeout(resizeCanvas_wrapped, REDRAW_TIMEOUT-(new Date() - last_resize));
        }
}