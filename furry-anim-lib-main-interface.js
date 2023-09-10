/**
 * ZENNITH'S FURRY ANIMATION LIBRARY (VERSION 2023-09)
 * This HTML and associated Javascript application was written by Zennith. Copyright 2020,2023.
 * It is covered by a GPL-3.0-or-later license. Please note disclaimers of liability in the 
 * GPL-3.0-or-later license apply in full force if you use this program.
 */
 


const SYMBOL_EXIT_FULL_SCREEN = 'url("Symbol_exit_full_screen.svg")';
const SYMBOL_ENTER_FULL_SCREEN = 'url("Symbol_full_screen.svg")';

const SYMBOL_AUDIO_ON = 'url("Symbol_audio_on.svg")';
const SYMBOL_AUDIO_WITH_SLASH = 'url("Symbol_audio_off.svg")';

const SYMBOL_RIGHT_ARROW = 'url("Symbol_right_arrow.svg")';

const SYMBOL_EXTRA_ACTIONS_BUTTON = 'url("Symbol_hamburger_menu.svg")';
const SYMBOL_EXIT_BUTTON_BUTTON = 'url("Symbol_exit_button.svg")';


class MainInterface {

	constructor(
		video_source_filename,
		float_frames_per_second,
		audio_ambient_source_filename,
		audio_ambient_loop_length,
		overlay_image_filename,
		popup_menu_content,
		outer_container_div_element
	) {
		var newScopeThis = this;
		
		this.INTERFACE_SETUP_IS_COMPLETE = false;
		
		this.outer_container_div_element = outer_container_div_element;
		

		this.canvas_buttons_and_menu = document.createElement("div");
		this.canvas_buttons_and_menu.id = "canvas_buttons_and_menu";
		this.outer_container_div_element.appendChild(this.canvas_buttons_and_menu);
		
		
		//---------------------------------------------------------------------------------//
		//-- DEFINE MAJOR OBJECTS AND DEFINE SIMPLE RELATIONSHIPS -------------------------//
		//---------------------------------------------------------------------------------//

		//fullscreen toggle
		this.full_screen_state = new FullScreenState();
		this.button_full_screen_toggle = document.createElement("div");
		this.canvas_buttons_and_menu.appendChild(this.button_full_screen_toggle);
		this.button_full_screen_toggle.className = "no_user_select main_interface_buttons";
		this.button_full_screen_toggle.id = "button_full_screen_toggle";
		this.button_full_screen_toggle.style.backgroundImage = SYMBOL_ENTER_FULL_SCREEN;
		this.button_full_screen_toggle.onclick = function () {
			newScopeThis.full_screen_state.toggle_full_screen_state(outer_container_div_element);
			if(newScopeThis.full_screen_state.get_full_screen_state() == true){
				newScopeThis.button_full_screen_toggle.style.backgroundImage = SYMBOL_EXIT_FULL_SCREEN;
			}
			else{
				newScopeThis.button_full_screen_toggle.style.backgroundImage = SYMBOL_ENTER_FULL_SCREEN;
			}
		};
		
		//Add listeners to detect if the user exits full-screen by 'esc' keypress rather than the GUI, 
		//and be ready update the interface appropriately.
		if (document.addEventListener) {
			document.addEventListener('webkitfullscreenchange', fullscreen_exit_handler, false);
			document.addEventListener('mozfullscreenchange', fullscreen_exit_handler, false);
			document.addEventListener('fullscreenchange', fullscreen_exit_handler, false);
			document.addEventListener('MSFullscreenChange', fullscreen_exit_handler, false);
		}
		
		//If the browser exits full-screen, update FullScreenState's value, without
		//asking FullScreenState to perform any actions.
		function fullscreen_exit_handler() {
			console.log("exit event potentially detected");
			if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
				newScopeThis.button_full_screen_toggle.style.backgroundImage = SYMBOL_ENTER_FULL_SCREEN;
				newScopeThis.full_screen_state.IS_FULL_SCREEN = false;
			}
		}
		
		
		
		//timeline and narrative controllers
		this.timeline_controller = new TimelineController(float_frames_per_second);
		
		this.arrowhead_timeline_control = document.createElement("div");
		this.canvas_buttons_and_menu.appendChild(this.arrowhead_timeline_control);
		this.arrowhead_timeline_control.className = "no_user_select main_interface_buttons";
		this.arrowhead_timeline_control.id = "arrowhead_timeline_control";
		this.arrowhead_timeline_control.style.backgroundImage = SYMBOL_RIGHT_ARROW;
		this.arrowhead_timeline_control.onclick = function () {
			newScopeThis.timeline_controller.flag_transition();
		};

		this.narrative_text_display = document.createElement("div");
		this.canvas_buttons_and_menu.appendChild(this.narrative_text_display);
		this.narrative_text_display.className = "no_user_select main_interface_buttons";
		this.narrative_text_display.id = "button_timeline_control";
		this.narrative_text_display.innerHTML = "";
		this.narrative_text_display.onclick = function () {
			newScopeThis.timeline_controller.flag_transition(newScopeThis.narrative_text_display);
		};
				
		this.timeline_controller.bind_narrative_text_display(this.narrative_text_display);


		//Capture events triggered by timelineController.
		this.narrative_text_display.addEventListener(
			"narrative_text_changed",
			function () {
				newScopeThis.opacity_group_timeline_control.trigger_opacity_burst();
			}
		);
		
		
		
		this.narrative_text_display.addEventListener(
			"flag_transition_was_invoked",
			function () {
				newScopeThis.opacity_group_timeline_control.trigger_opacity_burst();
			}
		);
		
		console.log("timeline controller added");

		


		//video
		this.video_canvas_encaspulating_object = new VideoCanvas(video_source_filename);
		this.outer_container_div_element.appendChild(this.video_canvas_encaspulating_object.get_canvas_div());
		this.video_canvas_encaspulating_object.set_foreground_image(overlay_image_filename);
	
		this.video_element = this.video_canvas_encaspulating_object.get_media_object();
		this.timeline_controller.make_media_available_to_be_controlled(this.video_element);

		console.log("overlay image added");


		//audio
		this.sound_state = new SoundState();
		
		this.button_sound_toggle = document.createElement("div");
		this.canvas_buttons_and_menu.appendChild(this.button_sound_toggle);
		this.button_sound_toggle.className = "no_user_select main_interface_buttons";
		this.button_sound_toggle.id = "button_sound_toggle";
		this.button_sound_toggle.style.backgroundImage = SYMBOL_AUDIO_WITH_SLASH;
		this.button_sound_toggle.onclick = function () {
			newScopeThis.sound_state.toggle_sound_state();
			if(newScopeThis.sound_state.get_sound_state() == true){
				newScopeThis.button_sound_toggle.style.backgroundImage = SYMBOL_AUDIO_ON;
			}
			else{
				newScopeThis.button_sound_toggle.style.backgroundImage = SYMBOL_AUDIO_WITH_SLASH;
			}
		};
		
		

		this.audio_ambient = new AudioAmbient(audio_ambient_source_filename, audio_ambient_loop_length);
		this.sound_state.add_video_track(this.video_canvas_encaspulating_object);
		this.sound_state.add_ambient_sound_track(this.audio_ambient);
		
		console.log("A/V added");


		//popup menu
		this.popup_menu_instance = new PopupMenuDisplayArea();
		this.canvas_buttons_and_menu.appendChild(this.popup_menu_instance.get_div());
		
		this.button_extra_actions = this.popup_menu_instance.get_button();
		this.canvas_buttons_and_menu.appendChild(this.button_extra_actions);
		
		this.popup_menu_instance.add_tab_map(popup_menu_content);


		//opacity groups
		this.opacity_group_timeline_control = new ButtonOpacityBurstingGroup();
		this.opacity_group_timeline_control.add_button_for_opacity_sync(this.narrative_text_display);
		this.opacity_group_timeline_control.add_button_for_opacity_sync(this.arrowhead_timeline_control);
		
		this.opacity_group_main_interface = new ButtonOpacityBurstingGroup();
		this.opacity_group_main_interface.add_button_for_opacity_sync(this.button_full_screen_toggle);
		this.opacity_group_main_interface.add_button_for_opacity_sync(this.narrative_text_display);
		this.opacity_group_main_interface.add_button_for_opacity_sync(this.arrowhead_timeline_control);
		this.opacity_group_main_interface.add_button_for_opacity_sync(this.button_sound_toggle);
		this.opacity_group_main_interface.add_button_for_opacity_sync(this.button_extra_actions);

		this.opacity_group_timeline_control.link_competing_opacity_bursting_group(this.opacity_group_main_interface);
		
		
		console.log("opacity groups added");
		
		
		
		
		//occasionally force a resize of the buttons to address an occasional glitch where buttons become centered in the screen.
		function periodic_resize() {
			setTimeout(function () {
				newScopeThis.align_button_locations();
				periodic_resize();
			}, 500);
		}
		periodic_resize();
		
		
		//Add two listeners to the HTML document body that are important to this main interface.
		//These listeners require all objects within this interface to have already been instantiated.
		document.body.onresize = function(){newScopeThis.align_button_locations();};
		document.body.onmousemove = function(){newScopeThis.opacity_group_main_interface.trigger_opacity_burst();};
		
		
		this.INTERFACE_SETUP_IS_COMPLETE = true;
	}
	
	
	
	
	

	//---------------------------------------------------------------------------------//
	//-- METHODS TO CONTROL BUTTONS AND MENU ------------------------------------------//
	//---------------------------------------------------------------------------------//
	
	
	align_button_locations() {		
		
		
		var top_px = this.video_canvas_encaspulating_object.get_video_top();
		var height_px = this.video_canvas_encaspulating_object.get_video_height();
		var left_px = this.video_canvas_encaspulating_object.get_video_left();
		var width_px = this.video_canvas_encaspulating_object.get_video_width();

		this.canvas_buttons_and_menu.style.top = top_px + "px";
		this.canvas_buttons_and_menu.style.height = height_px + "px";
		this.canvas_buttons_and_menu.style.left = left_px + "px";
		this.canvas_buttons_and_menu.style.width = width_px + "px";

		this.popup_menu_instance.set_height(this.video_canvas_encaspulating_object.get_video_height() - 100);
		this.popup_menu_instance.set_width(this.video_canvas_encaspulating_object.get_video_width() - 150); 
		
	}
	
	

	//---------------------------------------------------------------------------------//
	//-- BASIC METHODS TO PLAY/PAUSE VIDEO AND ADJUST VOLUME ON AUDIO -----------------//
	//---------------------------------------------------------------------------------//
	
	interface_change_to_play_video() {
		var newScopeThis = this;
		this.video_canvas_encaspulating_object.set_is_visible(true);
		
		function final_prep_due_to_auto_play() {
			console.log("starting autoplay");
			newScopeThis.align_button_locations();
			newScopeThis.opacity_group_main_interface.trigger_opacity_burst();
			newScopeThis.audio_ambient.ensure_audio_playing_even_if_muted();
		}

		function final_prep_wait_on_manual_play() {
			console.log("waiting manual play");
			newScopeThis.align_button_locations();
			newScopeThis.opacity_group_main_interface.trigger_opacity_burst();
			newScopeThis.audio_ambient.ensure_audio_playing_even_if_muted();
		}

		var video_element_promise = this.video_element.play();
		if (video_element_promise !== undefined) {
			video_element_promise.then(_ => {
				final_prep_due_to_auto_play();
			}).catch(error => {
				// Autoplay was prevented.
				final_prep_wait_on_manual_play();
			});
		}
		
		this.timeline_controller.start_looping_playback();
	}


	/**
	 * When the user approves going past the splash screen into the main animation,
	 * this method should be invoked. 
	 * Specifically, this method gently signals that logic is approved to play the animation. 
	 * This allows the interface to finish setting up, in case it hasn't finished yet.
	 */
	queue_interface_change_to_play_video() {
		console.log("queue_interface_change_to_play_video");
		var newScopeThis = this;
		setTimeout(function () {
			if (!newScopeThis.INTERFACE_SETUP_IS_COMPLETE) {
				console.log("waiting");
				newScopeThis.queue_interface_change_to_play_video();
			}
			else {
				newScopeThis.interface_change_to_play_video();
			}
		}, 100);
	}


	get_popup_menu() {
		return this.popup_menu_instance;
	}


	get_timeline_controller() {
		return this.timeline_controller;
	}

	get_div() {
		return this.canvas_buttons_and_menu;
	}


}




/**
 * Creates a new ButtonOpacityBurstingGroup. All buttons added to this will 
 * be set to opacity == 0 immediately, and this group will automatically
 * start out as if there is no opacity burst in progress.
 */
class ButtonOpacityBurstingGroup {
	constructor() {
		this.button_array = new Array();
		this.default_int_delay_milliseconds = 6000;
		this.current_decay_remaining = 0;
		this.int_monitoring_rate_milliseconds = 100;

		this.activate_periodic_decay();
	}

	activate_periodic_decay() {
		var newScopeThis = this;

		function get_monitoring_rate() {
			return newScopeThis.int_monitoring_rate_milliseconds;
		}

		setTimeout(function () {
			newScopeThis.current_decay_remaining = newScopeThis.current_decay_remaining - get_monitoring_rate();
			if (newScopeThis.current_decay_remaining <= 0) {
				newScopeThis.current_decay_remaining = 0;
			}


			//if point value reaches zero, hide the interface.
			if (!newScopeThis.is_still_bursting()) {
				//if there is a linked bursting group, and
				//that bursting group is still active, don't
				//put the opacity down to zero; let the other group's
				//opacity win.
				if (newScopeThis.other_bursting_group != null) {
					//if the other group is done bursting, then all elements
					//in this group and the other group can have opacity set to 0.
					if (!newScopeThis.other_bursting_group.is_still_bursting()) {
						for (let this_button of newScopeThis.button_array) {
							this_button.style.opacity = 0;
						}
					}
					//if the other group is still currently bursting,
					//then only the unique elements in this group should have
					//opacity set to 0.
					else {
						for (let this_button of newScopeThis.button_array) {
							var is_unique = true;
							for (let other_button of newScopeThis.other_bursting_group.button_array) {
								if (other_button === this_button) {
									is_unique = false;
								}
							}
							if (is_unique) {
								this_button.style.opacity = 0;
							}
						}
					}
				}
				else {
					for (let this_button of newScopeThis.button_array) {
						this_button.style.opacity = 0;
					}
				}
			}
			newScopeThis.activate_periodic_decay();
		}, get_monitoring_rate());
	}

	is_still_bursting() {
		return this.current_decay_remaining > 0;
	}

	set_rate_of_monitoring(int_monitoring_rate_milliseconds) {
		this.int_monitoring_rate_milliseconds = int_monitoring_rate_milliseconds;
	}

	link_competing_opacity_bursting_group(other_bursting_group) {
		this.other_bursting_group = other_bursting_group;
		other_bursting_group.other_bursting_group = this;
	}

	add_button_for_opacity_sync(button_object) {
		button_object.style.opacity = 0;
		this.button_array.push(button_object);
	}

	/**
	 * Defines a delay that determines how long buttons are opaque for.
	 * The delay will start after a call to trigger_opacity_burst(), 
	 * and after the delay concludes, the buttons in this 
	 * ButtonOpacityBurstingGroup will be set to opacity == 0 again.
	 * @param {any} int_delay_milliseconds
	 */
	set_opacity_time_to_decay(int_delay_milliseconds) {
		this.default_int_delay_milliseconds = int_delay_milliseconds;
	}

	trigger_opacity_burst() {
		this.current_decay_remaining = this.default_int_delay_milliseconds;
		for (let this_button of this.button_array) {
			this_button.style.visibility = "visible";
			this_button.style.opacity = 1;
		}
	}

}



/**
 * Encapsulates all sound control, coordinated across all media objects.
 * Also provides a button to toggle sound control.
 */
class SoundState {
	constructor() {
		this.IS_AUDIBLE = false;

	}
	
	add_video_track(video_canvas) {
		this.video_canvas = video_canvas;
	}
	
	add_ambient_sound_track(sound_source) {
		this.ambient_sound_track = sound_source;
	}

	toggle_sound_state() {
		this.set_sound_state( ! this.get_sound_state());
	}
	
	
	set_sound_state(boolean_is_audible) {
		this.IS_AUDIBLE = boolean_is_audible;

		if (this.IS_AUDIBLE) {
			if (this.video_canvas != null) {
				this.video_canvas.set_mute(false);
			}
			if (this.ambient_sound_track != null) {
				this.ambient_sound_track.set_mute(false);
			}
		}
		else {
			if (this.video_canvas != null) {
				this.video_canvas.set_mute(true);
			}
			if (this.ambient_sound_track != null) {
				this.ambient_sound_track.set_mute(true);
			}
		}

	}

	get_sound_state() {
		return this.IS_AUDIBLE;
	}

}



class FullScreenState {

	constructor() {
		this.IS_FULL_SCREEN = false;


	}

	toggle_full_screen_state(outer_container_div) {
		this.set_full_screen_state( !this.get_full_screen_state(), outer_container_div);
	}

	set_full_screen_state(boolean_true_false, outer_container_div) {
		this.IS_FULL_SCREEN = boolean_true_false;
		
		if (this.IS_FULL_SCREEN) {
			if (outer_container_div.requestFullscreen) {
				outer_container_div.requestFullscreen();
			} else if (outer_container_div.mozRequestFullScreen) { // Firefox 
				outer_container_div.mozRequestFullScreen();
			} else if (outer_container_div.webkitRequestFullscreen) { // Chrome, Safari and Opera 
				outer_container_div.webkitRequestFullscreen();
			} else if (outer_container_div.msRequestFullscreen) { // IE/Edge
				outer_container_div.msRequestFullscreen();
			}
		}
		else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) { // Firefox 
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera 
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) { // IE/Edge
				document.msExitFullscreen();
			}
		}
	}

	get_full_screen_state() {
		return this.IS_FULL_SCREEN;
	}


	
}