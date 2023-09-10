/**
 * ZENNITH'S FURRY ANIMATION LIBRARY (VERSION 2023-09)
 * This HTML and associated Javascript application was written by Zennith. Copyright 2020,2023.
 * It is covered by a GPL-3.0-or-later license. Please note disclaimers of liability in the 
 * GPL-3.0-or-later license apply in full force if you use this program.
 */
 
 

class AudioAmbient {
	
	constructor(string_filename_audio_src, audio_ambient_loop_length){
		this.IS_MUTED = true;
		this.AUTOPLAY_WAS_SUCCESSFUL = false;
		this.audio_ambient_loop_length = audio_ambient_loop_length;

		this.audio_loop_a = document.createElement("audio");
		this.audio_loop_a.autoplay = false;
		this.audio_loop_a.preload = "auto";
		this.audio_loop_a.muted = this.IS_MUTED;
		this.audio_loop_a.src = string_filename_audio_src;
		this.audio_loop_a.volume = 0.04;

		this.audio_loop_b = document.createElement("audio");
		this.audio_loop_b.autoplay = false;
		this.audio_loop_b.preload = "auto";
		this.audio_loop_b.muted = this.IS_MUTED;
		this.audio_loop_b.src = string_filename_audio_src;
		this.audio_loop_b.volume = 0.04;


		//start the timeout oscillator. 
		const newScopeThis = this;

		function oscillate(audio_option_1, audio_option_2, oscillation_time_millis) {
			var audio_loop_promise = audio_option_1.play();
			if (audio_loop_promise !== undefined) {
				audio_loop_promise.then(_ => {
					newScopeThis.AUTOPLAY_WAS_SUCCESSFUL = true;
				}).catch(error => {
					newScopeThis.AUTOPLAY_WAS_SUCCESSFUL = false;
				});
			}
			setTimeout(function () {
				oscillate(audio_option_2, audio_option_1, oscillation_time_millis);
			}, oscillation_time_millis);
		}
		
		oscillate(newScopeThis.audio_loop_a, newScopeThis.audio_loop_b, newScopeThis.audio_ambient_loop_length);
	}


	/**
	 * Intended to keep the audio's playhead moving, so that if the user unmutes
	 * the animation, it will resume play from the appropriate spot. However,
	 * this method is not yet implemented.
	 */
	ensure_audio_playing_even_if_muted() {
		/*if (!this.audio_loop_a.playing && !this.audio_loop_b.playing) {
			var newScopeThis = this;
			var audio_loop_promise = this.audio_loop_a.play();
			if (audio_loop_promise !== undefined) {
				audio_loop_promise.then(_ => {
					newScopeThis.AUTOPLAY_WAS_SUCCESSFUL = true;
				}).catch(error => {
					newScopeThis.AUTOPLAY_WAS_SUCCESSFUL = false;
				});
			}
		}*/
	}
	
	set_mute(boolean_set_muted) {
		
		this.ensure_audio_playing_even_if_muted();
		/*
		if (this.AUTOPLAY_WAS_SUCCESSFUL == false) {
			this.audio_loop_a.play();
		}*/

		this.audio_loop_a.muted = boolean_set_muted;
		this.audio_loop_b.muted = boolean_set_muted;
		this.IS_MUTED = boolean_set_muted;
		
	}

	is_muted() {
		return this.IS_MUTED;
	}
	
}

