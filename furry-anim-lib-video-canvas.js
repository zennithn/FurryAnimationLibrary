/**
 * ZENNITH'S FURRY ANIMATION LIBRARY (VERSION 2023-09)
 * This HTML and associated Javascript application was written by Zennith. Copyright 2020,2023.
 * It is covered by a GPL-3.0-or-later license. Please note disclaimers of liability in the 
 * GPL-3.0-or-later license apply in full force if you use this program.
 */
 
 
/**
 * Visually encapsulates a video, and allows for layering e.g. of elements or translucent
 * images on top of the video.
 * This class is not concerned with sound. Note - the returned media object from 
 * get_media_object() will be muted by default. Sound of the media object must be
 * controlled externally.
 */
class VideoCanvas {
	constructor(video_file_name) {
		var newScopeThis = this;

		this.VIDEO_SOURCE = video_file_name;

		this.VIDEO_IS_VISIBLE = false;

		this.canvas_video_div = document.createElement("div");
		this.canvas_video_div.id = "canvas_video";

		this.video_element = document.createElement("video");
		this.canvas_video_div.appendChild(this.video_element);
		this.video_element.id = "video_element";
		this.video_element.loop = true;
		this.video_element.autoplay = false;
		this.video_element.preload = "auto";
		this.video_element.muted = true;
		this.video_element.src = this.VIDEO_SOURCE;

		this.video_canvas_foreground = document.createElement("div");
		this.canvas_video_div.appendChild(this.video_canvas_foreground);
		this.video_canvas_foreground.className = "no_user_select";
		this.video_canvas_foreground.id = "video_canvas_foreground";
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
			
			this.video_canvas_foreground.style.backgroundImage = "url('" + string_filename_of_image + "')";
			
		}
	}


	/**
	 * Returns the video's apparent position, in pixels, from the top of the window.
	 * The returned position is what the user actually sees, after all underlying
	 * transforms from parents are applied.
	 */
	get_video_top() {
		//console.log("get_video_top");
		//console.log("this.video_element.offsetTop: " + this.video_element.offsetTop);
		//console.log("this.video_element.clientHeight / 2: " + this.video_element.clientHeight / 2);
		
		var calc_result = this.video_element.offsetTop - this.video_element.clientHeight / 2;
		return calc_result;
	}
	
	
	/**
	 * Returns the video's height, in pixels.
	 * The returned height is what the user actually sees, after all underlying
	 * transforms from parents are applied.
	 */
	get_video_height() {
		return this.video_element.clientHeight;
	}

	/**
	 * Returns the video's apparent position, in pixels, from the left of the window.
	 * The returned position is what the user actually sees, after all underlying
	 * transforms from parents are applied.
	 */
	get_video_left() {
		//console.log("get_video_left");
		//console.log("this.video_element.offsetLeft: " + this.video_element.offsetLeft);
		//console.log("this.video_element.clientWidth / 2: " + this.video_element.clientWidth / 2);
		
		var calc_result = this.video_element.offsetLeft - this.video_element.clientWidth / 2;
		return calc_result;
	}

	/**
	 * Returns the video's width, in pixels.
	 * The returned height is what the user actually sees, after all underlying
	 * transforms from parents are applied.
	 */
	get_video_width() {
		return this.video_element.clientWidth;
	}

	add_element(element_on_top) {
		this.canvas_video_div.appendChild(element_on_top);
	}

	get_media_object() {
		return this.video_element;
	}

	get_canvas_div() {
		return this.canvas_video_div;
	}
	
	get_is_muted(){
		return this.video_element.muted;
	}
	
	set_mute(boolean_is_muted){
		this.video_element.muted = boolean_is_muted;
	}

	get_is_visible() {
		return this.VIDEO_IS_VISIBLE;
	}

	set_is_visible(boolean_is_visible) {
		this.VIDEO_IS_VISIBLE = boolean_is_visible;

		if (boolean_is_visible) {
			this.canvas_video_div.style.display = "visible";
			this.canvas_video_div.style.opacity = "1";
		}
		else {
			this.canvas_video_div.style.display = "hidden";
			this.canvas_video_div.style.opacity = "0";
		}
	}
}