/**
 * ZENNITH'S FURRY ANIMATION LIBRARY (VERSION 2023-09)
 * This HTML and associated Javascript application was written by Zennith. Copyright 2020,2023.
 * It is covered by a GPL-3.0-or-later license. Please note disclaimers of liability in the 
 * GPL-3.0-or-later license apply in full force if you use this program.
 */


class SplashScreen {
	constructor() {
		this.SPLASH_SCREEN_VISIBLE = true;
		var newScopeThis = this;
		
		this.array_of_return_cascade_elements = new Array();
		
		
		this.canvas_splash_screen = document.createElement("div");
		this.canvas_splash_screen.id = "canvas_splash_screen";
		this.canvas_splash_screen.style.position = "absolute";
		this.canvas_splash_screen.style.top = "0%";
		this.canvas_splash_screen.style.left = "0%";
		this.canvas_splash_screen.style.width = "100%";
		this.canvas_splash_screen.style.height = "100%";
		this.canvas_splash_screen.style.opacity = 1;
		this.canvas_splash_screen.style.visibility = "visible";


		this.intro_description_text = document.createElement("div");
		this.canvas_splash_screen.appendChild(newScopeThis.intro_description_text);
		this.intro_description_text.className = "no_user_select";
		this.intro_description_text.id = "intro_description_text";


		this.splash_screen_foreground = document.createElement("div");
		this.canvas_splash_screen.appendChild(this.splash_screen_foreground);
		this.splash_screen_foreground.className = "no_user_select";
		this.splash_screen_foreground.id = "splash_screen_foreground";
		
		
		this.splash_screen_background = document.createElement("div");
		this.canvas_splash_screen.appendChild(this.splash_screen_background);
		this.splash_screen_background.className = "no_user_select";
		this.splash_screen_background.id = "splash_screen_background";
		
		
		//A completely opaque layer underneath the background, so that even if 
		//the background is blurred (with fuzzy, partially transparent borders), 
		//nothing else is visible underneath.
		this.splash_screen_bedrock = document.createElement("div");
		this.canvas_splash_screen.appendChild(this.splash_screen_bedrock);
		this.splash_screen_bedrock.className = "no_user_select";
		this.splash_screen_bedrock.id = "splash_screen_bedrock";


		this.button_proceed = document.createElement("div");
		this.canvas_splash_screen.appendChild(this.button_proceed);
		
		this.button_proceed.className = "no_user_select splash_button";
		this.button_proceed.id = "button_proceed";
		this.button_proceed_additional_queued_function = null;
		this.button_proceed.onclick = function () {
			newScopeThis.button_proceed_onclick_function();
		};


		this.button_escape = document.createElement("a");
		this.canvas_splash_screen.appendChild(this.button_escape);
		
		this.button_escape.className = "no_user_select splash_button";
		this.button_escape.id = "button_escape";
		this.button_escape.href = "";
		

	}
	
	
	button_proceed_onclick_function(){
		this.set_splash_screen_visible(false);
		if(this.button_proceed_additional_queued_function != null){
			this.button_proceed_additional_queued_function.call();
		}
	}
	
	/**
	 * Adds a function that will be activated whenever this 
	 * splash screen's proceed button is clicked.
	 */
	queue_function_for_proceed_button_activation(function_to_invoke){
		this.button_proceed_additional_queued_function = function_to_invoke;
	}


	
	get_div(){
		return this.canvas_splash_screen;
	}
	
	set_proceed_button_text(string_text){
		this.button_proceed.innerHTML = string_text;
	}

	set_escape_button_text(string_text){
		this.button_escape.innerHTML = string_text;
	}

	/**
	 * 
	 * @param map_of_string_keys_to_int_values - A map of string keys (where each key represents InnerHTML) 
	 * to int values (representing milliseconds of delay). The order of insertion when you create the map,
	 * before passing the map to this method, matters.
	 */
	splash_screen_cascade(map_of_string_keys_to_int_values){
		const newScopeThis = this;
				
		//Whereas the map is convenient for the user to provide, we
		//need to unroll it into two same-length arrays to use the following functions 
		//that result in the cascading effect.
		var map_of_string_keys_to_int_values = map_of_string_keys_to_int_values;
		var map_iterator = map_of_string_keys_to_int_values.entries();
		
		var array_of_strings_representing_innerHTML = [];
		var array_of_ints_for_delays = [];
		
		for (var i = 0; i < map_of_string_keys_to_int_values.size; i++) {
			var entry_at_i = map_iterator.next().value;

			var key_at_i = entry_at_i[0];
			var value_at_i = entry_at_i[1];
			
			array_of_strings_representing_innerHTML.push(key_at_i);
			array_of_ints_for_delays.push(value_at_i);
		}


		function append_new_cascade_element(index) {
			var string_representing_innerHTML = array_of_strings_representing_innerHTML[index];
			var int_milliseconds_to_reveal = array_of_ints_for_delays[index];
			
			var return_cascade_element = document.createElement("p");
			newScopeThis.array_of_return_cascade_elements.push(return_cascade_element);
			newScopeThis.intro_description_text.appendChild(return_cascade_element);
			return_cascade_element.className = "no_user_select intro_description_text_part";
			return_cascade_element.style.opacity = 0;
			return_cascade_element.innerHTML = string_representing_innerHTML;

			setTimeout(function () {
				//due to the timeout, we need to check that these elements should still be visible.
				if (newScopeThis.get_splash_screen_visible()) {
					return_cascade_element.style.opacity = 1;

					if (index < map_of_string_keys_to_int_values.size - 1) {
						append_new_cascade_element(index + 1);
					}
				}
			}, int_milliseconds_to_reveal);
		}

		function reveal_splash_buttons_after_delay() {
			var total_delay = 0;
			for (var i = 0; i < array_of_ints_for_delays.length; i++) {
				total_delay = total_delay + array_of_ints_for_delays[i];
			}

			setTimeout(function () {
				//due to the timeout, we need to check that these elements should still be visible.
				if (newScopeThis.get_splash_screen_visible()) {
					newScopeThis.button_proceed.style.visibility = "visible";
					newScopeThis.button_proceed.style.opacity = 1;

					newScopeThis.button_escape.style.visibility = "visible";
					newScopeThis.button_escape.style.opacity = 1;
				}
			}, total_delay);
		}

		append_new_cascade_element(0);
		reveal_splash_buttons_after_delay();

	}


	/**
	 * Optionally sets a background image, that other things are displayed in front of.
	 * This method will safely ignore inputs that are undefined, null, or that have 0-length strings.
	 *
	 * @param {any} string_filename_of_image Just the filename! Don't include 'url("' or '")'...
	 * those are already added within this method, for your convenience.
	 */
	set_background_image(string_filename_of_image) {
		if (
			string_filename_of_image != undefined
			&& string_filename_of_image != null
			&& string_filename_of_image.length > 0
		) {
			this.splash_screen_background.style.backgroundImage = 'url("' + string_filename_of_image + '")';
		}
	}
	
	set_escape_url(string_url){
		this.button_escape.href = string_url;
	}
	

	/**
	 * Optionally adds a foreground element on top of this splash screen's background image.
	 * This method will safely ignore inputs that are undefined, null, or that have 0-length strings.
	 *
	 * @param {any} string_filename_of_image Just the filename! Don't include 'url("' or '")'...
	 * those are already added within this method, for your convenience.
	 */
	set_foreground_image(string_filename_of_image){
		if (
			string_filename_of_image != undefined
			&& string_filename_of_image != null
			&& string_filename_of_image.length > 0
		) {
			this.splash_screen_foreground.style.backgroundImage = "url('" + string_filename_of_image + "')";
		}
	}


	/**
	 * If set to true, this shows the splash screen.
	 * If set to false, this hides the splash screen, revealing anything underneath (such as a video).
	 * @param {any} boolean_true_false
	 */
	set_splash_screen_visible(boolean_true_false) {
		//trigger an event if this state changes.
		if (this.SPLASH_SCREEN_VISIBLE != boolean_true_false) {
			this.button_proceed.dispatchEvent(new Event("splash_screen_state_changed"));
		}
		this.SPLASH_SCREEN_VISIBLE = boolean_true_false;

		if (!this.SPLASH_SCREEN_VISIBLE) {

			
			this.splash_screen_foreground.style.opacity = 0;
			this.splash_screen_foreground.style.visibility = "hidden";

			this.splash_screen_background.style.opacity = 0;
			this.splash_screen_background.style.visibility = "hidden";
			
			for (let element of this.array_of_return_cascade_elements) {
				element.style.visibility = "hidden";
				element.style.opacity = 0;
			}
			this.canvas_splash_screen.style.opacity = 0;
			this.canvas_splash_screen.style.visibility = "hidden";
			
			
			this.splash_screen_bedrock.style.opacity = 0;
			this.splash_screen_bedrock.style.visibility = "hidden";
			
			this.button_proceed.style.opacity = 0;
			this.button_proceed.style.visibility = "hidden";
			
			this.button_escape.style.opacity = 0;
			this.button_escape.style.visibility = "hidden";
			
			this.intro_description_text.style.opacity = 0;
			this.intro_description_text.style.visibility = "hidden";


		}
		//TODO
		else {

		}
	}

	/**
	 * Returns true if the splash screen is visible (and hiding things underneath it).
	 * Returns false otherwise.
	 */
	get_splash_screen_visible() {
		return this.SPLASH_SCREEN_VISIBLE;
	}
}
