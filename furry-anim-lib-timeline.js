/**
 * ZENNITH'S FURRY ANIMATION LIBRARY (VERSION 2023-09)
 * This HTML and associated Javascript application was written by Zennith. Copyright 2020,2023.
 * It is covered by a GPL-3.0-or-later license. Please note disclaimers of liability in the 
 * GPL-3.0-or-later license apply in full force if you use this program.
 */
 
 
 class LabeledFrame{
	constructor(int_frame_number){
		this.int_frame_number = int_frame_number;
	}
	
	set_frame_number(int_frame_number){
		this.int_frame_number = int_frame_number;
	}
	
	get_frame_number(){
		return this.int_frame_number;
	}
}



class LabeledLoop{
	constructor(labeled_frame_start, labeled_frame_end){
		this.labeled_frame_start = labeled_frame_start;
		this.labeled_frame_end = labeled_frame_end;
	}
	set_start_frame(labeled_frame_start){
		this.labeled_frame_start = labeled_frame_start;
	}
	set_end_frame(labeled_frame_end){
		this.labeled_frame_end = labeled_frame_end;
	}
	get_start_frame(){
		return this.labeled_frame_start;
	}
	get_end_frame(){
		return this.labeled_frame_end;
	}
}

class NarrativeFrame{
	constructor(labeled_frame, string_narrative_text){
		this.labeled_frame = labeled_frame;
		this.string_narrative_text = string_narrative_text;
	}
	set_frame(labeled_frame){
		this.labeled_frame = labeled_frame;
	}
	set_narrative_text(string_narrative_text){
		this.string_narrative_text = string_narrative_text;
	}
	get_frame(){
		return this.labeled_frame;
	}
	get_narrative_text(){
		return this.string_narrative_text;
	}
}



/**
 * A TimelineController allows you to control play of a video or media object with any number of loops,
 * where the loops can smoothly transition from one to the next. Additionally, this provides a time-based
 * readout of a list of text descriptions that let you tell a narrative according to the time within
 * the media's play.
 */
class TimelineController {

	constructor(frames_per_second) {
		var newScopeThis = this;
		
		this.frames_per_second = frames_per_second;
		
		this.narrative_text_display = null;

		this.media_object = null;
		
		this.array_of_loops = new Array();
		this.new_current_loop_index = 0;
		
		this.narrative_frames = new Array();

	}
	
	/**
	 * Given this TimelineController's frames_per_second (set when constructing this TimelineController), 
	 * convert_frames_to_seconds(frame_number) will take the frame_number provided and return
	 * the equivalent amount of time in seconds (as a floating-point number).
	 */
	convert_frames_to_seconds(frame_number){
		return (frame_number + 0.0) / this.frames_per_second;
	}


	//---------------------------------------------------------------------------------//
	//-- RELATIONSHIPS BETWEEN OBJECTS ------------------------------------------------//
	//---------------------------------------------------------------------------------//

	/**
	 * Makes the media object available to this TimelineController to be controlled. Note that multiple
	 * TimeRange instances are allowed to control the same media object.
	 * 
	 * The media may be added any time before, during, or after adding TimeRange objects.
	 * @param {any} media_object
	 */
	make_media_available_to_be_controlled(media_object) {
		this.media_object = media_object;
		var newScopeThis = this;
		
		var thisMediaObject = this.media_object;
		
		
		
		//Set up the video to loop, overall.
		//More specifically, set up a polling function that will quickly reset the 
		//video to frame zero once it reaches the end, so it can loop.
		var refresh_frequency_milliseconds = 50;
		function poll_video_for_loop_back_to_frame_zero() {
			setTimeout(function () {
				if(thisMediaObject.ended){
					thisMediaObject.currentTime = 0;
				}
				poll_video_for_loop_back_to_frame_zero();
			}, refresh_frequency_milliseconds);
		}
		poll_video_for_loop_back_to_frame_zero();
		
		
	}

	/**
	 * Links to an HTML DOM element that dynamically displays the narrative text.
	 * When the text is changed, the element will be notified with an Event "narrative_text_changed".
	 * @param {HTML DOM element} narrative_text_display
	 */
	bind_narrative_text_display(narrative_text_display) {
		this.narrative_text_display = narrative_text_display;
		var newScopeThis = this;
		var refresh_frequency_milliseconds = 250;
		
		function refresh_text_displayed_by_the_return_object() {
			setTimeout(function () {
				if (newScopeThis.media_object != null) {
					var current_text_displayed = newScopeThis.narrative_text_display.innerHTML;
					var text_at_time = newScopeThis.get_current_narrative_text_on_timeline();

					if (text_at_time + "" != current_text_displayed) {
						newScopeThis.narrative_text_display.innerHTML = text_at_time;
						newScopeThis.narrative_text_display.dispatchEvent(new Event("narrative_text_changed"));
					}

				}
				refresh_text_displayed_by_the_return_object();
			}, refresh_frequency_milliseconds);
		}
		refresh_text_displayed_by_the_return_object();
		

	}



	//---------------------------------------------------------------------------------//
	//-- TIME DEFINITIONS AND CONFIGURATION OF LOOPS ----------------------------------//
	//---------------------------------------------------------------------------------//

	/**
	 * Adds a new loop to this TimelineController. The order of addition matters. Progression through loops 
	 * is assumed to proceed from the earliest frames to the latest frames in the video. 
	 * 
	 * Unexpected behavior may occur if loops are added in an order that
	 * differs from when they actually occur in time.
	 */
	add_loop(labeled_loop){
		this.array_of_loops.push(labeled_loop);
	}
	


	//---------------------------------------------------------------------------------//
	//-- LIVE PLAY --------------------------------------------------------------------//
	//---------------------------------------------------------------------------------//

	start_looping_playback() {
		this.set_playback_loop(0);
	}
	
	/**
	 * Determines what the next loop would be for this timeline. More specifically, all possible loops
	 * are listed within a TIME-SORTED array of the TimelineController, and each loop is accessed by index.
	 * The index that would correspond to the next loop is returned.
	 * This method does not mutate any objects.
	 */
	peek_at_next_loop_index(){
		var determining_next_index_result = this.new_current_loop_index + 1;
		if(determining_next_index_result >= this.array_of_loops.length){
			determining_next_index_result = 0;
		}
		
		return determining_next_index_result;
	}
	
	
	/**
	 * Returns the currently designated loop in this TimelineController.
	 * It is possible that the playhead is outside of the loop, e.g. that the video is
	 * playing and has not yet entered the loop area. 
	 */
	get_current_loop(){
		var current_loop = this.array_of_loops[this.new_current_loop_index];
		return current_loop;
	}
	
	
	get_current_loop_start_seconds(){
		var current_loop = this.get_current_loop();
		var current_loop_start_frame = current_loop.get_start_frame();
		var current_loop_start_time = this.convert_frames_to_seconds(
			current_loop_start_frame.get_frame_number()
		);
		
		return current_loop_start_time;
	}
	
	
	get_current_loop_end_seconds(){
		var current_loop = this.get_current_loop();
		var current_loop_end_frame = current_loop.get_end_frame();
		var current_loop_end_time = this.convert_frames_to_seconds(
			current_loop_end_frame.get_frame_number()
		);
		
		return current_loop_end_time;
	}
	
	
	/**
	 * Calculates the position of the playhead, in seconds, after the start of the
	 * currently specified loop. If the returned number is positive, the current time
	 * is after the loop's start time. If the returned number is negative, then the video
	 * playback has not yet reached the currently-specified loop.
	 */
	peek_seconds_after_loop_start(){
		var current_playhead_position = this.media_object.currentTime + 0.0;
		return current_playhead_position - this.get_current_loop_start_seconds();
	}
	
	
	/**
	 * Calculates the position of the playhead, in seconds, before the end of the
	 * currently specified loop. If the returned number is positive, the current time
	 * is before the loop's end time. If the returned number is negative, then the video
	 * playback has already passed the currently-specified loop.
	 */
	peek_seconds_before_loop_end(){
		var current_playhead_position = this.media_object.currentTime + 0.0;
		return this.get_current_loop_end_seconds() - current_playhead_position;
	}
	
	
	/**
	 * Checks whether the video playhead is actually within the specified loop. 
	 * Returns true if so, or false if not. For example, the playhead may not have
	 * yet entered the looping region, in which case, false will be returned.
	 */
	is_playing_within_currently_specified_loop(){
		if(
			this.peek_seconds_after_loop_start() >= 0
			&& this.peek_seconds_before_loop_end() >= 0
		){
			return true;
		}
		
		return false;
	}
	
	


	set_playback_loop(loop_index){
		const newScopeThis = this;
		
		var thisMediaObject = this.media_object;
		
		this.new_current_loop_index = loop_index;
		
		var current_loop_start_time = this.get_current_loop_start_seconds();
		var current_loop_end_time = this.get_current_loop_end_seconds();
		
		var thisEndTimeMilliseconds = current_loop_end_time * 1000.0;
		
		
		//Clear any previous loops and listeners.
		thisMediaObject.ontimeupdate = null;
		
		function timeout_repeater() {
			setTimeout(function () {
				if (newScopeThis.new_current_loop_index == loop_index) {
					thisMediaObject.currentTime = current_loop_start_time;
					timeout_repeater();
				}

				//the timeout delay until the next loop depends on the current playhead position.
			}, (thisEndTimeMilliseconds - thisMediaObject.currentTime * 1000.0));
		};
		
		//Detect whenever the playhead enters the looped area, and control appropriately.
		//This listener, once the right conditions are reached, should act exactly once.
		thisMediaObject.ontimeupdate = function () {

			//Detect when the playhead enters the time range. 
			//When it does, invoke the first call to timeout_repeater().
			//Also, other parts of the interactive animation rely on knowing when this happens.
			if (
				thisMediaObject.currentTime >= current_loop_start_time
				&& thisMediaObject.currentTime < current_loop_end_time
			) {
				//Clear the listener once activated so it doesn't waste browser resources.
				thisMediaObject.ontimeupdate = null;

				//Now, activate the timeout_repeater().
				timeout_repeater();
			}


		}
	}



	/**
	* Invoking this method MIGHT gently start a transition to the next loop of a video
    * to play, once the current loop finishes. 
	* 
	* The transition will only be permitted if the playhead is already within the current loop, 
	* in order to prevent the user repeatedly pressing the button and inadvertently 
	* advancing the animation.
	* 
	* Optionally, if you provide a non-null HTML DOM element, that element
	* will be notified with an Event with text "flag_transition_was_invoked".
	* @param optionally, HTML DOM element optional_element_as_event_listener
	*/
	flag_transition(optional_element_as_event_listener) {
		//ensure that if the video wasn't already playing, 
		//that the manual user interaction causes it to play.
		console.log("flag_transition attempted");
		if (this.media_object != null) {
			console.log("this.media_object is not null");
			if (this.media_object.paused) {
				console.log("is paused");
				this.media_object.play();
				console.log("is still paused? " + this.media_object.paused);
			}
		}
		else {
			console.log("this.media_object is null");
		}
		
		if(this.is_playing_within_currently_specified_loop()){
			console.log("flag_transition to next loop accepted");
			this.set_playback_loop(this.peek_at_next_loop_index());
		}
		else{
			console.log("flag_transition rejected because playhead not yet ready");
		}
		if(optional_element_as_event_listener != null){
			optional_element_as_event_listener.dispatchEvent(new Event("flag_transition_was_invoked"));
		}
	}
	
	
	
	//---------------------------------------------------------------------------------//
	//-- NARRATIVE --------------------------------------------------------------------//
	//---------------------------------------------------------------------------------//

	/**
	 * Maps a string of narrative text to an integer frame number.
	 * The order of addition does not matter.
	 * @param {any} int_frame
	 * @param {any} string_text
	 */
	add_narrative_frame(narrative_frame) {
		this.narrative_frames.push(narrative_frame);
	}




	/**
	 * Calculates and returns the appropriate narrative text, between any of the
	 * two closest frames in time.
	 * @param {any} float_seconds
	 */
	get_narrative_text_at_time(float_seconds) {
		var newScopeThis = this;

		var approximate_frame_at_seconds = (float_seconds + 0.0) * this.frames_per_second;
		var return_string = "";

		var closest_frame_from_before_time = -Infinity;
		var closest_frame_from_after_time = Infinity;

		var map_entries_iterator = newScopeThis.narrative_frames.entries();
		for (var i = 0; i < newScopeThis.narrative_frames.length; i++) {
			var entry_at_i = map_entries_iterator.next().value;
			var frame_number_inspected = entry_at_i[1].get_frame().get_frame_number();
			var value_at_i = entry_at_i[1].get_narrative_text();

			if (frame_number_inspected > approximate_frame_at_seconds) {
				if (frame_number_inspected < closest_frame_from_after_time) {
					closest_frame_from_after_time = frame_number_inspected;

					//approaching from 'after' frames is currently not used; the logic is outlined just in case.
				}
			}
			else if (frame_number_inspected <= approximate_frame_at_seconds) {
				if (frame_number_inspected > closest_frame_from_before_time) {
					closest_frame_from_before_time = frame_number_inspected;

					//getting closer, so save this as a possible return value.
					return_string = value_at_i;
				}
			}
			
		}
		
		return return_string + "";
	}



	/**
	 * This returns a string, for time-based 'flavor' text, that might change over time in an
	 * interface. Returns the appropriate string for the current time of media playback.
	 */
	get_current_narrative_text_on_timeline() {
		var current_time = this.media_object.currentTime;
		return this.get_narrative_text_at_time(current_time);
	}

}



